# 活動記事の管理手順

## フォルダ構成

1つの活動につき、Markdownと画像を1フォルダへまとめます。

```text
src/content/activities/
  250518-関西けもケット10/
    index.md
    thumbnail.jpeg
    001.png
```

## 新規追加

```sh
# 今日の日付
sh scripts/new-activity.sh "活動名"

# YYMMDDを指定
sh scripts/new-activity.sh 250530 "活動名"
```

生成されたフォルダへ`thumbnail.jpeg`と本文用画像を追加し、`index.md`を編集します。

```yaml
---
title: "関西けもケット11"
date: 2026-06-01
tags:
  - event
thumbnail: ./thumbnail.jpeg
---

本文をここに書く。

![当日の様子](./001.png)
```

| フィールド | 内容 |
|---|---|
| `title` | 表示名 |
| `date` | `YYYY-MM-DD` |
| `tags` | フィルター用タグの配列 |
| `thumbnail` | 同じフォルダにある一覧用画像への相対パス |

旧記事の`thumnail`も互換読み込みしますが、新規記事では`thumbnail`を使います。

## 確認

```sh
npm run check
npm run build
npm run dev
```

`/activities/`のカード、個別記事、本文画像を確認します。Markdownはビルド時にHTMLへ変換し、許可した要素と属性だけを残します。

## 動画

WebMは`static/videos/<slug>/`へ置きます。

```html
<video src="../../videos/<slug>/001.webm" autoplay loop muted playsinline></video>
```

GitHub Pagesのbase pathはビルド時に自動付与されます。

## 写真ギャラリー

`src/assets/images/gallery/`へJPEG、PNG、WebP、AVIF、GIF、SVGを追加すると、ファイル名順で表示されます。

## 公開前の注意

- このリポジトリはpublic。下書きや未公開素材はcommitしない。
- 画像には意味のある代替テキストを書く。
- 削除は記事フォルダ単位で行い、Git差分を確認してからcommitする。
