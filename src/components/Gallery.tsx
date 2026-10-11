"use client";

import { useState } from "react";
import type { Photo } from "@/data/gallery";
import { Lightbox } from "./Lightbox";

const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

/** ポラロイド風フォトギャラリー（タップで拡大し、左右スワイプで切り替え） */
export function Gallery({ photos, filter = true, columns = "md:grid-cols-3 lg:grid-cols-4" }: { photos: Photo[]; filter?: boolean; columns?: string }) {
  const tags = ["すべて", ...Array.from(new Set(photos.map((p) => p.tag)))];
  const [tag, setTag] = useState("すべて");
  const [open, setOpen] = useState<number | null>(null);
  const list = tag === "すべて" ? photos : photos.filter((p) => p.tag === tag);

  return (
    <>
      {filter && tags.length > 2 && (
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
      <ul className={`grid grid-cols-2 gap-x-4 gap-y-8 ${columns}`}>
        {list.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${p.caption}（拡大表示）`}
              className={`group block w-full bg-white p-2 pb-3 text-left shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-105 ${tilts[i % tilts.length]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} loading="lazy" className="aspect-square w-full object-cover object-top" />
              <span className="mt-2 block font-hand text-[13px] font-bold leading-snug text-ink/80">{p.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Lightbox photos={list} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
