import type { Metadata } from "next";
import { PageHero, SectionTitle } from "@/components/ui";
import { VideoCard } from "@/components/VideoCard";
import type { VideoCategory } from "@/data/types";
import { getVideos } from "@/lib/content";

export const metadata: Metadata = { title: "試合動画" };

const sections: { category: VideoCategory; en: string; ja: string; accent: "aka" | "ao" }[] = [
  { category: "match", en: "MATCH", ja: "大会の試合映像", accent: "aka" },
  { category: "training", en: "TRAINING", ja: "日々の稽古", accent: "ao" },
  { category: "technique", en: "TECHNIQUE", ja: "技の練習（スコーピオンキック ほか）", accent: "aka" },
  { category: "kickboxing", en: "KICKBOXING", ja: "キックボクシング時代", accent: "ao" },
];

export default async function VideosPage() {
  const videos = await getVideos();
  return (
    <>
      <PageHero en="VIDEO" ja="試合動画" lead="大会の試合映像、日々の稽古、技の練習、そしてキックボクシング時代の映像。" />
      <nav className="sticky top-14 z-30 border-b border-ink/10 bg-white/95 backdrop-blur md:top-16">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 text-xs font-bold">
          {sections.map((s) => (
            <li key={s.category} className="shrink-0">
              <a href={`#${s.category}`} className="block rounded-full border border-ink/20 px-3 py-1.5 hover:border-ink">
                {s.ja.replace(/（.*）/, "")}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mx-auto max-w-6xl px-4">
        {sections.map((s) => {
          const list = videos.filter((v) => v.category === s.category);
          return (
            <section key={s.category} id={s.category} className="scroll-mt-32 py-12">
              <SectionTitle en={s.en} ja={s.ja} accent={s.accent} />
              {list.length ? (
                <div className="grid gap-8 md:grid-cols-2">
                  {list.map((v) => (
                    <VideoCard key={v.id} video={v} />
                  ))}
                </div>
              ) : (
                <p className="rounded-md border border-dashed border-ink/20 px-4 py-10 text-center text-sm text-ink/50">
                  動画は準備中です。公開をお楽しみに。
                </p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
