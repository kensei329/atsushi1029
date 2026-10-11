import type { Metadata } from "next";
import { Marquee } from "@/components/Marquee";
import { SectionTitle } from "@/components/ui";
import { crowdfunding as cf } from "@/data/crowdfunding";
import { profile } from "@/data/profile";
import { hasPublicFile } from "@/lib/images";

const friends = [
  { src: "/images/gallery/with-senpai.jpg", caption: "空手の大先輩と", tilt: "-rotate-3" },
  { src: "/images/gallery/with-friend.jpg", caption: "仲間とファイティングポーズ", tilt: "rotate-2" },
  { src: "/images/gallery/shiroya.jpg", caption: "「白屋」の仲間と", tilt: "-rotate-1" },
  { src: "/images/gallery/taekwondo-kids.jpg", caption: "息子たちも応援団！", tilt: "rotate-3" },
];

export const metadata: Metadata = {
  title: "Karatedo クラウドファンディング",
  description: "元プロキックボクサー白石篤司の、全日本空手道連盟マスターズ優勝への挑戦を応援するクラウドファンディング。",
};

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default function SupportPage() {
  const open = Boolean(cf.projectUrl);
  const pct = Math.min(100, Math.round((cf.raised / cf.goal) * 100));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/kumite.jpg" alt="" className="absolute inset-0 size-full object-cover object-[50%_25%] opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
          <p className="font-display text-sm tracking-[0.35em] text-aka">KARATE-DO CROWDFUNDING</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            <span className="font-display tracking-wide">Karatedo</span>
            <br />
            クラウドファンディング
          </h1>
          <p className="mt-4 text-lg font-bold md:text-2xl">{cf.catchCopy}</p>

          {/* 進捗 */}
          <div className="mx-auto mt-10 max-w-xl rounded-md bg-white p-5 text-left text-ink shadow-2xl md:p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold text-ink/50">現在の支援総額</p>
                <p className="font-display text-4xl font-bold">{yen(cf.raised)}</p>
              </div>
              <p className="font-display text-3xl font-bold text-aka">{pct}%</p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-gradient-to-r from-aka to-ao" style={{ width: `${Math.max(pct, 2)}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <dt className="font-bold text-ink/50">目標金額</dt>
                <dd className="mt-0.5 font-black">{yen(cf.goal)}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink/50">支援者</dt>
                <dd className="mt-0.5 font-black">{cf.supporters}人</dd>
              </div>
              <div>
                <dt className="font-bold text-ink/50">期間</dt>
                <dd className="mt-0.5 font-black">{cf.period}</dd>
              </div>
            </dl>
            <SupportButton open={open} url={cf.projectUrl} className="mt-5 w-full" />
          </div>
        </div>
      </section>

      <Marquee tone="ao" />

      {/* Message */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <SectionTitle en="MESSAGE" ja="応援してくださる皆さまへ" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/face.png" alt="白石篤司" className="size-24 shrink-0 rounded-full border-4 border-aka" />
          <div className="relative rounded-2xl bg-ink/[0.04] p-6 leading-loose">
            {cf.message.map((p, i) => (
              <p key={i} className={i ? "mt-4" : ""}>
                {p}
              </p>
            ))}
            <p className="mt-4 text-right font-black">{profile.name}</p>
          </div>
        </div>
      </section>

      {/* Friends */}
      {friends.some((f) => hasPublicFile(f.src)) && (
        <section className="relative overflow-hidden bg-[#f6f1e7]">
          <div
            className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(var(--color-ink)_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
            <SectionTitle en="TEAM SHIRAISHI" ja="いっしょに戦う仲間たち" accent="ao" />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {friends
                .filter((f) => hasPublicFile(f.src))
                .map((f) => (
                  <li key={f.src} className={`bg-white p-2 pb-3 shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-transform hover:rotate-0 hover:scale-105 ${f.tilt}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.src} alt={f.caption} loading="lazy" className="aspect-square w-full object-cover object-top" />
                    <p className="mt-2 font-hand text-[13px] font-bold">{f.caption}</p>
                  </li>
                ))}
            </ul>
            <p className="mt-10 text-center text-lg font-black">
              あなたも <span className="text-aka">TEAM SHIRAISHI</span> の一員に。押忍！
            </p>
          </div>
        </section>
      )}

      {/* Uses */}
      <section className="bg-ink/[0.03]">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <SectionTitle en="USE OF FUNDS" ja="支援金の使いみち" accent="ao" />
          <div className="mb-6 flex h-4 overflow-hidden rounded-full">
            {cf.uses.map((u, i) => (
              <span key={u.label} style={{ width: `${u.ratio}%` }} className={["bg-aka", "bg-ao", "bg-ink", "bg-ink/40"][i]} />
            ))}
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {cf.uses.map((u, i) => (
              <li key={u.label} className="flex gap-4 rounded-md bg-white p-5 shadow-sm">
                <span className={`mt-1 size-4 shrink-0 rounded-full ${["bg-aka", "bg-ao", "bg-ink", "bg-ink/40"][i]}`} />
                <div>
                  <p className="font-black">
                    {u.label} <span className="font-display text-aka">{u.ratio}%</span>
                  </p>
                  <p className="mt-1 text-sm text-ink/65">{u.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rewards */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <SectionTitle en="RETURN" ja="リターン" />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cf.rewards.map((r) => (
            <li
              key={r.price}
              className={`relative flex flex-col rounded-md border-2 p-6 transition-transform hover:-translate-y-1 ${
                "popular" in r && r.popular ? "border-aka shadow-[6px_6px_0_var(--color-aka)]" : "border-ink shadow-[6px_6px_0_var(--color-ink)]"
              }`}
            >
              {"popular" in r && r.popular && (
                <span className="absolute -top-3 right-4 rotate-3 rounded-full bg-aka px-3 py-1 text-xs font-black text-white">人気！</span>
              )}
              <p className="font-display text-4xl font-bold">{yen(r.price)}</p>
              <p className="mt-1 font-black text-aka">{r.name}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {r.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="text-ao">✓</span>
                    {it}
                  </li>
                ))}
              </ul>
              <SupportButton open={open} url={cf.projectUrl} className="mt-6 w-full" small />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-ink/50">
          ※ リターン内容・目標金額は公開時に変更となる場合があります。支援のお手続きはクラウドファンディングサイト上で行います。
        </p>
      </section>

      {/* Share */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-aka">SHARE</p>
          <h2 className="mt-2 text-2xl font-black">シェアも、大きな応援です。</h2>
          <p className="mt-3 text-sm text-white/70">X で白石篤司をフォロー＆シェアして、挑戦を広めてください。</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`https://x.com/intent/post?text=${encodeURIComponent("元プロキックボクサー白石篤司、40歳からマスターズ日本一への挑戦を応援しています！ #押忍 #空手")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 text-sm font-black text-ink hover:bg-aka hover:text-white"
            >
              X でシェアする
            </a>
            {profile.sns.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-white px-6 py-3 text-sm font-black hover:bg-white hover:text-ink"
              >
                {s.handle} をフォロー
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SupportButton({ open, url, className = "", small }: { open: boolean; url: string; className?: string; small?: boolean }) {
  const base = `inline-flex items-center justify-center rounded-full font-black tracking-wider ${small ? "px-5 py-3 text-sm" : "px-6 py-4 text-base"} ${className}`;
  if (!open) {
    return (
      <span className={`${base} cursor-not-allowed bg-ink/10 text-ink/50`} aria-disabled="true">
        近日公開！お楽しみに
      </span>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${base} bg-aka text-white shadow-lg hover:scale-[1.02]`}>
      押忍！このプロジェクトを支援する
    </a>
  );
}
