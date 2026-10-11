"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/hero";

/**
 * ファーストビューのハイライト動画（スマホ＝縦型 / PC＝横型）。
 * 音声付き自動再生を試み、ブラウザに止められた場合はミュートで再生して
 * 訪問者がページに最初に触れた瞬間に音声付きで頭から再生し直す。
 */
type Sound = { muted: boolean; toggle: () => void; buttonRef: React.RefObject<HTMLButtonElement | null> };
const SoundContext = createContext<Sound | null>(null);

export function HeroVideo({ children }: { children: React.ReactNode }) {
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
    <SoundContext.Provider value={{ muted, toggle: toggleSound, buttonRef }}>
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
      {children}
      {heroVideo.hasAudio && (
        <p className="pointer-events-none absolute bottom-2 right-4 z-10 text-[10px] text-white/60">{heroVideo.musicCredit}</p>
      )}
    </SoundContext.Provider>
  );
}

/** 音声オン／オフ（ヒーロー下部の、親指が届く位置に置く） */
export function SoundButton() {
  const sound = useContext(SoundContext);
  if (!sound || !heroVideo.hasAudio) return null;
  return (
    <button
      ref={sound.buttonRef}
      type="button"
      onClick={sound.toggle}
      className="inline-flex h-12 items-center gap-1 rounded-full bg-white/15 px-4 text-sm font-black text-white backdrop-blur active:scale-95"
      aria-pressed={!sound.muted}
      aria-label={sound.muted ? "音を出す" : "ミュート"}
    >
      <span aria-hidden>{sound.muted ? "🔇" : "🔊"}</span>
      <span>{sound.muted ? "音を出す" : "音あり"}</span>
    </button>
  );
}
