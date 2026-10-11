"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, navItems } from "./nav";
import { ShareButton } from "./ShareButton";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/face.png" alt="" className="size-9 rounded-full" />
          <span className="leading-tight">
            <span className="block text-[15px] font-black tracking-wider">白石 篤司</span>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-aka">40歳からの挑戦</span>
          </span>
        </Link>
        <div className="md:hidden">
          <ShareButton />
        </div>
        <nav aria-label="メインメニュー" className="hidden items-center gap-2 md:flex">
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
          <ShareButton />
          <Link
            href="/support"
            className="ml-2 rounded-full bg-aka px-4 py-2 text-sm font-black tracking-wider text-white shadow transition-transform hover:-rotate-2 hover:scale-105"
          >
            応援する！
          </Link>
        </nav>
      </div>
    </header>
  );
}
