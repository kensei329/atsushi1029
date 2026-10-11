import Link from "next/link";
import type { News } from "@/data/types";
import { formatDate } from "@/lib/content";

export function SectionTitle({ en, ja, accent = "aka" }: { en: string; ja: string; accent?: "aka" | "ao" }) {
  return (
    <div className="mb-6 md:mb-8">
      <p className={`text-xs font-black tracking-[0.3em] ${accent === "aka" ? "text-aka" : "text-ao"}`}>{en}</p>
      <h2 className="mt-1 text-2xl font-black tracking-wide md:text-3xl">{ja}</h2>
      <span className="mt-3 flex h-1 w-16">
        <span className="flex-1 bg-aka" />
        <span className="flex-1 bg-ao" />
      </span>
    </div>
  );
}

export function PageHero({ en, ja, lead, image }: { en: string; ja: string; lead?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 size-full object-cover object-[70%_30%] opacity-45" />
      )}
      {image && <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />}
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-aka/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16">
        <p className="text-xs font-black tracking-[0.35em] text-aka">{en}</p>
        <h1 className="mt-2 text-3xl font-black tracking-wide md:text-5xl">{ja}</h1>
        {lead && <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">{lead}</p>}
      </div>
    </section>
  );
}

export function NewsItem({ item }: { item: News }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex gap-4 border-b border-ink/10 py-4 transition-colors hover:bg-ink/[0.02]"
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image.src} alt="" className="size-20 shrink-0 rounded-sm object-cover md:size-24" />
      ) : (
        <span className="grid size-20 shrink-0 place-items-center rounded-sm bg-ink text-2xl font-black text-white md:size-24">
          空
        </span>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-bold">
          <time className="text-ink/50">{formatDate(item.date)}</time>
          <span className="rounded-sm border border-ao px-1.5 text-ao">{item.category}</span>
        </div>
        <h3 className="mt-1 font-bold leading-snug group-hover:text-aka">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{item.excerpt}</p>
      </div>
    </Link>
  );
}

export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-sm font-black tracking-wider hover:border-aka hover:text-aka"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}
