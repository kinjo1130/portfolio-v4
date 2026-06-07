# portfolio-v4 プロジェクト規約

## デザインシステム — SSoT は `DESIGN.md`

UI / トークン / コピー / アイコノグラフィに関する変更は、必ずリポジトリ root の `DESIGN.md` を参照すること。`DESIGN.md` がアフロ Design System の Single Source of Truth。

### 必須ルール（DESIGN.md から派生）

- **カラー**: 任意の hex を直書きしない。`styles/tokens.css` のセマンティックエイリアス（`--surface-*` / `--text-*` / `--border-*` / `--action-*`）または Tailwind の対応クラス（`bg-paper`, `text-primary` 等）を使う。
- **影**: ソフト/ブラー影は禁止（`shadow-sm/md/lg/xl/2xl` 等）。許容は `--shadow-hard`（4px 4px 0 0 インク、ぼかしなし）のみ、インタラクティブカードの hover に限る。
- **グラデーション禁止**。
- **角丸は 0–6px**。`rounded-pill`（999px）はタグ・アバターのみ。`rounded-lg/2xl/3xl/full` を一般 UI に使わない。
- **タイポ**: 見出し = Space Grotesk、本文 = DM Sans、JP = Noto Sans JP、mono ラベルは大文字 + 0.16em tracking。
- **Emoji 禁止**（UI / コピー / コメント全てで）。状態は Badge / ドットで表す。
- **リンク色**: `--hazard #BB6A35` のみ。それ以外の色（blue 等）でリンクを描画しない。
- **余白**: セクション縦リズム 64–128px。ぎゅっと詰めない。
- **Voice**: 一人称・単数 "I"。マーケ語（leverage / synergy / best-in-class）禁止。誇張・感嘆禁止。

### 乖離の扱い

既存コードと `DESIGN.md` の乖離は `docs/design-gap.md` に集約。新規実装・リファクタ時はここを潰す方向で進める。
