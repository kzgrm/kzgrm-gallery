# GitHub Pages Deploy Checklist

## 配信構成

- リポジトリ: `kzgrm/kzgrm-gallery`
- 公開URL: `https://kzgrm.github.io/kzgrm-gallery/`
- 配信元: `.github/workflows/deploy-pages.yml`
- `main`へのpushでSvelteKitを静的ビルドする
- GitHub Actions上だけ`/kzgrm-gallery`をbase pathにする

## ブランチ運用

- 本番: `main`
- 公開前: 作業ブランチ＋Arch/Tailscale限定プレビュー
- 作業ブランチはGitHub Pagesへ自動公開しない

## 公開前チェック

- `npm run check`が成功する
- `npm run build`が成功し、`build/`へ全ページが生成される
- トップ、About、活動一覧、写真が表示される
- 全活動の詳細URLを直接開いて再読み込みできる
- `/sitemap.xml`が生成される
- Markdown本文の画像と動画が表示される
- タグ絞り込みをキーボードとポインターで操作できる
- desktopと狭幅画面でナビゲーションと本文が欠けない
- `GITHUB_ACTIONS=true npm run build`のHTML内URLが`/kzgrm-gallery/`を含む

## 運用ルール

- 記事は`src/content/activities/`へ追加する
- 公開したくない記事・画像はpublicリポジトリへcommitしない
- Compassからの編集は、今後Gallery専用writerの型付き操作として追加する
