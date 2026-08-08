---
title: FrameScript
publishedAt: "2025-12-05"
updatedAt: "2026-06-28"
image:
  url: /images/products/frame-script/cover.gif
  width: 640
  height: 360
url: https://github.com/kinjo1130/FrameScript
description: React + CSSで動画を組み立てる動画編集・モーショングラフィックスツールです。レンダリングはRust製。GitHubで公開しています。
---

## React + CSSで動画を作るツール

動画編集ソフトのタイムラインをGUIでいじる代わりに、Reactコンポーネントとして動画を書けるようにしたツールです。幅・高さ・fpsをプロジェクト設定として宣言し、クリップやタイムラインをコードで組み立てます。

アニメーションは `useAnimation` APIでフレーム単位に制御できます。CSSが使えるので、Webでできる表現はそのまま動画になります。

レンダリング部分はRustで書いていて、ブラウザのプレビューと同じ見た目で動画ファイルに書き出せます。

### 技術

- React / TypeScript / CSS
- Rust（レンダリングシステム）

GitHubで公開しているので、リポジトリを clone すれば試せます。
