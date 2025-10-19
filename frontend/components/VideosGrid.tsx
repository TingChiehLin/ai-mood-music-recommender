"use client";
import React from "react";
import VideoCard, { Video as VC } from "@/components/VideoCard";
import type { Video } from "@/lib/type";

type Props = {
  videos: Video[];
  onPlay?: (id: string) => void;
  columns?: number;
};

export default function VideosGrid({ videos, onPlay, columns = 2 }: Props) {
  // simple responsive grid — you can tune tailwind classes
  const gridCols =
    columns === 1 ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3";

  if (!videos || videos.length === 0)
    return <p className="text-sm text-slate-500">No videos found.</p>;

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {videos.map((v) => (
        <VideoCard key={v.videoId} video={v as VC} onPlay={onPlay} />
      ))}
    </div>
  );
}
