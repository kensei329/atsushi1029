"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/data/gallery";

/** 写真の拡大表示。左右スワイプ（スクロールスナップ）・矢印・キーボードで切り替え、閉じるボタンは画面下部 */
export function Lightbox({ photos, start, onClose }: { photos: Photo[]; start: number; onClose: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);

  // 開いた写真の位置へ移動し、背面のスクロールを止める
  useEffect(() => {
    const el = track.current;
    if (el) el.scrollLeft = start * el.clientWidth;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [start]);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(photos.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="写真ギャラリー" className="fixed inset-0 z-[70] flex flex-col bg-black/95 text-white backdrop-blur-md">
      <p className="pt-[max(1rem,env(safe-area-inset-top))] text-center font-display text-sm tracking-widest text-white/70">
        {index + 1} / {photos.length}
      </p>

      <div className="relative min-h-0 flex-1">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((p, i) => (
            <figure key={p.src} className="flex h-full w-full shrink-0 snap-center flex-col items-center justify-center px-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading={Math.abs(i - start) <= 1 ? "eager" : "lazy"}
                className="max-h-[calc(100%-3rem)] max-w-full rounded-sm object-contain shadow-2xl"
                draggable={false}
              />
              <figcaption className="mt-3 text-center font-hand text-base font-bold">{p.caption}</figcaption>
            </figure>
          ))}
        </div>

        {index > 0 && (
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl hover:bg-white/30 md:grid"
            aria-label="前の写真"
          >
            ‹
          </button>
        )}
        {index < photos.length - 1 && (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl hover:bg-white/30 md:grid"
            aria-label="次の写真"
          >
            ›
          </button>
        )}
      </div>

      <div className="flex justify-center gap-2 py-2" aria-hidden>
        {photos.map((p, i) => (
          <span key={p.src} className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-aka" : "w-2 bg-white/40"}`} />
        ))}
      </div>
      <p className="text-center text-xs text-white/50 md:hidden">← 左右にスワイプ →</p>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={onClose}
          className="mx-auto flex h-14 w-full max-w-md items-center justify-center gap-2 rounded-full bg-white text-lg font-black text-ink shadow-lg active:scale-[0.98]"
        >
          <span aria-hidden>×</span> 閉じる
        </button>
      </div>
    </div>
  );
}
