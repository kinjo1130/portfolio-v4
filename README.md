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

## ドキュメント

- [DESIGN.md](DESIGN.md) — デザインシステムの Single Source of Truth。UI・トークン・コピーの変更時は必ず参照する
- [docs/design-gap.md](docs/design-gap.md) — 既存コードと DESIGN.md の乖離の記録
- [docs/admin.md](docs/admin.md) — 記事の書き方と管理画面のセットアップ
