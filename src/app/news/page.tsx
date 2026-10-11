import type { Metadata } from "next";
import { NewsItem, PageHero } from "@/components/ui";
import { getNewsList } from "@/lib/content";

export const metadata: Metadata = { title: "ニュース" };

export default async function NewsPage() {
  const list = await getNewsList();
  return (
    <>
      <PageHero en="NEWS" ja="ニュース" lead="大会エントリー情報、昇段審査の結果、日々の稽古の振り返り。" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="border-t border-ink/10">
          {list.map((n) => (
            <NewsItem key={n.slug} item={n} />
          ))}
        </div>
      </div>
    </>
  );
}
