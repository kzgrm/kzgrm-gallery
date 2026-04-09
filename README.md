# KZGRM Circle Website

Astro + Svelteで構築した、サークル向けの静的Webサイトです。  
Vercelへのデプロイを前提にしています。

## 技術スタック

- Astro
- Svelte（活動一覧のタグ絞り込みUI）
- Astro Content Collections（Markdown運用）
- Vercel Adapter

## ページ構成

- `/` トップ
- `/about` サークル紹介
- `/activities` 活動情報一覧
- `/activities/[slug]` 活動詳細
- `/contact` お問い合わせ

## ディレクトリ

```text
src/
  components/
    ActivityFilter.svelte
  content/
    activities/
      *.md
  content.config.ts
  layouts/
    Layout.astro
  pages/
    index.astro
    about.astro
    activities/
      index.astro
      [slug].astro
    contact.astro
```

## 活動記事の追加方法

1. `src/content/activities/` にMarkdownファイルを追加
2. Frontmatterに以下を設定
   - `title` (string)
   - `date` (YYYY-MM-DD)
   - `summary` (string)
   - `tags` (string[])
   - `draft` (boolean)
3. `draft: false` の記事のみ公開されます

## 開発コマンド

- `npm install`: 依存のインストール
- `npm run dev`: ローカル開発サーバー起動
- `npm run build`: 本番ビルド
- `npm run preview`: ビルド結果の確認

## Vercelデプロイ

1. GitHubリポジトリをVercelに接続
2. Production Branchを`main`に設定
3. Pull RequestごとのPreview Deployを有効化
4. `main` マージで本番反映

初期構成では環境変数は不要です（問い合わせは外部フォーム導線）。

ふぉるねが編集してしまった！！！