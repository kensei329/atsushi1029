// コンテンツ取得の窓口。現在はローカルデータを返すが、
// microCMS 等のヘッドレスCMS導入時はここを API 呼び出しに差し替えるだけで済むようにしている。
import { news } from "@/data/news";
import { videos } from "@/data/videos";
import { karateResults } from "@/data/records";

const byDateDesc = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

export async function getNewsList(limit?: number) {
  const list = [...news].sort(byDateDesc);
  return limit ? list.slice(0, limit) : list;
}

export async function getNews(slug: string) {
  return news.find((n) => n.slug === slug) ?? null;
}

export async function getVideos() {
  return [...videos].sort(byDateDesc);
}

export async function getKarateResults() {
  return [...karateResults].sort(byDateDesc);
}

export function formatDate(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${y}.${m}.${d}`;
}
