import Link from "next/link";
import { MoreLink, NewsItem, SectionTitle } from "@/components/ui";
import { VideoCard } from "@/components/VideoCard";
import { ageAt, profile } from "@/data/profile";
import { chapters } from "@/data/story";
import { getKarateResults, getNewsList, getVideos } from "@/lib/content";

export default async function Home() {
  const [latestNews, videos, results] = await Promise.all([getNewsList(3), getVideos(), getKarateResults()]);
  const featured = videos.filter((v) => v.category === "match").slice(0, 2);
  const latest = results[0];

  const stats = [
    { value: `${ageAt(profile.birthday)}`, unit: "歳", label: "挑戦開始" },
    { value: "25", unit: "年", label: "ぶりの道着" },
    { value: "初段", unit: "", label: "再取得" },
    { value: latest?.placement ?? "-", unit: "", label: "直近の大会" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/kumite.jpg"
          alt="赤帯を締め、試合に臨む白石篤司"
          className="absolute inset-0 size-full object-cover object-[50%_30%] opacity-60 md:left-auto md:w-1/2 md:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent md:bg-gradient-to-r md:from-ink md:from-50% md:via-ink/40 md:via-65% md:to-transparent" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 md:min-h-[600px] md:justify-center md:pb-16">
          <p className="text-[11px] font-black tracking-[0.2em] text-aka md:text-xs md:tracking-[0.35em]">FORMER PRO KICKBOXER × KARATE-DO</p>
          <h1 className="mt-3 text-[2.6rem] font-black leading-[1.1] tracking-wide md:text-7xl">
            40歳、
            <br />
            再び道着を
            <br />
            締める。
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
            元プロキックボクサー・白石篤司。25年のブランクを経て、空手道へ。
            目指すは<strong className="text-white">全日本空手道連盟マスターズ優勝</strong>。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/profile" className="rounded-sm bg-aka px-5 py-3 text-sm font-black tracking-wider hover:bg-aka/90">
              挑戦の物語を読む
            </Link>
            <Link
              href="/videos"
              className="rounded-sm border border-white/60 px-5 py-3 text-sm font-black tracking-wider hover:bg-white hover:text-ink"
            >
              試合動画を見る
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink/10">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-6 text-center ${i % 2 ? "" : "border-r"} border-ink/10 md:border-r md:last:border-r-0`}>
              <dd className="text-3xl font-black md:text-4xl">
                {s.value}
                <span className="text-base">{s.unit}</span>
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
          <SectionTitle en="VIDEO" ja="直近の試合動画" accent="ao" />
          <div className="grid gap-8 md:grid-cols-2">
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
                className="group flex h-full flex-col border-2 border-ink p-5 transition-colors hover:bg-ink hover:text-white"
              >
                <span className="text-xs font-black tracking-[0.3em] text-aka">CHAPTER {c.number}</span>
                <span className="mt-2 text-lg font-black leading-snug">{c.title}</span>
                <span className="mt-2 text-xs font-bold opacity-60">{c.dateLabel}</span>
                <span className="mt-4 line-clamp-3 text-sm opacity-75">{c.paragraphs[0]}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Oyako */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/oyako.jpg"
            alt="大会会場の看板前で拳を構える白石篤司と息子"
            className="mx-auto aspect-[3/4] w-full max-w-sm rounded-md object-cover object-top"
            loading="lazy"
          />
          <div>
            <p className="text-xs font-black tracking-[0.3em] text-aka">GOAL</p>
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
    </>
  );
}
