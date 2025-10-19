"use client";
import { useCallback, useState } from "react";
import type { Video, AIResult } from "@/lib/type";

type UseRecommendReturn = {
  loading: boolean;
  error: string | null;
  ai: AIResult | null;
  videos: Video[];
  recommend: (mood: string) => Promise<void>;
  clear: () => void;
};

export function useRecommend(): UseRecommendReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<AIResult | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const recommend = useCallback(async (mood: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });

      const text = await resp.text();

      // robust parse
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!resp.ok) {
        const msg =
          data?.error || data?.detail || data?.raw || resp.statusText || "Unknown";
        setError(`Server error (${resp.status}): ${msg}`);
        setAi(null);
        setVideos([]);
        return;
      }

      // keep typing: assume shape { ai: AIResult, youtube: Video[] }
      setAi(data.ai ?? null);
      setVideos(data.youtube ?? []);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setAi(null);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAi(null);
    setVideos([]);
    setError(null);
  }, []);

  return { loading, error, ai, videos, recommend, clear };
}
