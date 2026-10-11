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
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:mb-8 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                tag === t ? "bg-aka text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      {/* スマホ：左右スワイプで送るカルーセル / PC：グリッド */}
      <ul
        className={`-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[14%] py-6 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:gap-x-4 md:gap-y-8 md:overflow-visible md:px-0 md:py-0 [&::-webkit-scrollbar]:hidden ${columns}`}
      >
        {list.map((p, i) => (
          <li key={p.src} className="w-[72%] shrink-0 snap-center md:w-auto">
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

      <p className="mt-1 text-center text-xs font-bold text-ink/45 md:hidden">← 左右にスワイプ ／ タップで拡大 →</p>

      {open !== null && <Lightbox photos={list} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
