"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, navItems } from "./nav";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-sm bg-ink text-sm font-black text-white">白</span>
          <span className="leading-tight">
            <span className="block text-[15px] font-black tracking-wider">白石 篤司</span>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-aka">40歳からの挑戦</span>
          </span>
        </Link>
        <nav aria-label="メインメニュー" className="hidden md:block">
          <ul className="flex gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block px-4 py-2 text-sm font-bold transition-colors ${
                      active ? "text-aka" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {active && <span className="absolute inset-x-4 -bottom-[13px] h-[3px] bg-aka" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
