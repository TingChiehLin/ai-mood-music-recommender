"use client";
import React, { useState } from "react";

type Props = {
  onSubmit: (mood: string) => Promise<void> | void;
  isLoading?: boolean;
};

const PRESETS = [
  { label: "Relax", mood: "calm, relaxed, slow tempo" },
  { label: "Focus", mood: "focused, no vocals, instrumental" },
  { label: "Boost", mood: "energetic, pump up, driving beats" },
  { label: "Sleep", mood: "sleepy, ambient, soft piano" },
];

export default function MoodForm({ onSubmit, isLoading = false }: Props) {
  const [mood, setMood] = useState("");
  const [charCount, setCharCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = mood.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
  }

  function applyPreset(m: string) {
    setMood(m);
    setCharCount(m.length);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby="mood-help"
      className="space-y-4"
    >
      <label htmlFor="mood" className="text-sm font-medium">
        How are you feeling?
      </label>

      <div className="relative">
        <input
          id="mood"
          value={mood}
          onChange={(e) => {
            setMood(e.target.value);
            setCharCount(e.target.value.length);
          }}
          placeholder="e.g. anxious but hopeful, cozy and sleepy..."
          className="w-full rounded-xl px-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
          aria-label="Describe your mood"
          disabled={isLoading}
          maxLength={140}
        />
        <div className="text-xs text-slate-500 absolute right-3 bottom-2">
          {charCount}/140
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p.label}
            onClick={() => applyPreset(p.mood)}
            className="px-3 py-1 rounded-full border border-slate-200 text-sm hover:bg-violet-50 transition"
            aria-label={`Use preset ${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Thinking...
            </>
          ) : (
            "Recommend"
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setMood("");
            setCharCount(0);
          }}
          className="text-sm px-3 py-1 rounded-md border"
        >
          Clear
        </button>

        <p id="mood-help" className="text-sm text-slate-500 ml-auto">
          Try a short phrase — we’ll generate a soothing playlist.
        </p>
      </div>
    </form>
  );
}
