# kzgrm gallery

Static website for the **kazaguruma** circle, built with [Astro](https://astro.build/) and deployed on [Vercel](https://vercel.com/).

## Tech stack

- **Astro** — pages & content collections  
- **Svelte** — interactive UI (e.g. activity filters)  
- **Markdown** — activity posts under `src/content/activities/`

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/about` | About & contact |
| `/activities` | Activity list |
| `/activities/[slug]` | Activity detail |
| `/gallery` | Photo gallery |

## Local development

```bash
npm install
npm run dev
```

- **Build:** `npm run build`  
- **Preview build:** `npm run preview`

Dev server port is set in `astro.config.mjs` (default in this project: `9999`).

## Content: activities

Add a `.md` file in `src/content/activities/` with frontmatter:

| Field | Type | Notes |
|-------|------|--------|
| `title` | string | |
| `date` | `YYYY-MM-DD` | |
| `tags` | string array | |
| `thumnail` | string | Public URL path (e.g. `/images/...`) |

Body is rendered below the metadata on the detail page.

## Deploy

Connect the GitHub repo to Vercel, use the Astro preset, and deploy from `main`. Preview deployments on pull requests are optional but typical.

No environment variables are required for the default setup.

---

## 日本語

**kzgrm gallery** はサークル **kazaguruma** 向けの静的サイトです。Astro で組み、Vercel に公開します。

- **技術:** Astro / Svelte / Markdown（活動記事）
- **主なページ:** ホーム、About（連絡先含む）、活動一覧・詳細、ギャラリー
- **開発:** `npm install` → `npm run dev`（ポートは `astro.config.mjs` 参照）
- **活動記事:** `src/content/activities/` に `.md` を追加。frontmatter は `title`, `date`, `tags`, `thumnail`（表記はコードに合わせています）
- **デプロイ:** GitHub と Vercel を連携し、`main` から本番反映。初期構成では環境変数は不要です。
