# Vercel Deploy Checklist

## 初回設定

- Vercelで対象のGitHubリポジトリをImportする
- Framework Presetが`Astro`になっていることを確認する
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## ブランチ運用

- Production Branch: `main`
- Pull Request作成時にPreview Deployが生成されることを確認する

## 公開前チェック

- `/`、`/about`（末尾に Contact）、`/activities` が表示される
- `/activities/[slug]` の詳細ページが開ける
- `npm run build` が成功する
- sitemap (`/sitemap-index.xml`) が生成される

## 運用ルール

- 活動記事は `src/content/activities/` にMarkdownで追加する
- `draft: true` の記事は本番に表示されない
