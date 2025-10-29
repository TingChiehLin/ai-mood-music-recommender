"use client";
import React, { useState } from "react";

export type Video = {
  videoId: string;
  title: string;
  url: string;
  tags?: string[];
};

export default function VideoCard({
  video,
  onPlay,
}: {
  video: Video;
  onPlay?: (id: string) => void;
}) {
  const [play, setPlay] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

  function handlePlay() {
    setPlay(true);
    if (onPlay) onPlay(video.videoId);
  }

  return (
    <article className="bg-slate-100  backdrop-blur-md rounded-2xl shadow overflow-hidden">
      <div className="relative aspect-video">
        {!play ? (
          <button
            aria-label={`Play ${video.title}`}
            onClick={handlePlay}
            className="cursor-pointer w-full h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          >
            <div className="p-3 rounded-full bg-black/50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        ) : (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="h-36 p-6 flex flex-col justify-between">
        <h3 className="cursor- text-left text-sm text-slate-700 font-semibold line-clamp-2">
          {video.title}
        </h3>

        {/* <div className="bg-red-300 h-32 text-black-300 mt-2 flex items-center gap-4 flex-wrap">
            {(video.tags || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div> */}

        <div className="mt-auto flex items-center justify-between">
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-xs text-slate-400 hover:underline"
          >
            Open on YouTube
          </a>
        </div>
      </div>
    </article>
  );
}
