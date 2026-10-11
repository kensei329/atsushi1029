import type { Video, VideoCategory } from "./types";

export const videoCategoryLabel: Record<VideoCategory, string> = {
  match: "試合",
  training: "稽古",
  technique: "技",
  kickboxing: "キックボクシング時代",
};

export const videos: Video[] = [
  {
    id: "2026-10-11-match-1",
    title: "西村祭り 一般の部 組手 試合映像①",
    date: "2026-10-11",
    category: "match",
    description: "赤（AKA）が白石篤司。一回りも二回りも若い選手たちが集うトーナメント。",
    source: { type: "file", src: "/videos/2026-10-11-match-1.mp4", poster: "/images/match-1-poster.jpg" },
  },
  {
    id: "2026-10-11-match-2",
    title: "西村祭り 一般の部 組手 試合映像②",
    date: "2026-10-11",
    category: "match",
    description: "最終結果は4位。3位決定戦はブザービーターで惜敗。",
    source: { type: "file", src: "/videos/2026-10-11-match-2.mp4", poster: "/images/match-2-poster.jpg" },
  },
  {
    id: "2026-10-11-match-3",
    title: "西村祭り 一般の部 組手 試合映像③",
    date: "2026-10-11",
    category: "match",
    description: "赤（AKA）が白石篤司。キックボクシング仕込みの踏み込み。",
    source: { type: "file", src: "/videos/2026-10-11-match-3.mp4", poster: "/images/match-3-poster.jpg" },
  },
  {
    id: "kick-mPj58tdSpSE",
    title: "キックボクシング時代 試合映像①",
    date: "",
    category: "kickboxing",
    description: "プロキックボクサーとしてリングで戦っていた頃の映像。",
    source: { type: "youtube", youtubeId: "mPj58tdSpSE" },
  },
  {
    id: "kick-SXEy1zkmusU",
    title: "キックボクシング時代 試合映像②",
    date: "",
    category: "kickboxing",
    description: "プロキックボクサーとしてリングで戦っていた頃の映像。",
    source: { type: "youtube", youtubeId: "SXEy1zkmusU" },
  },
];
