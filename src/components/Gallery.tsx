"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/data/gallery";

const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

/** ポラロイド風フォトギャラリー（タップで拡大） */
export function Gallery({ photos }: { photos: Photo[] }) {
  const tags = ["すべて", ...Array.from(new Set(photos.map((p) => p.tag)))];
  const [tag, setTag] = useState("すべて");
  const [open, setOpen] = useState<Photo | null>(null);
  const list = tag === "すべて" ? photos : photos.filter((p) => p.tag === tag);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {tags.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                tag === t ? "bg-aka text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setOpen(p)}
              className={`group block w-full bg-white p-2 pb-3 text-left shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-105 ${tilts[i % tilts.length]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" className="aspect-square w-full object-cover object-top" />
              <span className="mt-2 block font-hand text-[13px] font-bold leading-snug text-ink/80">{p.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.caption}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setOpen(null)}
        >
          <figure className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.src} alt={open.alt} className="max-h-[80vh] w-auto rounded-sm object-contain" />
            <figcaption className="mt-3 text-center text-sm font-bold text-white">{open.caption}</figcaption>
          </figure>
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-2xl text-white"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
