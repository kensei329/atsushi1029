import type { Metadata } from "next";
import { ogp } from "@/lib/seo";
import { PageHero, SectionTitle } from "@/components/ui";
import { VideoCard } from "@/components/VideoCard";
import type { VideoCategory } from "@/data/types";
import { getVideos } from "@/lib/content";

export const metadata: Metadata = {
  title: "試合動画",
  description: "西村祭りの試合映像と、キックボクシング時代の映像。赤（AKA）が白石篤司。",
  ...ogp({ title: "試合動画 | 白石篤司 40歳からの挑戦", description: "西村祭りの試合映像と、キックボクシング時代の映像。赤（AKA）が白石篤司。", path: "/videos" }),
};

const sections: { category: VideoCategory; en: string; ja: string; accent: "aka" | "ao" }[] = [
  { category: "match", en: "MATCH", ja: "大会の試合映像", accent: "aka" },
  { category: "training", en: "TRAINING", ja: "日々の稽古", accent: "ao" },
  { category: "technique", en: "TECHNIQUE", ja: "技の練習（スコーピオンキック ほか）", accent: "aka" },
  { category: "kickboxing", en: "KICKBOXING", ja: "キックボクシング時代", accent: "ao" },
];

export default async function VideosPage() {
  const all = await getVideos();
  // 動画がまだないカテゴリは表示しない
  const visible = sections.filter((s) => all.some((v) => v.category === s.category));
  return (
    <>
      <PageHero en="VIDEO" ja="試合動画" lead="西村祭りの試合映像と、キックボクシング時代の映像。赤（AKA）が白石篤司です。" />
      <nav className="border-b border-ink/10 bg-white/95 backdrop-blur md:sticky md:top-16 md:z-30">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 text-xs font-bold">
          {visible.map((s) => (
            <li key={s.category} className="shrink-0">
              <a href={`#${s.category}`} className="block rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-ink">
                {s.ja.replace(/（.*）/, "")}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mx-auto max-w-6xl px-4">
        {visible.map((s) => {
          const list = all.filter((v) => v.category === s.category);
          return (
            <section key={s.category} id={s.category} className="scroll-mt-32 py-12">
              <SectionTitle en={s.en} ja={s.ja} accent={s.accent} />
              <div className="grid gap-8 md:grid-cols-2">
                {list.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
