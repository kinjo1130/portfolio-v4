---
title: Psynaut
publishedAt: "2025-08-23"
updatedAt: "2026-07-12"
image:
  url: /images/products/psynaut/cover.png
  width: 1200
  height: 630
url: https://psynaut.app
---

## 学術実験と心理調査のためのリサーチプラットフォーム

心理実験や行動科学の研究では、Google Formsのような汎用ツールで扱えない要件が多い。提示順のカウンターバランス、逆転項目の計算、注意確認問題による除外。研究者はフォームを複製して手作業で配布し、集まったデータをExcelで加工しています。Psynautはこの一連の流れをひとつのプロダクトに収めるサービスです。

被験者の募集と日程調整、フォーム作成、実験条件の配布制御、回答収集、分析用のデータ整形までを通しでカバーします。

### 主な機能

- 研究フォームビルダー: リッカート尺度やスライダー（VAS）、メディア提示を含む15種の質問形式
- 実験配布制御: ラテン方格法、被験者間ランダマイズ、質問順と選択肢順のランダム化、パターン固定URL
- データ品質管理: 注意確認問題、条件による除外判定、逆転項目の指定
- スケジュール管理: 候補枠ごとの定員管理、公開URLとQRでの募集、フォーム連携
- 分析用出力: Wide/Long形式のCSV、尺度合計と逆転スコアの自動計算、Google Sheets同期
- 研究室単位のワークスペースとメンバー招待

AIによるフォーム作成アシスタントや、外部からAPIを叩けるMCP連携も入れています。

### 技術

- Next.js (App Router) / React / TypeScript / Tailwind CSS
- Hono / Prisma / PostgreSQL (Neon)
- Better Auth / Google OAuth
- Expo (モバイルアプリ)
- Cloudflare R2 / Google Cloud Run / Stripe / Sentry

2025年8月に開発を始めて、いまは研究者にトライアルで使ってもらいながらPMFを検証しているところです。課金はStripeのサブスクリプションで、科研費向けの請求書払いにも対応しました。
