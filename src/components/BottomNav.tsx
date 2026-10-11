"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { isActive, navItems } from "./nav";

/** スマホ用：親指で操作しやすい画面下部固定ナビゲーション */
export function BottomNav() {
  const pathname = usePathname();
  // ホームではファーストビューの操作ボタンと重ならないよう、少しスクロールしてから表示
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  const showSupport = !pathname.startsWith("/support") && (pathname !== "/" || scrolled);
  return (
    <>
      {/* 親指で押せる位置に「応援する」ボタン（応援ページ自身では非表示） */}
      {showSupport && (
        <Link
          href="/support"
          className="fixed right-3 z-50 flex h-12 items-center gap-1 rounded-full border-2 border-white bg-aka px-5 text-sm font-black tracking-wider text-white shadow-[0_6px_20px_rgba(215,38,30,0.45)] active:scale-95 md:hidden"
          style={{ bottom: "calc(4rem + env(safe-area-inset-bottom) + 12px)" }}
        >
          押忍！応援する
        </Link>
      )}
    <nav
      aria-label="メインメニュー"
      className="obi fixed inset-x-0 bottom-0 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.35)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold tracking-wide transition-colors ${
                  active ? "kakomi text-[11px] font-black" : "text-white/70 active:text-white"
                }`}
              >
                {active && <span className="absolute inset-x-4 top-0 h-[3px] rounded-b bg-aka" />}
                <Icon name={item.icon} className={active ? "kakomi-icon size-6" : "size-6"} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
    </>
  );
}
