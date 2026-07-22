# portfolio-v4 プロジェクト規約

## デザインシステム — SSoT は `DESIGN.md`

UI / トークン / コピー / アイコノグラフィに関する変更は、必ずリポジトリ root の `DESIGN.md` を参照すること。`DESIGN.md` がアフロ Design System の Single Source of Truth。

### 必須ルール（DESIGN.md v2 から派生）

- **カラー**: 任意の hex を直書きしない。モノクローム（warm tint）の primary/neutral ランプ（50–950）とシグナルカラー（success / warning / danger / info）のトークン経由で使う。シグナル以外の有彩色を持ち込まない。
- **インタラクション状態**: hover = 明度 −5%、active = 明度 −10%、focus = 2px solid primary + offset 2px、disabled = opacity 40%。値をハードコードせず導出ルールとして適用する。
- **影**: `--shadow-sm/md/lg/xl` の4段のみ（subtle、中立ブラック）。エレベーションは dropdown (sm) < card (md) < modal (lg) < toast (xl)。この4段以外の影・色付き影は作らない。
- **グラデーション禁止**。
- **角丸**: トークン（sm 4px / md 8px / lg 12px / xl 16px / full）経由。コンポーネントロールで参照する: input = sm、button = md、card = lg、badge = full。px 直書き禁止。
- **タイポ**: Inter 単一ファミリー（JP フォールバックに Noto Sans JP）。ベース 16px、スケール比 1.2。ロールは h1–h4 / body / caption（DESIGN.md §3 の値が正）。
- **Emoji 禁止**（UI / コピー / コメント全てで）。状態は Badge / ドットで表す。
- **リンク色**: `primary-700` + 下線（DESIGN.md §11 A2）。有彩色（blue 等）でリンクを描画しない。
- **余白**: 8px ベースのリニアスケール。セクション間は `3xl`（64px）、ブロック内スタックは `md`（16px）。
- **ダークモード**: 対応必須。ランプ共通で役割を反転（背景 950、本文 200 等）。
- **Voice**: 一人称・単数 "I"。マーケ語（leverage / synergy / best-in-class）禁止。誇張・感嘆禁止。

### 乖離の扱い

既存コードと `DESIGN.md` の乖離は `docs/design-gap.md` に集約。新規実装・リファクタ時はここを潰す方向で進める。
