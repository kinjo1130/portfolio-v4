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
- `content/cosense/*.json` — 非公開の Cosense プロジェクト kinjyo-secret のうち、`[public.icon]` が付いていて `[private.icon]` が付いていないページ

`content/cosense` と `public/images/cosense` は手で編集しない。GitHub Actions (`.github/workflows/sync-cosense.yml`) が
JST 6:00 と 18:00 に `scripts/cosense/sync.mjs` を実行し、差分があるときだけ main にコミットする。その push で Vercel が再デプロイする。
すぐに反映したいときは Actions の画面から手動で実行する。

Cosense の画像 (`scrapbox.io/files/...`) は非公開プロジェクトだとログインしないと見られないので、同期のときに
`public/images/cosense` に保存して、そちらを表示する。Gyazo の画像はそのまま表示する。

### トークン

非公開プロジェクトを読むため、Cosense の Personal Access Token (https://scrapbox.io/settings/personal-access-tokens で発行) を
repository secret の `COSENSE_PAT` に登録する。手元で同期するときは `COSENSE_PAT=<token> node scripts/cosense/sync.mjs`。

記事の URL は Cosense のページ ID (`/writing/<pageId>`) を使う。タイトルを変えても URL は変わらない。

## ドキュメント

- [DESIGN.md](DESIGN.md) — デザインシステムの Single Source of Truth。UI・トークン・コピーの変更時は必ず参照する
- [docs/design-gap.md](docs/design-gap.md) — 既存コードと DESIGN.md の乖離の記録
