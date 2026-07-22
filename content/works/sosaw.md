---
title: 合同会社草創技術
fromAt: "2026-06-17"
toAt: null
link: ""
position:
  - ソフトウェアエンジニア
draft: true
description: AI電話応対プラットフォーム「MCPhone」の初期構築を単独で担当。Skill×Flow×MCPの3層アーキテクチャ設計から実装まで。
---

AIが電話応対を代行し、MCP経由で外部SaaSにアクセスして調査・処理まで実行するプラットフォーム「MCPhone」の初期構築を単独で担当しています。

## やったこと

- **アーキテクチャ設計**
  - Skill（会話戦略）× Flow（宣言型の業務処理）× MCP（外部SaaS連携）の3層構成を設計
- **Orchestratorコアの実装**
  - 通話セッション管理・Skillスタック・Toolハンドラ・プロンプト組立
  - 擬似LLM + モックMCPによる「予約変更」シナリオのend-to-endデモ
- **フロントエンド**
  - React Flowによるフロー可視化、Skill / Flow作成画面、レスポンシブ・ダークモード対応
- コード規約の整備（Zodスキーマ駆動、UI / Domain / Containerの3層分離）

## 使った技術

- React / TypeScript / TanStack Query
- Hono
- Zod / React Flow

## 学び・所感

<!-- TODO: 音声I/O接続後の学びを加筆 -->
