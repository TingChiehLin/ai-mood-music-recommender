import os
import json
from datetime import datetime
import hashlib
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any, Iterator

from flask import Flask, request, jsonify

import openai
import requests

# --- config ---
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret")

openai.api_key = os.getenv("OPENAI_API_KEY")
YOUTUBE_KEY = os.getenv("YOUTUBE_API_KEY")

CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)


# setup logging and testing
# logging.basicConfig(
#     filename="app.log",
#     level=logging.INFO,
#     format="%(asctime)s %(levelname)s %(message)s",
# )


@app.route("/", methods=["GET"])
def entry():
    return "Hello there, this is app mood recommendation"


def call_openai_for_recommendations(mood_text: str):
    prompt = f"""
You are a music therapist that converts a user's short mood description into music recommendation data.
Return a JSON object only, with keys:
- "playlist_title": short friendly title
- "description": 1 sentence description
- "genres": list of 2-4 genres
- "keywords": list of 4-6 search queries (song or artist or mood + genre)
- "tone": single-word tone (e.g., "uplifting", "calm", "nostalgic")
Example response: {{
  "playlist_title": "Calm Late Night",
  ...
}}

User mood: "{mood_text}"
"""
    resp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You output only JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=400,
    )
    text = resp.choices[0].message.content.strip()
    # Parse JSON safely
    import json

    return json.loads(text)


# File I/O helpers
def _cache_path_for_mood(mood: str) -> str:
    h = hashlib.sha256(mood.encode("utf-8")).hexdigest()[:16]
    return os.path.join(CACHE_DIR, f"{h}.json")


def save_json_atomic(path: str, data: dict) -> None:
    """Write JSON to disk atomically"""
    tmp = f"{path}.tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def load_json_if_exists(path: str) -> dict | None:
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def youtube_search(query, max_results=1):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_KEY,
    }

    try:
        r = requests.get(url, params=params, timeout=10)

        r.raise_for_status()  # check if request was successful (status 200)
        payload = r.json()  # parse the JSON after confirming success
    except requests.RequestException as e:
        logging.warning("youtube_search request failed for %r: %s", query, e)
        return []

    results = []
    for item in payload.get("items", []):
        vid = item.get("id", {}).get("videoId")
        title = item.get("snippet", {}).get("title")
        if not vid or not title:
            continue
        results.append(
            {
                "videoId": vid,
                "title": title,
                "url": f"https://www.youtube.com/watch?v={vid}",
            }
        )
    return results


# Recursion for keywords
# I use recursion for deeply nested playlist recommendations or hierarchical folder scanning.
# Recursively flatten nested keyword lists
# ["calm", ["night", ["relaxing"]]] => ["calm", "night", "relaxing"]
def flatten_keywords(keywords):
    flat = []
    for k in keywords:
        if isinstance(k, list):
            flat.extend(flatten_keywords(k))
        else:
            flat.append(k)
    return flat


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json or {}
    mood_text = (data.get("mood") or "").strip()
    if not mood_text:
        return jsonify({"error": "mood is required"}), 400

    cache_path = _cache_path_for_mood(mood_text)
    cached = load_json_if_exists(cache_path)
    if cached:
        logging.info("cache hit for mood: %s", mood_text)
        ai = cached
    else:
        try:
            ai = call_openai_for_recommendations(mood_text)
        except Exception as e:
            logging.exception("LLM call failed")
            return jsonify({"error": "LLM failed", "detail": str(e)}), 500
        # persist to cache
        try:
            save_json_atomic(cache_path, ai)
        except Exception:
            logging.exception("Failed to save cache for mood: %s", mood_text)

    # Resolve some YouTube videos for top keywords (handles nested lists)
    youtube_results = []
    flattened = flatten_keywords(ai.get("keywords", []))
    seen_kw = set()
    for k in flattened:
        if not isinstance(k, str):
            continue
        if k in seen_kw:
            continue
        seen_kw.add(k)
        r = youtube_search(k, max_results=1)
        if r:
            youtube_results.append(r[0])
        if len(youtube_results) >= 6:
            break

    # optionally save the recommendation to local log file for analysis
    try:
        save_recommendation_to_file(
            {"mood": mood_text, "ai": ai, "youtube": youtube_results}
        )
    except Exception:
        logging.exception("Failed to append recommendation log")

    return jsonify({"ai": ai, "youtube": youtube_results})


# Save recommendations locally for logs or analysis
def save_recommendation_to_file(data):
    filename = "recommendation_logs.txt"
    with open(filename, "a", encoding="utf-8") as f:
        f.write(f"\n[{datetime.now()}]\n")
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
