---
title: 合同会社草創技術
fromAt: "2026-06-17"
toAt: null
link: ""
position:
  - ソフトウェアエンジニア
description: AI電話応対プラットフォーム「MCPhone」の初期構築を単独で担当。Skill×Flow×MCPの3層アーキテクチャ設計から実装まで。
---

AIが電話応対を代行するプラットフォーム「MCPhone」の初期構築を単独で担当しています。電話の内容を聞き取るだけでなく、MCP経由でTableCheckやShopify、kintoneといった外部SaaSにアクセスして、調査や処理の実行まで完結させるのがコンセプトです。

## アーキテクチャ設計

ゼロからの立ち上げなので、まず全体の構造を決めました。3層に分けています。

- **Skill**: Markdownで書く会話戦略。受付Skillが通話を受け、必要に応じて業務Skillを呼び出す
- **Flow**: YAMLで宣言的に書く業務処理。「予約変更」のような定型業務を手続きとして定義する
- **MCP**: 外部SaaSへのアクセス層。公開されているMCPをラップして使う

会話（揺れる）と業務処理（揺れてはいけない）を分離するのがこの設計の狙いです。LLMに全部任せると業務処理の確実性が出ないので、Flowを宣言的に固めて、LLMはSkillの範囲で会話に集中させます。

## 実装したもの

- **Orchestratorコア**: 通話セッション管理、Skillのスタック、Toolハンドラ、プロンプト組立。擬似LLMとモックMCPを組み合わせて「予約変更」シナリオをend-to-endで通した
- **フロントエンド**: React Flowによる業務フローの可視化、SkillとFlowの新規作成画面、レスポンシブ対応、ライト/ダークモード切り替え
- **コード規約**: Zodスキーマ駆動で型を生成し、`as` / `any` 禁止。UI / Domain / Container の3層分離、薄いhandler、Factory DIといった規約をCLAUDE.mdに定めた

現状はOrchestratorコアが擬似実装でend-to-end動作確認済みの段階で、実LLM接続と音声I/O（Realtime API / SIP）はこれからです。

## 使った技術

- React / TypeScript / TanStack Query
- Hono
- Zod / React Flow

## 学び・所感

<!-- 下書き (自分で書き直す)
まだ音声I/Oを繋ぐ前ですが、会話と業務処理を最初に分けた設計は、擬似LLMでend-to-endを通した時点で効いています。LLMの出力が揺れても影響がSkill側に閉じるので、デバッグの当たりを付けやすい。実際の電話音声を繋いだときにこの分離がどこまで持つかは、これから確かめます。
-->
