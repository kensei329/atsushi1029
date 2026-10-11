"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/hero";

/** ファーストビューのハイライト動画（スマホ＝縦型 / PC＝横型）＋再生位置に連動したキャプション */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<typeof heroVideo.mobile | null>(null);
  const [caption, setCaption] = useState(0);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const pick = () => setSrc(mq.matches ? heroVideo.desktop : heroVideo.mobile);
    pick();
    mq.addEventListener("change", pick);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => mq.removeEventListener("change", pick);
  }, []);

  const onTime = () => {
    const t = ref.current?.currentTime ?? 0;
    let idx = 0;
    heroVideo.captions.forEach((c, i) => {
      if (t >= c.from) idx = i;
    });
    setCaption(idx);
  };

  return (
    <>
      {src && (
        <video
          key={src.src}
          ref={ref}
          className="absolute inset-0 size-full object-cover"
          src={src.src}
          poster={src.poster}
          autoPlay={!reduced}
          muted={muted}
          loop
          playsInline
          preload="auto"
          onTimeUpdate={onTime}
          aria-label="白石篤司 試合ハイライト動画"
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-center px-4 md:top-auto md:bottom-12 md:justify-end md:px-10">
        <p
          key={caption}
          className="animate-caption rounded-sm bg-ink/70 px-4 py-2 text-center text-sm font-black tracking-wider text-white backdrop-blur-sm md:text-lg"
        >
          <span className="mr-2 text-aka">●</span>
          {heroVideo.captions[caption].text}
        </p>
      </div>
      {heroVideo.hasAudio && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute right-4 top-4 z-10 rounded-full bg-ink/70 px-3 py-2 text-xs font-bold text-white backdrop-blur"
          aria-pressed={!muted}
        >
          {muted ? "🔇 音を出す" : "🔊 ミュート"}
        </button>
      )}
    </>
  );
}
