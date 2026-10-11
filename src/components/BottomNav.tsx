"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { isActive, navItems } from "./nav";

/** スマホ用：親指で操作しやすい画面下部固定ナビゲーション */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-white/95 backdrop-blur md:hidden"
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
                  active ? "text-aka" : "text-ink/55 active:text-ink"
                }`}
              >
                {active && <span className="absolute inset-x-4 top-0 h-[3px] rounded-b bg-aka" />}
                <Icon name={item.icon} className="size-6" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
