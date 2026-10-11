// ギャラリー写真。public 配下にファイルがあるものだけ表示される（lib/images.ts）。
export type Photo = { src: string; alt: string; caption: string; tag: "空手" | "家族" | "仲間" | "仕事" };

export const photos: Photo[] = [
  { src: "/images/kumite.jpg", alt: "赤帯を締め、試合を待つ白石篤司", caption: "西村祭り、出番前。", tag: "空手" },
  { src: "/images/oyako.jpg", alt: "大会会場の看板前で拳を構える白石篤司と息子", caption: "親子優勝、目指すぞー！", tag: "家族" },
  { src: "/images/gallery/oyako-selfie.jpg", alt: "道着姿で観客席に座る白石篤司と息子", caption: "観客席で親子ショット", tag: "家族" },
  { src: "/images/gallery/son-peace.jpg", alt: "福岡の道着でピースする息子の創太郎くん", caption: "創太郎、福岡の道着でピース", tag: "家族" },
  { src: "/images/gallery/with-senpai.jpg", alt: "空手大会の会場で大先輩とファイティングポーズ", caption: "空手大会の会場で、大先輩と", tag: "空手" },
  { src: "/images/gallery/taekwondo-kids.jpg", alt: "テコンドー道場で息子たちと笑顔の白石篤司", caption: "海外のテコンドー道場で、息子たちと。創太郎の夢はYouTuber！", tag: "家族" },
  { src: "/images/gallery/with-friend.jpg", alt: "夜の屋上で仲間とファイティングポーズ", caption: "仲間とファイティングポーズ", tag: "仲間" },
  { src: "/images/gallery/shiroya.jpg", alt: "田んぼの前で「白屋」の袋を持つ白石篤司と仲間", caption: "「白屋」の仲間と、田んぼの前で", tag: "仲間" },
  { src: "/images/gallery/work-1.jpg", alt: "真剣な表情で話を聞く白石篤司", caption: "仕事の顔も、真剣勝負。", tag: "仕事" },
  { src: "/images/gallery/work-2.jpg", alt: "ミーティングで意見を交わす白石篤司", caption: "チームと一緒に。", tag: "仕事" },
];
