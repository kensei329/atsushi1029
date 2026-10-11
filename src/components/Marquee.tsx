const words = ["押忍！", "OSU!", "40歳からの挑戦", "KARATE-DO", "目指せマスターズ日本一", "親子優勝", "SCORPION KICK", "元プロキックボクサー"];

/** 流れるテキスト帯（赤・青コーナー） */
export function Marquee({ tone = "aka" }: { tone?: "aka" | "ao" }) {
  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden py-3 text-white ${tone === "aka" ? "bg-aka" : "bg-ao"}`} aria-hidden>
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap font-display text-lg tracking-wider">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w}
            <span className="opacity-60">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
