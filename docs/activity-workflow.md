# 活動記事の管理手順

## フォルダ構成

活動記事は1つのフォルダに `index.md` と画像をまとめて管理します。

```
src/content/activities/
  250518-関西けもケット10/
    index.md
    thumbnail.jpeg   ← サムネイル（activities一覧に表示）
    001.png          ← 本文内で使う画像
    002.png
    ...
```

---

## 新規追加手順

### 1. スクリプトでフォルダと index.md を生成

```sh
# 日付は今日を自動使用
sh scripts/new-activity.sh "活動名"

# 日付を指定する場合（YYMMDD形式）
sh scripts/new-activity.sh 250530 "活動名"
```

- `src/content/activities/YYMMDD-活動名/` を作成
- `index.md`（frontmatter入り）を自動生成

例：

```sh
sh scripts/new-activity.sh "関西けもケット11"
# → src/content/activities/260601-関西けもケット11/index.md が作成される

sh scripts/new-activity.sh 250530 "関西けもケット11"
# → src/content/activities/250530-関西けもケット11/index.md が作成される
```

### 2. 画像をフォルダに追加

サムネイル（`thumbnail.jpeg`）と本文用画像をフォルダ内に配置します。

```
src/content/activities/260601-関西けもケット11/
  index.md
  thumbnail.jpeg   ← 必須（一覧カードに表示される）
  001.png
```

### 3. index.md を編集

生成された `index.md` を開いて内容を記入します。

```yaml
---
title: "関西けもケット11"
date: 2026-06-01
tags:
  - kzgrm
  - event
thumnail: ./thumbnail.jpeg
---

本文をここに書く。

![説明文](./001.png)
```

| フィールド | 内容 |
|---|---|
| `title` | 表示名 |
| `date` | `YYYY-MM-DD` 形式 |
| `tags` | フィルター用タグ（配列） |
| `thumnail` | サムネイル画像（フォルダ内への相対パス） |

### 4. 動作確認

```sh
npm run dev
```

`/activities` でカードが表示されること、詳細ページで本文と画像が表示されることを確認します。

---

## 削除手順

フォルダごと削除するだけです。

```sh
rm -rf src/content/activities/250518-関西けもケット10
```

画像も含めて一括で消えます。

---

## 画像について

- サムネイル・本文画像はビルド時にAstroが自動でWebP変換・最適化します
- 対応フォーマット: JPEG / PNG / WebP / AVIF
- 本文内の画像は `![代替テキスト](./ファイル名)` で相対パス参照

## アニメーション（GIF）について

GIFはファイルサイズが大きく最適化もされないため、**WebMに変換して`<video>`タグで埋め込む**ことを推奨します。

### 変換手順

```sh
# ffmpegでWebMに変換（要 brew install ffmpeg）
ffmpeg -i input.gif -c:v libvpx-vp9 -b:v 0 -crf 33 -an -loop 0 output.webm
```

### ファイルの配置

WebMは `public/videos/{スラッグ名}/` に置きます（画像と異なり `src/` から参照できないため）。

```
public/videos/
  250530-かざしもがやってきたぞ!/
    001.webm
```

### markdown での記述

```html
<video src="/videos/250530-かざしもがやってきたぞ!/001.webm" autoplay loop muted playsinline></video>
```

元のGIFは変換後に削除して構いません。

## ギャラリー画像について

ギャラリーは `src/assets/images/gallery/` 内の画像をビルド時に自動読み込みします。

```
src/assets/images/gallery/
  photo-001.jpg
  photo-002.jpg
  ...
```

ファイルを追加してビルドするだけで表示順（ランダム）に追加されます。
