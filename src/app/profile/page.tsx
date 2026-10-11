import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { PageHero, SectionTitle } from "@/components/ui";
import { photos } from "@/data/gallery";
import { hasPublicFile } from "@/lib/images";
import { ageAt, profile } from "@/data/profile";
import { chapters, storyEpilogue } from "@/data/story";
import { formatDate } from "@/lib/content";

export const metadata: Metadata = { title: "プロフィール" };

export default function ProfilePage() {
  const offMat = photos.filter((p) => (p.tag === "仕事" || p.tag === "仲間" || p.tag === "家族") && hasPublicFile(p.src));
  const rows: [string, React.ReactNode][] = [
    ["生年月日", `${formatDate(profile.birthday)}（${ageAt(profile.birthday)}歳）`],
    ["身長", profile.height],
    ["血液型", profile.bloodType],
    [
      "所属",
      <a key="dojo" href={profile.dojo.url} target="_blank" rel="noopener noreferrer" className="underline decoration-aka underline-offset-4">
        {profile.dojo.name}
      </a>,
    ],
    ["段位", profile.rank],
    ["学歴", profile.education.join(" → ")],
    ["目標", <strong key="goal" className="text-aka">{profile.goal}</strong>],
    [
      "SNS",
      profile.sns.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ao underline-offset-4">
          {s.label} {s.handle}
        </a>
      )),
    ],
  ];

  return (
    <>
      <PageHero en="PROFILE" ja="プロフィール" lead={profile.catchCopy} image="/images/gallery/work-1.jpg" />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[2fr_3fr] md:py-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/kumite.jpg"
          alt="白石篤司"
          className="aspect-[3/4] w-full rounded-md object-cover object-[50%_25%]"
        />
        <div>
          <p className="text-xs font-black tracking-[0.3em] text-aka">{profile.nameEn}</p>
          <h2 className="mt-1 text-4xl font-black tracking-wider">{profile.name}</h2>
          <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 py-3 text-sm">
                <dt className="font-bold text-ink/50">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-ink/[0.03]">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <SectionTitle en="STORY" ja="白石篤司の物語" />
          <div className="space-y-14">
            {chapters.map((c) => (
              <article key={c.number} id={`chapter-${c.number}`} className="scroll-mt-24">
                <p className="text-xs font-black tracking-[0.3em] text-aka">CHAPTER {c.number}</p>
                <h3 className="mt-1 text-2xl font-black leading-snug">{c.title}</h3>
                <p className="mt-1 text-xs font-bold text-ao">{c.dateLabel}</p>
                <div className="mt-5 space-y-4 leading-loose text-ink/85">
                  {c.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {c.bullets && (
                  <ul className="mt-5 space-y-3">
                    {c.bullets.map((b) => (
                      <li key={b.title} className="rounded-md border-l-4 border-ao bg-white p-4 shadow-sm">
                        <p className="font-black">{b.title}</p>
                        <p className="mt-1 text-sm text-ink/75">{b.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
            <div className="space-y-4 border-t-2 border-ink pt-8 leading-loose">
              {storyEpilogue.map((p, i) => (
                <p key={i} className={i === storyEpilogue.length - 1 ? "font-bold" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {hasPublicFile("/images/gallery/work-2.jpg") && (
        <section className="relative overflow-hidden bg-ink text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/gallery/work-2.jpg" alt="" className="absolute inset-0 size-full object-cover object-[45%_30%] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent md:bg-gradient-to-l md:from-ink md:via-ink/70" />
          <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-end px-4 py-12 md:items-end md:justify-center md:text-right">
            <p className="font-display text-sm tracking-[0.3em] text-aka">BUSINESS × KARATE</p>
            <h2 className="mt-2 text-3xl font-black leading-snug md:text-5xl">
              仕事も、空手も、
              <br />
              真剣勝負。
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              平日はビジネスの現場で仲間と向き合い、稽古では高校生たちと汗を流す。どちらにも全力なのが、白石篤司のスタイルだ。
            </p>
          </div>
        </section>
      )}

      {offMat.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SectionTitle en="ON & OFF" ja="畳の外の素顔" accent="ao" />
          <Gallery photos={offMat} />
        </section>
      )}
    </>
  );
}
