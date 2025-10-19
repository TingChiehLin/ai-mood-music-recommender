export type Video = {
  videoId: string;
  title: string;
  url: string;
  tags?: string[];
};

export type AIResult = {
  playlist_title: string;
  description: string;
  genres: string[];
  tone: string;
  keywords: string[];
};
