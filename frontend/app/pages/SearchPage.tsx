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
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-12">
        <h1 className="text-5xl font-bold">Mood Recommendation Music</h1>
        <p className="text-lg text-slate-500 mt-2">
          Tell me how you are feeling and it will create a mood playlist for
          you.
        </p>
      </header>

      <section className="">
        <MoodForm onSubmit={handleSubmit} isLoading={loading} />
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {ai && (
        <section className="mt-24 mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 gap-4">
            <div className="md:max-w-[65%]">
              <h2 className="text-left text-2xl font-semibold leading-tight">
                {ai.playlist_title}
              </h2>
              <p className="text-left text-sm text-slate-600 mt-2">
                {ai.description}
              </p>
            </div>

            <div className="flex flex-col items-end text-right gap-3 md:pl-6">
              <div className="inline-flex items-center gap-2 text-xs">
                {/* <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.15"
                  />
                  <path
                    d="M8 12h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg> */}
                <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-xs font-medium">
                  {ai.tone}
                </span>
              </div>

              {/* Genres as chips */}
              <div className="flex flex-wrap justify-end gap-2">
                {ai.genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-slate-50"
                    aria-label={`Genre ${g}`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <VideosGrid videos={videos} />

          <div className="mt-16 flex gap-2">
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
