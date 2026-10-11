"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { shareText, shareUrl, siteName } from "@/lib/seo";

/** サイトを共有する。対応端末は OS の共有シート、それ以外は LINE / X / コピーの選択肢を画面下に表示 */
export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: siteName, text: shareText, url: shareUrl });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return;
      }
    }
    setOpen(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      window.prompt("このURLをコピーしてください", shareUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enc = encodeURIComponent;
  const options = [
    { label: "LINEで送る", href: `https://line.me/R/share?text=${enc(`${shareText}\n${shareUrl}`)}`, cls: "bg-[#06C755] text-white" },
    { label: "Xでポスト", href: `https://x.com/intent/post?text=${enc(shareText)}&url=${enc(shareUrl)}`, cls: "bg-ink text-white" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={onShare}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border-2 border-white px-4 text-sm font-black text-white active:scale-95 md:h-9"
        aria-label="このサイトを共有"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
        </svg>
        共有
      </button>

      {/* ヘッダーの backdrop-filter 内では fixed が画面基準にならないため body 直下に描画 */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="共有">
          <div
            className="w-full max-w-md rounded-t-3xl bg-white px-4 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))] md:mb-8 md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-sm font-black">このサイトを共有する</p>
            <p className="mt-1 truncate text-center text-xs text-ink/50">{shareUrl}</p>
            <div className="mt-4 grid gap-3">
              {options.map((o) => (
                <a key={o.label} href={o.href} target="_blank" rel="noopener noreferrer" className={`flex h-14 items-center justify-center rounded-full text-base font-black ${o.cls}`}>
                  {o.label}
                </a>
              ))}
              <button type="button" onClick={copy} className="h-14 rounded-full border-2 border-ink text-base font-black">
                {copied ? "コピーしました！" : "リンクをコピー"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="h-14 rounded-full bg-ink/5 text-base font-black text-ink/70">
                閉じる
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
