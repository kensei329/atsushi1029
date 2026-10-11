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
| `/support` | Karatedo クラウドファンディング（目標・使いみち・リターン） |

スマホ表示では画面下部に固定ナビ（ホーム／試合動画／戦績／プロフィール／ニュース）、PCではヘッダーナビを表示します。

## コンテンツの更新

現在のコンテンツは `src/data/` 配下の TypeScript ファイルで管理しています。

- ニュース：`src/data/news.ts`
- 動画：`src/data/videos.ts`（YouTube は ID、自前動画は `public/videos/` に配置）
- 戦績：`src/data/records.ts`
- プロフィール・物語：`src/data/profile.ts`, `src/data/story.ts`

データ取得は `src/lib/content.ts` に集約しているため、microCMS などのヘッドレスCMSを導入する際は
この関数群を API 呼び出しに置き換えるだけで各ページはそのまま使えます（型は `src/data/types.ts`）。

- クラウドファンディング：`src/data/crowdfunding.ts`（`projectUrl` を設定すると支援ボタンが有効化）
- ギャラリー写真：`src/data/gallery.ts`（`public/images/gallery/` にファイルを置いたものだけ表示）

## ハイライト動画（ファーストビュー）

赤（AKA）選手＝白石篤司を色検出で自動追尾してズームし、スロー・フラッシュ・カラーグレーディングを加えた
約30秒の動画を縦型（スマホ用）・横型（PC用）で生成します。

```bash
pip install opencv-python-headless numpy
python3 scripts/build_highlight.py 試合1.mp4 試合2.mp4 試合3.mp4 [--bgm 許諾済み音源.mp3]
```

BGM は Web サイトでの利用が許諾された音源のみ使用してください（市販曲・TV番組のテーマ曲などは不可）。
BGM を合成したら `src/data/hero.ts` の `hasAudio` を `true` にするとミュート解除ボタンが表示されます。

## favicon / OGP

```bash
pip install pillow
python3 scripts/build_brand_assets.py   # src/app/icon.png, apple-icon.png, favicon.ico, opengraph-image.jpg を生成
```

## 未確定・今後の追加候補

- クラウドファンディングの目標金額・リターン内容（現在は案）と掲載先
- 稽古・技（スコーピオンキック等）の動画（追加されたカテゴリから自動で表示）
- ハイライト動画の BGM（利用許諾済み音源）
