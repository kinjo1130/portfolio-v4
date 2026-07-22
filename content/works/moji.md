---
title: moji株式会社
fromAt: "2025-11-19"
toAt: null
link: ""
position:
  - フルスタックエンジニア
description: AIマーケティング分析・クリエイティブ提案プラットフォーム「GrowthMan」の開発と、Claude Codeを使った開発基盤の整備。
---

AIマーケティング分析・クリエイティブ提案プラットフォーム「GrowthMan」の開発を中心に参加しています。あわせて、Claude Codeを使った自動PRレビューや社内スキル共有など、チームの開発基盤の整備も担当しています。

## GrowthMan

Google広告やMeta広告のデータを分析して、クリエイティブの提案まで行うプラットフォームです。Next.js (App Router) + Prisma のmonorepo構成で、クリエイティブ制作まわりを中心に実装しました。

- **クリエイティブ制作機能**: バナー生成と複数画像の同時生成。生成の前段に、選択式と自由入力を組み合わせたヒアリングUIを置いて、ユーザーの意図を構造化してからモデルに渡す形にした。画像生成モデルは途中でreplicateからnano bananaに切り替えている
- **動画生成**: Remotionを使って、生成した素材から動画を書き出す機能
- **プランと課金まわり**: プラン別の機能制御（BASICプランへのクリエイティブ機能追加）、招待フローのバグ修正、トランザクションのtimeout延長
- **Google広告の審査対応**: OAuthで「確認されていません」と出る問題の調査、Search Consoleの所有権確認、プライバシーポリシーの作成。広告APIを本番で使うための審査は、コードより手続きが重かった
- 予算やCPA入力のカンマ区切り表示、通貨入力などの細かいUX改善

## 開発基盤

- GitHub ActionsでClaude Codeの自動PRレビューを構築。PRを開くと自動でレビューが走り、メンションで追加の指示も出せる
- 社内でClaude Codeのスキルや設定を共有するためのリポジトリ整備（dotfiles型の配布、マーケットプレイス）
- SupabaseとVercelのインフラをTerraformでコード管理する構成を作った

## 使った技術

- Next.js / TypeScript / React
- PostgreSQL / Prisma
- OpenAI API / Google Ads API / Meta API
- Remotion / Terraform / Claude Code

## 学び・所感

<!-- TODO: 画像生成モデルの選定、Claude Code基盤の効果を加筆 -->
