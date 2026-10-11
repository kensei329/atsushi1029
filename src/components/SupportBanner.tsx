import Link from "next/link";
import { crowdfunding } from "@/data/crowdfunding";

export function SupportBanner() {
  return (
    <section className="relative overflow-hidden bg-aka text-white">
      <div className="absolute -right-10 -top-10 size-60 rounded-full border-[24px] border-white/10" aria-hidden />
      <div className="absolute -bottom-16 left-1/3 size-40 rounded-full border-[18px] border-ao/40" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-white/80">CROWDFUNDING</p>
          <h2 className="mt-1 text-2xl font-black leading-snug md:text-4xl">
            {crowdfunding.title}
            <br />
            <span className="text-lg md:text-2xl">{crowdfunding.catchCopy}</span>
          </h2>
        </div>
        <Link
          href="/support"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-8 py-4 text-base font-black text-aka shadow-lg transition-transform hover:-rotate-2 hover:scale-105 md:self-auto"
        >
          押忍！応援する <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
