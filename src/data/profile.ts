export const profile = {
  name: "白石 篤司",
  nameEn: "ATSUSHI SHIRAISHI",
  catchCopy: "元プロキックボクサー、40歳からの挑戦",
  birthday: "1985-10-29",
  height: "182cm",
  bloodType: "A型",
  dojo: { name: "新武館", url: "https://sites.google.com/site/shinbukankaratedo/" },
  rank: "全日本空手道連盟 初段",
  education: ["香春小学校", "香春中学校", "福岡県立田川高等学校", "福岡大学"],
  goal: "全日本空手道連盟マスターズ 優勝",
  sns: [{ label: "X（旧Twitter）", handle: "@tm040103", url: "https://x.com/tm040103" }],
} as const;

/** 生年月日から指定日時点の年齢を計算 */
export function ageAt(birthday: string, at: Date = new Date()): number {
  const [y, m, d] = birthday.split("-").map(Number);
  let age = at.getFullYear() - y;
  if (at.getMonth() + 1 < m || (at.getMonth() + 1 === m && at.getDate() < d)) age--;
  return age;
}
