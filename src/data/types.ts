// CMS（microCMS 等）導入時もこの型をそのまま API レスポンスのマッピング先として使う想定
export type VideoCategory = "match" | "training" | "technique" | "kickboxing";

export type Video = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: VideoCategory;
  description?: string;
  source: { type: "youtube"; youtubeId: string } | { type: "file"; src: string; poster: string };
};

export type NewsCategory = "大会" | "審査" | "稽古日誌" | "お知らせ";

export type News = {
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  body: string[]; // 段落ごと
  image?: { src: string; alt: string };
  link?: { href: string; label: string };
};

export type KarateResult = {
  id: string;
  date: string;
  event: string;
  division: string;
  placement: string;
  highlight?: boolean;
  bouts?: { round: string; opponent: string; result: "勝" | "敗"; note?: string }[];
  note?: string;
};

export type Chapter = {
  number: number;
  title: string;
  date: string;
  dateLabel: string;
  paragraphs: string[];
  bullets?: { title: string; text: string }[];
};
