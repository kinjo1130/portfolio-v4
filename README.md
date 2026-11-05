# portfolio-v4

金城翔太郎のポートフォリオサイト。

https://www.kinjo.me

## 技術スタック

- Next.js (Pages Router) / React / TypeScript
- Tailwind CSS
- Biome (lint / format)
- Vercel (ホスティング / `@vercel/og` による OG 画像生成)

## 開発

```sh
pnpm install
pnpm dev
```

| コマンド | 内容 |
| --- | --- |
| `pnpm dev` | 開発サーバーを起動 |
| `pnpm lint` | Biome によるチェック |
| `pnpm build` | 本番ビルド |

## 記事

`/writing` には次の2つを並べて出す。

- `content/blogs/*.md` — このリポジトリで直接書いた記事
- `content/cosense/*.json` — 公開 Cosense プロジェクト [kinjo1130](https://scrapbox.io/kinjo1130) のうち、`[public.icon]` が付いていて `[private.icon]` が付いていないページ

`content/cosense` は手で編集しない。GitHub Actions (`.github/workflows/sync-cosense.yml`) が JST 6:00 と 18:00 に
`scripts/cosense/sync.mjs` を実行し、差分があるときだけ main にコミットする。その push で Vercel が再デプロイする。
すぐに反映したいときは Actions の画面から手動で実行する。手元では `node scripts/cosense/sync.mjs` で同じ取得ができる。

記事の URL は Cosense のページ ID (`/writing/<pageId>`) を使う。タイトルを変えても URL は変わらない。

## ドキュメント

- [DESIGN.md](DESIGN.md) — デザインシステムの Single Source of Truth。UI・トークン・コピーの変更時は必ず参照する
- [docs/design-gap.md](docs/design-gap.md) — 既存コードと DESIGN.md の乖離の記録
- [docs/admin.md](docs/admin.md) — 記事の書き方と管理画面のセットアップ
