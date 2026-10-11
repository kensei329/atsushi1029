import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { HeroVideo, SoundButton } from "@/components/HeroVideo";
import { Marquee } from "@/components/Marquee";
import { SupportBanner } from "@/components/SupportBanner";
import { MoreLink, NewsItem, SectionTitle } from "@/components/ui";
import { VideoCard } from "@/components/VideoCard";
import { photos } from "@/data/gallery";
import { ageAt, profile } from "@/data/profile";
import { chapters } from "@/data/story";
import { getKarateResults, getNewsList, getVideos } from "@/lib/content";
import { hasPublicFile } from "@/lib/images";

export default async function Home() {
  const [latestNews, videos, results] = await Promise.all([getNewsList(3), getVideos(), getKarateResults()]);
  const featured = videos.filter((v) => v.category === "match").slice(0, 3);
  const latest = results[0];
  const gallery = photos.filter((p) => hasPublicFile(p.src));

  const stats = [
    { value: `${ageAt(profile.birthday)}`, unit: "歳", label: "挑戦開始" },
    { value: "25", unit: "年", label: "ぶりの道着" },
    { value: "初段", unit: "", label: "再取得" },
    { value: latest?.placement ?? "-", unit: "", label: latest ? `${latest.event}` : "直近の大会" },
  ];

  return (
    <>
      {/* Hero：赤選手（白石篤司）を追尾したハイライト動画 */}
      <section className="relative h-[calc(100svh-3.5rem-4rem)] min-h-[560px] overflow-hidden bg-ink text-white md:h-[calc(100svh-4rem)] md:max-h-[820px]">
        <HeroVideo>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30 md:bg-gradient-to-r md:from-ink/90 md:via-ink/30 md:to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-8 md:justify-center md:pb-0">
          <p className="font-display text-xs tracking-[0.25em] text-aka md:text-sm">FORMER PRO KICKBOXER × KARATE-DO</p>
          <h1 className="mt-2 text-[2.5rem] font-black leading-[1.1] tracking-wide drop-shadow-lg md:text-7xl">
            40歳、
            <br />
            再び道着を
            <br />
            締める。
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 drop-shadow md:text-base">
            元プロキックボクサー・白石篤司。目指すは<strong className="text-white">全日本空手道連盟マスターズ優勝</strong>。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex h-12 items-center rounded-full bg-aka px-6 text-sm font-black tracking-wider shadow-lg hover:bg-aka/90"
            >
              挑戦の物語を読む
            </Link>
            <SoundButton />
          </div>
        </div>
        </HeroVideo>
      </section>

      <Marquee />

      {/* Stats */}
      <section className="border-b border-ink/10">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-6 text-center ${i % 2 ? "" : "border-r"} border-ink/10 md:border-r md:last:border-r-0`}>
              <dd className="font-display text-4xl font-bold md:text-5xl">
                {s.value}
                <span className="font-sans text-base font-black">{s.unit}</span>
              </dd>
              <dt className="mt-1 text-xs font-bold text-ink/55">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* News */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <SectionTitle en="NEWS" ja="最新ニュース" />
        <div className="border-t border-ink/10">
          {latestNews.map((n) => (
            <NewsItem key={n.slug} item={n} />
          ))}
        </div>
        <div className="mt-6 text-right">
          <MoreLink href="/news">ニュース一覧</MoreLink>
        </div>
      </section>

      {/* Video */}
      <section className="bg-ink/[0.03]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionTitle en="VIDEO" ja="西村祭りの試合動画" accent="ao" />
          <div className="grid gap-8 md:grid-cols-3">
            {featured.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
          <div className="mt-8 text-right">
            <MoreLink href="/videos">動画一覧</MoreLink>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <SectionTitle en="STORY" ja="挑戦のストーリー" />
        <ol className="grid gap-4 md:grid-cols-3">
          {chapters.map((c) => (
            <li key={c.number}>
              <Link
                href={`/profile#chapter-${c.number}`}
                className="group flex h-full flex-col border-2 border-ink p-5 shadow-[6px_6px_0_var(--color-aka)] transition-all hover:-translate-y-1 hover:bg-ink hover:text-white hover:shadow-[6px_6px_0_var(--color-ao)]"
              >
                <span className="font-display text-sm tracking-[0.3em] text-aka">CHAPTER {c.number}</span>
                <span className="mt-2 text-lg font-black leading-snug">{c.title}</span>
                <span className="mt-2 text-xs font-bold opacity-60">{c.dateLabel}</span>
                <span className="mt-4 line-clamp-3 text-sm opacity-75">{c.paragraphs[0]}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="relative overflow-hidden bg-[#f6f1e7]">
          <div
            className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(var(--color-ink)_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionTitle en="GALLERY" ja="道場の外の、白石篤司" accent="ao" />
            <Gallery photos={gallery} />
          </div>
        </section>
      )}

      {/* Goal */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="relative mx-auto w-full max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/oyako.jpg"
              alt="大会会場の看板前で拳を構える白石篤司と息子"
              className="aspect-[3/4] w-full rotate-2 rounded-sm border-8 border-white object-cover object-top shadow-2xl"
              loading="lazy"
            />
            <span className="animate-float absolute -left-3 -top-4 rounded-full bg-aka px-4 py-2 text-sm font-black shadow-lg">
              親子優勝！
            </span>
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.3em] text-aka">GOAL</p>
            <h2 className="mt-2 text-3xl font-black leading-snug md:text-4xl">
              目指すは、
              <br />
              マスターズ日本一。
            </h2>
            <p className="mt-5 leading-relaxed text-white/75">
              キックボクシングの癖を削ぎ落とし、脱力からの緩急を身につける。変則蹴り「スコーピオンキック」の習得にも挑む。
              息子と並んで畳に立つ「親子優勝」も、もうひとつの目標だ。
            </p>
            <p className="mt-6 border-l-4 border-aka pl-4 text-lg font-bold">
              「キックボクサーから空手の動きに合わせてきたが、まだこれから。修行します」
            </p>
          </div>
        </div>
      </section>

      <SupportBanner />
    </>
  );
}
