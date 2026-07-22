---
title: OWNED（動画配信プラットフォーム）
fromAt: "2025-07-05"
toAt: null
link: ""
position:
  - フルスタックエンジニア
draft: true
description: マルチテナントB2B動画配信プラットフォームの開発。AWS Transcribeの文字起こしパイプラインやRAGベースのAIチャットなど、AI機能を主導。
---

マルチテナント構成のB2B動画配信プラットフォームの開発に、最多コントリビューターとして参加しています。基盤構築からAI機能まで幅広く担当し、特にAI機能を主導しました。

## やったこと

- **文字起こしパイプライン**
  - AWS Transcribeによる文字起こし（2GB制限を回避する音声抽出パイプライン、完了Webhook）
  - 話者分離からのSpeaker自動生成、OCR + 顔検出による話者名候補の自動付与
- **視聴者向けAIチャット**
  - Transcript embedding基盤（pgvector + OpenAI）とRAGクエリエンジン
  - ストリーミング対応のチャットUI、回答内の時刻リンクから動画をシークする機能
- **基盤・運用**
  - Cognito認証、ECSデプロイ、IAM Roleへのクレデンシャル移行
  - GDPR対応（登壇者オプトアウトフロー）、Redisベースのレート制限・クォータ管理

## 使った技術

- Next.js / TypeScript / Prisma
- AWS (Transcribe / Cognito / S3 / CloudFront / ECS / Lambda)
- pgvector / OpenAI / Claude API
- Redis

## 学び・所感

<!-- TODO: 音声・動画×AIパイプラインの設計で苦労した点を加筆 -->
