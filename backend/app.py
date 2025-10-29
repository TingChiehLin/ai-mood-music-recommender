from flask import Flask, request, jsonify
import os
import openai
import requests
from supabase import create_client

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

openai.api_key = os.getenv("OPENAI_API_KEY")
YOUTUBE_KEY = os.getenv("YOUTUBE_API_KEY")
# SUPABASE_URL = os.getenv("SUPABASE_URL")
# SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


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


def youtube_search(query, max_results=1):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_KEY,
    }
    r = requests.get(url, params=params, timeout=10).json()
    results = []
    for item in r.get("items", []):
        vid = item["id"]["videoId"]
        title = item["snippet"]["title"]
        results.append(
            {
                "videoId": vid,
                "title": title,
                "url": f"https://www.youtube.com/watch?v={vid}",
            }
        )
    return results


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    mood_text = data.get("mood")
    # user_id = data.get("user_id")
    try:
        ai = call_openai_for_recommendations(mood_text)
    except Exception as e:
        return jsonify({"error": "LLM failed", "detail": str(e)}), 500

    # Resolve some YouTube videos for top keywords
    youtube_results = []
    for k in ai.get("keywords", [])[:6]:
        r = youtube_search(k, max_results=1)
        if r:
            youtube_results.append(r[0])

    # save to supabase
    # supabase.table("mood_requests").insert(
    #     {
    #         "user_id": user_id,
    #         "mood_text": mood_text,
    #         "ai_payload": ai,
    #         "youtube_results": youtube_results,
    #     }
    # ).execute()

    return jsonify({"ai": ai, "youtube": youtube_results})
