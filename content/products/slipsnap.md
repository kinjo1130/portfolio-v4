---
title: Slipsnap
publishedAt: "2026-07-16"
updatedAt: "2026-07-23"
image:
  url: /images/products/slipsnap/cover.png
  width: 1024
  height: 1024
description: 撮り溜めたレシートをOCRとAIで仕分け・抽出して、まとめて経費にできるiOSアプリです。
---

## レシートを撮り溜めて、まとめて経費にするアプリ

フリーランスの経費精算が面倒で作りました。レシートを写真に撮るところまではやるのに、そこから先の転記が毎月手作業で、写真ライブラリにはレシート画像が溜まり続ける。この2つを一度に解決するのが狙いです。

流れはこうです。iOSアプリが写真ライブラリからレシートらしき画像をオンデバイスのOCRで探し出し、スワイプで経費に入れるか捨てるかを仕分ける。採用した画像だけClaudeのvisionで店名や日付、金額を構造化して抽出し、自分で確認して承認する。承認済みでクラウドに保存が終わった画像だけ、元の写真を削除できます。

### こだわった点

- レシート候補の検出はVision frameworkのOCRとルールベースの採点で、クラウドAPIを使わずに済ませた。300枚スキャンしても無料
- AI抽出は自動確定させない。全項目を自分で直せるようにして、承認は人間がやる
- 写真削除には3条件のガードを入れた。承認済み、クラウド保存済み、未削除。この条件チェックはサーバー側で強制している
- 画像のSHA-256ハッシュで重複排除するので、同じレシートを2回取り込んでも二重計上にならない

Webのダッシュボードでは月次サマリーとカテゴリ内訳が見られて、Excel互換のCSVで書き出せます。

### 技術

- iOS: SwiftUI / Vision framework
- API: Hono on Cloudflare Workers / Prisma / Neon PostgreSQL / Cloudflare R2
- Web: React / Vite
- Claude API（vision抽出）/ Better Auth
- Terraform / GitHub Actions

2026年7月に作り始めたばかりで、いまはiOSアプリをTestFlightで動かしている段階です。
