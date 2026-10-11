import type { Metadata } from "next";
import { PageHero, SectionTitle } from "@/components/ui";
import { gradings, kickboxingCareer } from "@/data/records";
import { formatDate, getKarateResults } from "@/lib/content";
import { MoreLink } from "@/components/ui";

export const metadata: Metadata = { title: "戦績" };

export default async function RecordPage() {
  const results = await getKarateResults();
  return (
    <>
      <PageHero en="RECORD" ja="戦績" lead="空手道復帰後の大会結果・昇段審査、そしてキックボクサー時代の記録。" />

      <div className="mx-auto max-w-6xl px-4">
        <section className="py-12">
          <SectionTitle en="KARATE-DO" ja="空手道 大会結果" />
          <ol className="relative space-y-6 border-l-2 border-ink/15 pl-6">
            {results.map((r) => (
              <li key={r.id} className="relative">
                <span className="absolute -left-[33px] top-1.5 size-4 rounded-full border-4 border-white bg-aka ring-2 ring-aka" />
                <time className="text-xs font-bold text-ink/50">{formatDate(r.date)}</time>
                <div className="mt-1 rounded-md border border-ink/10 p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{r.event}</h3>
                      <p className="text-sm text-ink/60">{r.division}</p>
                    </div>
                    <span className="rounded-sm bg-ink px-3 py-1 text-xl font-black text-white">{r.placement}</span>
                  </div>
                  {r.note && <p className="mt-3 text-sm leading-relaxed text-ink/75">{r.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-12">
          <SectionTitle en="GRADING" ja="昇段審査" accent="ao" />
          <ul className="grid gap-4 md:grid-cols-2">
            {gradings.map((g) => (
              <li key={g.date} className="flex items-center gap-4 rounded-md border border-ink/10 p-5">
                <span className="grid h-14 w-3 shrink-0 bg-ink" aria-hidden />
                <div>
                  <time className="text-xs font-bold text-ink/50">{formatDate(g.date)}</time>
                  <p className="text-lg font-black">{g.title}</p>
                  <p className="text-sm text-ink/60">{g.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-12">
          <SectionTitle en="KICKBOXING" ja="キックボクサー時代" />
          <div className="rounded-md bg-ink p-6 text-white md:p-8">
            <p className="text-xs font-black tracking-[0.3em] text-aka">FORMER PRO KICKBOXER</p>
            <p className="mt-3 leading-relaxed text-white/80">{kickboxingCareer.summary}</p>
            <div className="mt-6 [&_a]:border-white [&_a:hover]:border-aka">
              <MoreLink href="/videos#kickboxing">キックボクシング時代の映像</MoreLink>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
