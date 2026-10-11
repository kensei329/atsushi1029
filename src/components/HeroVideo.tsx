"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/hero";

/**
 * ファーストビューのハイライト動画（スマホ＝縦型 / PC＝横型）。
 * 音声付き自動再生を試み、ブラウザに止められた場合はミュートで再生して
 * 訪問者がページに最初に触れた瞬間に音声付きで頭から再生し直す。
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [src, setSrc] = useState<typeof heroVideo.mobile | null>(null);
  const [muted, setMuted] = useState(!heroVideo.hasAudio);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const pick = () => setSrc(mq.matches ? heroVideo.desktop : heroVideo.mobile);
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  const playWithSound = useCallback(async (restart: boolean) => {
    const v = ref.current;
    if (!v) return false;
    v.muted = false;
    v.volume = 0.8;
    if (restart) v.currentTime = 0;
    try {
      await v.play();
      setMuted(false);
      return true;
    } catch {
      v.muted = true;
      setMuted(true);
      void v.play().catch(() => {});
      return false;
    }
  }, []);

  // 音声付きで開始。ブラウザの自動再生制限に掛かったら、最初の操作で音を出す
  useEffect(() => {
    if (!src || !heroVideo.hasAudio) return;
    let done = false;
    const events = ["pointerdown", "touchend", "click", "keydown"] as const;
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, onFirstGesture, true));
    function onFirstGesture(e: Event) {
      if (done) return;
      // ミュートボタン自体の操作はボタン側で処理する
      if (buttonRef.current?.contains(e.target as Node)) return;
      done = true;
      cleanup();
      void playWithSound(true);
    }
    void playWithSound(false).then((ok) => {
      if (ok) done = true;
      else events.forEach((e) => window.addEventListener(e, onFirstGesture, { capture: true, passive: true }));
    });
    return cleanup;
  }, [src, playWithSound]);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (muted) {
      void playWithSound(v.currentTime > 1 ? false : true);
    } else {
      v.muted = true;
      setMuted(true);
    }
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
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="白石篤司 試合ハイライト動画"
        />
      )}
      {heroVideo.hasAudio && (
        <>
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleSound}
            className="absolute right-4 top-4 z-10 rounded-full bg-ink/70 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur transition-transform hover:scale-105"
            aria-pressed={!muted}
          >
            {muted ? "🔇 タップで音が出ます" : "🔊 ミュート"}
          </button>
          <p className="absolute bottom-2 right-4 z-10 text-[10px] text-white/60">{heroVideo.musicCredit}</p>
        </>
      )}
    </>
  );
}
