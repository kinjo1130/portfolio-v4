---
title: Car 3D Viewer
publishedAt: "2026-03-29"
updatedAt: "2026-03-29"
image:
  url: /images/products/car-3d-viewer/cover.png
  width: 1200
  height: 630
description: 車の写真から3Dモデルを自動生成して、ブラウザ上でぐるぐる回して見られるWebアプリのプロトタイプです。
---

## 写真から車の3Dモデルを作るビューア

車を何枚か撮った写真をアップロードすると、3D Gaussian Splattingでフォトリアルな3Dモデルを自動生成し、ブラウザ上でインタラクティブに閲覧できるWebアプリです。

3D化の処理はReplicate API上でCOLMAPと3D Gaussian Splattingを回していて、生成したモデルはCloudflare R2に置いています。ビューアはReact Three Fiberです。

### 技術

- Next.js (App Router) / React Three Fiber / Tailwind CSS
- Replicate API（COLMAP + 3D Gaussian Splatting）
- Cloudflare R2 / PostgreSQL / Prisma

2026年3月に作ったプロトタイプです。
