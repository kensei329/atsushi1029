import type { Metadata, Viewport } from "next";
import { Klee_One, Noto_Sans_JP, Oswald } from "next/font/google";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { profile } from "@/data/profile";
import "./globals.css";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-noto", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-oswald", display: "swap" });
const klee = Klee_One({ subsets: ["latin"], weight: ["600"], variable: "--font-klee", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "白石篤司 40歳からの挑戦 〜全日本空手道連盟マスターズ優勝への軌跡〜",
    template: "%s | 白石篤司 40歳からの挑戦",
  },
  description:
    "元プロキックボクサー白石篤司が、40歳から空手道に復帰し、全日本空手道連盟マスターズ優勝を目指す挑戦の記録。試合動画・戦績・ニュースを発信します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "白石篤司 40歳からの挑戦",
  },
  twitter: { card: "summary_large_image", creator: "@tm040103" },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${noto.variable} ${oswald.variable} ${klee.variable}`}>
      <body className="min-h-dvh antialiased">
        <Header />
        <main className="pb-24 md:pb-0">{children}</main>
        <footer className="bg-ink pb-24 text-white/70 md:pb-0">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black tracking-wider text-white">白石 篤司</p>
              <p className="mt-1 text-xs">{profile.dojo.name}所属 / {profile.rank}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold">
              {profile.sns.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {s.label} {s.handle}
                </a>
              ))}
              <a href={profile.dojo.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {profile.dojo.name}
              </a>
              <Link href="/profile" className="hover:text-white">
                プロフィール
              </Link>
              <Link href="/support" className="hover:text-white">
                クラウドファンディング
              </Link>
            </div>
            <p className="text-[11px]">© {new Date().getFullYear()} Atsushi Shiraishi</p>
          </div>
          <div className="flex h-1">
            <span className="flex-1 bg-aka" />
            <span className="flex-1 bg-ao" />
          </div>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
