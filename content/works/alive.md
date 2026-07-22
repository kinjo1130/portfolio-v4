---
title: 株式会社alive
fromAt: "2026-01-24"
toAt: null
link: ""
position:
  - ソフトウェアエンジニア
description: 営業の工数を削減する社内システム・自動化ツールの開発。デリバリー営業自動化、Threads自動投稿、コーポレートサイトのリニューアルなど。
---

営業の工数を削減する社内ツールを作っています。デリバリー代理店営業の自動化がメインで、ほかにSNS運用の自動化やコーポレートサイトのリニューアルなど、頼まれたものを順に作っている形です。

## やったこと

- **デリバリー営業自動化システム**
  - 営業リストの住所をGeocodingし、PostGISでデリバリー各社の対応エリア内かを自動判定してスプレッドシートに書き戻す仕組み
  - KMZ/KMLからのエリアポリゴン取り込み、Next.jsのWebアプリ化、TerraformによるAWS構築
- **営業リスト作成CLI**
  - 食べログの検索結果から店舗情報を収集するスクレイピングツール（TypeScript + Playwright）
- **Threads自動投稿ツール**
  - スプレッドシートの投稿を定時にThreadsへ自動投稿するGASツール
  - OAuthのセルフサービス連携で、運用者がマスタ操作なしにアカウントを追加できる設計
- **コーポレートサイトのリニューアル**
  - WordPressサイトのデザイントークン抽出と、新トップ・事業紹介ページの実装・本番反映

## 使った技術

- Next.js / TypeScript / Python
- PostgreSQL + PostGIS / Prisma
- Google Apps Script / Threads API / Google Maps API / Google Sheets API
- Playwright / Terraform / AWS / WordPress

## 学び・所感

<!-- TODO: 非エンジニアの運用者に引き渡す設計の工夫を加筆 -->
