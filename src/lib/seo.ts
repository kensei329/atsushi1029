import type { Metadata } from "next";

export const siteName = "白石篤司 40歳からの挑戦";

// 共有ボタンで送るURL（LINE のアプリ内ブラウザではなく外部ブラウザで開かせる）
export const shareUrl = "https://atsushi1029.vercel.app/?openExternalBrowser=1";
export const shareText = "元プロキックボクサー白石篤司、40歳からの挑戦。全日本空手道連盟マスターズ優勝を目指す！";

// OGP 画像などの絶対URLの基準。未設定だと localhost になり、LINE・X 等で画像が表示されない
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://atsushi1029.vercel.app");

/**
 * 全ページ・全サービス（LINE / X / Facebook / note / Slack / Discord 等）共通の OGP 画像。
 * 画像を差し替えたら v を上げると、各サービスのキャッシュを回避しやすい。
 */
export const ogImage = {
  url: "/ogp.jpg?v=2",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "白石篤司 40歳からの挑戦 ― 40歳、再び道着を締める。全日本空手道連盟マスターズ優勝への挑戦",
};

/** ページごとの OGP（画像は常に共通） */
export function ogp({
  title,
  description,
  path = "/",
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  return {
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName, locale: "ja_JP", title, description, images: [ogImage] },
    twitter: { card: "summary_large_image", creator: "@tm040103", title, description, images: [ogImage] },
  };
}
