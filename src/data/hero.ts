// ホーム・ファーストビューのハイライト動画（scripts/build_highlight.py で生成）
export const heroVideo = {
  mobile: { src: "/videos/hero-highlight-v.mp4", poster: "/images/hero-highlight-v.jpg" },
  desktop: { src: "/videos/hero-highlight-h.mp4", poster: "/images/hero-highlight-h.jpg" },
  // 許諾済み BGM を合成したら true にするとミュート解除ボタンを表示
  hasAudio: true,
  musicCredit: "BGM：葉加瀬太郎「情熱大陸」",
  // 動画の再生位置（秒）に合わせて切り替わるキャプション
  captions: [
    { from: 0, text: "元プロキックボクサー、白石篤司。" },
    { from: 2.5, text: "25年ぶりに、道着を締めた。" },
    { from: 8.4, text: "40歳。一回り以上若い強豪と、真っ向勝負。" },
    { from: 13.4, text: "息子と一緒に、親子優勝を目指して。" },
    { from: 15.4, text: "キックボクシング仕込みの踏み込み。" },
    { from: 22.5, text: "結果は4位。でも、まだ始まったばかり。" },
    { from: 27.0, text: "目指すは、マスターズ日本一。" },
  ],
};
