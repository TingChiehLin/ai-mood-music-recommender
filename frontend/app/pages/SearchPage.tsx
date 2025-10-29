"use client";
import React, { useCallback } from "react";
import MoodForm from "@/components/MoodForm";
import VideosGrid from "@/components/VideosGrid";
import { useRecommend } from "@/hooks/useRecommend";

export default function SearchPage() {
  const { loading, error, ai, videos, recommend, clear } = useRecommend();

  const handleSubmit = useCallback(
    async (mood: string) => {
      await recommend(mood);
    },
    [recommend]
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mb-auto">
      <header className="mb-6">
        <h1 className="text-5xl font-bold">Mood Recommendation Music</h1>
        <p className="text-lg text-slate-500 mt-2">
          Tell me how you are feeling and it will create a mood playlist for
          you.
        </p>
      </header>

      <section className="mb-6">
        <MoodForm onSubmit={handleSubmit} isLoading={loading} />
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {ai && (
        <section className="mt-24 mb-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{ai.playlist_title}</h2>
              <p className="text-sm text-slate-600 mt-1">{ai.description}</p>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div>{ai.tone}</div>
              <div className="mt-1">{ai.genres.join(", ")}</div>
            </div>
          </div>

          <div className="mt-4">
            <VideosGrid videos={videos} />
          </div>

          <div className="mt-4 flex gap-2">
            {/* <button
              onClick={() => {
                clear();
              }}
              className="px-3 py-1 rounded border text-sm"
            >
              Clear
            </button> */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm text-slate-600 ml-auto"
            >
              Back to top
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
