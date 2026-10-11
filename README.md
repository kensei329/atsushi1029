# 白石篤司 40歳からの挑戦 〜全日本空手道連盟マスターズ優勝への軌跡〜

元プロキックボクサー・白石篤司が、40歳から空手道に復帰し、全日本マスターズ優勝を目指す挑戦を発信する公式サイト。

## 技術構成

- Next.js（App Router / 全ページ静的生成）
- Tailwind CSS v4（テーマカラーは `src/app/globals.css` の `@theme`）
  - `ink` 黒（黒帯） / `aka` 赤（赤コーナー） / `ao` 青（青コーナー） / `dogi` 白（道着）
- ホスティング：Vercel 推奨（`NEXT_PUBLIC_SITE_URL` に本番URLを設定すると OGP の絶対URLに使用）

## 開発

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## ページ構成

| パス | 内容 |
| --- | --- |
| `/` | ヒーロー、最新ニュース、直近の試合動画、ストーリー概要、目標 |
| `/videos` | 試合 / 稽古 / 技 / キックボクシング時代 の動画 |
| `/record` | 空手道の大会結果、昇段審査、キックボクサー時代 |
| `/profile` | プロフィールと「白石篤司の物語」（第1〜3章） |
| `/news`, `/news/[slug]` | ニュース一覧・詳細 |

スマホ表示では画面下部に固定ナビ（ホーム／試合動画／戦績／プロフィール／ニュース）、PCではヘッダーナビを表示します。

## コンテンツの更新

現在のコンテンツは `src/data/` 配下の TypeScript ファイルで管理しています。

- ニュース：`src/data/news.ts`
- 動画：`src/data/videos.ts`（YouTube は ID、自前動画は `public/videos/` に配置）
- 戦績：`src/data/records.ts`
- プロフィール・物語：`src/data/profile.ts`, `src/data/story.ts`

データ取得は `src/lib/content.ts` に集約しているため、microCMS などのヘッドレスCMSを導入する際は
この関数群を API 呼び出しに置き換えるだけで各ページはそのまま使えます（型は `src/data/types.ts`）。

## 未確定・今後の追加候補

- キックボクサー時代の詳細戦績（現在は「整理中」表示）
- 稽古・技（スコーピオンキック等）の動画
- お問い合わせフォーム、Instagram 等の SNS 連携
