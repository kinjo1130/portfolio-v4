---
title: 株式会社FourYou
fromAt: "2026-03-14"
toAt: "2026-04-01"
link: ""
position:
  - バックエンドエンジニア
draft: true
description: 関西電力向け政策情報AIシステムの開発。504障害の根本原因特定、クローラー信頼性改善、非同期アーキテクチャへの移行を担当。
---

関西電力向けの政策情報AIシステム（各省庁サイトの審議会情報を自動クローリングし、AI要約レポートを生成・メール配信するシステム）の開発に参加しました。バックエンドを中心に、障害調査からアーキテクチャ改善まで担当しました。

## やったこと

- **504 Gateway Timeout 障害の根本原因特定**
  - JWKS取得、DB接続プール、クエリ実行と段階的に切り分け、Aurora Serverless v2 の低ACU時のクエリハングが原因と確定
  - タイムアウト設定・ACU引き上げなどの対策を提案し、調査レポートを作成
- **URLインポートの非同期化**
  - 同期処理から EventBridge + Lambda、さらに ECS Fargate へと段階的に移行
- **クローラーの信頼性改善**
  - iframe / embed 内のPDF検出、メインコンテンツ優先抽出、スケジュール抽出の改善
- CI整備（ruff / actionlint）、STGデータを使ったローカル検証環境の整備

## 使った技術

- Python / FastAPI / SQLAlchemy
- AWS (Bedrock / Lambda / ECS Fargate / Aurora PostgreSQL Serverless v2 / EventBridge)
- Terraform

## 学び・所感

<!-- TODO: 障害調査の進め方、サーバーレスDBの落とし穴について加筆 -->
