import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MoreLink } from "@/components/ui";
import { ogp } from "@/lib/seo";
import { formatDate, getNews, getNewsList } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNewsList()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNews((await params).slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    ...ogp({ title: item.title, description: item.excerpt, path: `/news/${item.slug}`, type: "article" }),
  };
}

export default async function NewsDetail({ params }: Props) {
  const item = await getNews((await params).slug);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <div className="flex items-center gap-2 text-xs font-bold">
        <time className="text-ink/50">{formatDate(item.date)}</time>
        <span className="rounded-sm border border-ao px-1.5 text-ao">{item.category}</span>
      </div>
      <h1 className="mt-2 text-2xl font-black leading-snug md:text-3xl">{item.title}</h1>
      <span className="mt-4 flex h-1 w-16">
        <span className="flex-1 bg-aka" />
        <span className="flex-1 bg-ao" />
      </span>
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image.src} alt={item.image.alt} className="mt-8 max-h-[70vh] w-full rounded-md object-contain bg-ink/5" />
      )}
      <div className="mt-8 space-y-5 leading-loose">
        {item.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {item.link && (
        <a
          href={item.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-sm bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-aka"
        >
          {item.link.label}
        </a>
      )}
      <div className="mt-12">
        <MoreLink href="/news">ニュース一覧へ戻る</MoreLink>
      </div>
    </article>
  );
}
