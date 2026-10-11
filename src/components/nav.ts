export const navItems = [
  { href: "/", label: "ホーム", en: "Home", icon: "home" },
  { href: "/videos", label: "試合動画", en: "Video", icon: "video" },
  { href: "/record", label: "戦績", en: "Record", icon: "record" },
  { href: "/profile", label: "プロフィール", en: "Profile", icon: "profile" },
  { href: "/news", label: "ニュース", en: "News", icon: "news" },
] as const;

export type NavIcon = (typeof navItems)[number]["icon"];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
