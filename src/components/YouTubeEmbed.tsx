"use client";

import { useState } from "react";

/** クリックするまで iframe を読み込まない軽量 YouTube 埋め込み */
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-ink">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`${title}を再生`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="size-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <PlayBadge />
        </button>
      )}
    </div>
  );
}

export function PlayBadge() {
  return (
    <span className="absolute inset-0 grid place-items-center">
      <span className="grid size-16 place-items-center rounded-full bg-aka/90 text-white shadow-lg transition-transform group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}
