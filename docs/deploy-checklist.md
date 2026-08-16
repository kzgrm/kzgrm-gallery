# GitHub Pages Deploy Checklist

## 配信構成

- GitHubリポジトリ: `kzgrm/kzgrm-gallery`
- 公開URL: `https://kzgrm.github.io/kzgrm-gallery/`
- 配信元: `.github/workflows/deploy-pages.yml`
- `main`へのpushでAstroを静的ビルドし、GitHub Pagesへ反映する
- 開発時はbase pathなし、GitHub Actions上だけ`/kzgrm-gallery`をbase pathとして付与する

## ブランチ運用

- Production Branch: `main`
- 公開前の確認はArch上のTailscale限定プレビューで行う
- Pull Requestや作業ブランチはGitHub Pages本番へ自動反映しない

## 公開前チェック

- `/`、`/about`（末尾に Contact）、`/activities` が表示される
- `/activities/[slug]` の詳細ページが開ける
- `npm run build` が成功する
- sitemap (`/sitemap-index.xml`) が生成される
- GitHub Pages上で`/kzgrm-gallery/activities/<slug>/`を直接開き、再読み込みできる

## 運用ルール

- 活動記事は `src/content/activities/` にMarkdownで追加する
- `draft: true` の記事は本番に表示されない
- 未公開素材や下書きはGitHubのpublicリポジトリへcommitしない
