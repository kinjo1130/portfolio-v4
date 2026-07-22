---
title: OWNED（動画配信プラットフォーム）
fromAt: "2025-07-05"
toAt: null
link: ""
position:
  - フルスタックエンジニア
draft: true
description: マルチテナントのB2B動画配信プラットフォームの開発。文字起こしパイプラインやRAGチャットなど、AIまわりはほぼ自分が実装。
---

マルチテナント構成のB2B動画配信プラットフォームを開発しています。文字起こしやRAGチャットなど、AIまわりはほぼ自分が作りました。インフラや認証などの基盤も担当しています。

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
