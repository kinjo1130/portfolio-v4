# Design Gap — 既存コード vs `DESIGN.md` v2

`DESIGN.md`（SSoT）と現在の実装の乖離一覧。新規実装・リファクタ時はここを潰す方向で進める。

最終更新: 2026-07-23（DESIGN.md v2 刷新に伴い全面書き換え）

---

## 前提

2026-07 に `DESIGN.md` が v2（モノクローム warm tint / Inter / subtle shadow）へ刷新された。
**実装は全面的に v1 以前の状態**であり、v1 時代の個別監査（cool gray 混入等）は本ファイルの旧版（git 履歴）を参照。現状のギャップは「実装全体が v2 未対応」に集約される。

## v2 移行ギャップ（大分類）

| # | 領域 | 現状 | v2 のあるべき姿 | 対象 |
|---|---|---|---|---|
| 1 | カラートークン | v1 トークン（`--asphalt` / `--paper` / hazard 等）+ 一部 cool gray 直書き | primary/neutral ランプ（50–950, warm tint）+ シグナル4色に置換 | `styles/tokens.css`, `tailwind.config.ts`, 全コンポーネント |
| 2 | タイポグラフィ | Space Grotesk + DM Sans（v1）、一部フォント未指定 | Inter 単一ファミリー（+ Noto Sans JP fallback）、スケール比 1.2、h1–h4 / body / caption ロール | `styles/`, `components/Heading.tsx`, prose |
| 3 | 影 | v1 の影禁止前提（`shadow-hard` / 影なし）と、逆に Tailwind 標準 `shadow-lg` 直書きの混在 | `--shadow-sm/md/lg/xl` の4段（subtle）+ エレベーション階層 | tokens, Card 系, blog / products 一覧 |
| 4 | 角丸 | 0–6px（v1）と `rounded-2xl` 等の直書き混在 | トークン（4/8/12/16px + full）+ コンポーネントロール（input=sm / button=md / card=lg / badge=full） | 全コンポーネント |
| 5 | インタラクション状態 | 個別クラスで hover 色をハードコード | 導出ルール（hover −5% / active −10% / focus ring / disabled 40%）を仕組みで適用 | tokens + 共通コンポーネント |
| 6 | リンク色 | v1 hazard `#BB6A35` 前提 + 一部 `text-blue-*` | `primary-700` + 下線（DESIGN.md §11 A2） | グローバル CSS, products/[id] |
| 7 | ダークモード | 未対応（v1 の Asphalt 文脈も未実装） | ランプ役割反転による対応必須（DESIGN.md §2.4） | tokens, layout |
| 8 | スペーシング | 個別 margin（`my-3` 等）が散在 | 8px リニアスケール。セクション間 `3xl`、スタック `md` | layout, pages |

## v1 から引き続き有効な指摘

- Emoji / 感嘆符コピー（blog の「いいね！」等）は v2 でも禁止。文言調整が必要。
- Voice & Tone（一人称 I、誇張禁止）のコピー乖離（index / about）はリライト対象のまま。
- アイコンの Lucide 統一（1.5px stroke / 24×24、`ICON_SIZE=60` 廃止）も継続。

## 推奨される段階的移行プラン（v2）

1. **基盤** — `styles/tokens.css` を v2 トークン（ランプ / シグナル / 影 / 角丸 / タイポ / スペーシング）で書き直し、`tailwind.config.ts` を接続
2. **状態の仕組み化** — hover / active / focus / disabled の導出ルールをユーティリティ化
3. **共通コンポーネント刷新** — Button / Card / Input / Badge / Heading / Tooltip / Header を v2 ロールで書き直し
4. **ページ移行** — pages/* を新トークン・新コンポーネントへ差し替え、直書き色と Tailwind 標準影を一掃
5. **ダークモード** — ランプ反転の実装と切り替え
6. **コピー刷新** — Voice & Tone ガイドでリライト

## 参照

- SSoT: `../DESIGN.md`
- トークン定義: `../styles/tokens.css`
- Tailwind 接続: `../tailwind.config.ts`
- プロジェクト規約: `../.claude/CLAUDE.md`
