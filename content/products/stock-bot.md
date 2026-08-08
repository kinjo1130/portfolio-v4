---
title: Stock Bot
publishedAt: "2026-06-12"
updatedAt: "2026-06-13"
image:
  url: /images/products/stock-bot/cover.png
  width: 1200
  height: 630
description: レシートや商品写真をLINEに送るだけで、家に今何があるかを一覧で見られるようにする持ち物管理アプリです。
---

## LINEに画像を送るだけの持ち物管理

レシート・商品の写真・ECの注文画面のスクショをLINE Botに送ると、AIが品目を抽出して持ち物データベースに登録し、LIFFアプリで「自分の家に今何があるか」を一覧できるアプリです。

抽出はGeminiで行い、確定前にFlex Messageで内容を確認・修正できるようにしています。対象は食品や日用品に限らず、服・ガジェット・家電などモノ全般です。

レシートを経費にする [Slipsnap](/products/slipsnap) と発想は近いですが、こちらは家庭の在庫が対象です。

### 技術

- Hono on Cloudflare Workers / Cloudflare Queues / Cloudflare R2
- Gemini（画像からの品目抽出）
- Neon PostgreSQL / Prisma
- LIFF + React (Vite) / TanStack Query

2026年6月に作り始めたところです。
