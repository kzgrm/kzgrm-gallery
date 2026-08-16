# kzgrm gallery

サークル「かざぐるま」の公開静的サイトです。SvelteKitで構築し、GitHub Pagesへ配信します。

## 技術構成

- SvelteKit / Svelte 5
- `@sveltejs/adapter-static`
- Markdown（活動記事）
- GitHub Actions / GitHub Pages

Compassと同じSvelteKit・Svelte 5・Zen Maru Gothic・KZGRM配色を使います。一方、公開サイトにはCompassの認証・API・writerなどの内部機能を含めません。

## ページ

| URL | 内容 |
|---|---|
| `/` | ホーム、最近の活動 |
| `/about/` | サークル、キャラクター、メンバー |
| `/activities/` | タグで絞り込める活動一覧 |
| `/activities/[slug]/` | Markdownから生成する活動詳細 |
| `/gallery/` | 写真ギャラリー |

## 開発

```bash
npm install
npm run dev
```

開発サーバーは `http://127.0.0.1:9999/` です。

```bash
npm run check
npm run build
npm run preview
```

## 活動記事

記事と画像は引き続き `src/content/activities/<slug>/` に同居します。

```bash
sh scripts/new-activity.sh "活動名"
```

frontmatterの新しい正規フィールド名は`thumbnail`です。既存記事との互換性のため、旧スペル`thumnail`も読み込めます。詳しくは[`docs/activity-workflow.md`](docs/activity-workflow.md)を参照してください。

## 公開

`main`へのpushで`.github/workflows/deploy-pages.yml`が静的ビルドし、次へ配信します。

https://kzgrm.github.io/kzgrm-gallery/

公開前はArch上のTailscale限定プレビューで確認します。初期構成に環境変数はありません。
