# Design Gap — 既存コード vs `DESIGN.md`

`DESIGN.md`（SSoT）と現在の実装の乖離一覧。新規実装・リファクタ時はここを潰す方向で進める。
**重要度**: 🔴 違反（DESIGN.md 明示禁止）/ 🟡 推奨外（指針外れ）/ 🟢 改善余地

最終更新: 2026-06-08

---

## 1. グローバル / レイアウト

| 場所 | 現状 | DESIGN.md ルール | 重要度 |
|---|---|---|---|
| `pages/layout.tsx:35` | `bg-gray-50` (cool gray) | 暖色ニュートラルのみ。`bg-surface-page` 相当 (`--paper #EFEDE3`) を使う | 🔴 |
| `styles/globals.css` | Google Fonts 読み込みなし、html へのフォント指定なし | Space Grotesk / DM Sans / Noto Sans JP を CSS 経由でロードし、body は DM Sans | 🔴（→ tokens 導入で解決済） |
| サーフェス・テキスト・ボーダー | hex / tailwind 標準色直書き | セマンティックエイリアス（`surface-*` / `ink-*` / `line-*`）経由 | 🔴 |

---

## 2. コンポーネント

### `components/Button.tsx`
```tsx
bg-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded
```
- 🔴 cool gray（`slate-*`）を使用 → DESIGN.md は暖色ニュートラル限定。Primary は **インク (asphalt) on 紙 (paper)**。
- 🔴 `rounded`（4px Tailwind 既定だが意図不明）→ `rounded-md`（= 4px トークン）を明示。
- 🟡 variant / size プロップ未対応 → DESIGN.md §8 で `variant: primary/secondary`、`size: sm` を期待。
- 🟡 hover が背景色トーン変更 → DESIGN.md §6 では「色 / ボーダーのシフト」+「プレスで 1px 下に translate」を期待。

### `components/Header.tsx`
- 🔴 `bg-slate-200 rounded-2xl` でアクティブナビを表現 → 16px radius は DESIGN.md（最大 6px）違反。色も cool gray。
- 🟡 アクティブ表現は **2–3px のインク罫**（`--border-rule`）か Tabs underline が DESIGN.md の方向性。
- 🟡 nav リンクの hover に hazard を出していない（DESIGN.md §2.4：nav の hover で hazard を使う）。

### `components/Footer.tsx`
- 🟢 機能的には問題なし。フォントロールが mono のマイクロラベルに置き換わるべき（コピーライト・リンクは mono + 大文字 + 0.16em tracking が DESIGN.md §1）。
- 🟡 「&copy; kinjo shotaro 2024年」は固定年。動的化推奨。

### `components/Tooltip.tsx`
- 🔴 `bg-black text-white` → 黒は使わない。`asphalt` (`#302F2C`) + `paper` テキストへ。
- 🔴 `rounded`（Tailwind 既定）→ `rounded-md` トークン明示。

### `components/Heading.tsx`
- 🟡 `font-bold` 固定 → DESIGN.md は Space Grotesk 500–700。h1 で `font-display font-semibold` 推奨。
- 🟡 サイズマッピングが意図的タイポスケールでない（`text-2xl/xl/lg/md/sm/xs` の素直な対応） → `--text-h1/h2/h3` 合成ロールに合わせる。
- 🟡 `my-3` 固定 → セクション縦リズム 64–128px 思想と合わない。マージン管理は親側に寄せる。

### `components/Achievement.tsx`, `MembershipList.tsx`
- 🟢 文言はシンプルで OK。
- 🟡 リスト見出しが Heading コンポーネント経由 → タイポロール整備後に再評価。

### `components/SNS.tsx`
- 🟡 ICON_SIZE=60 とトークン外の数値。アイコンは Lucide の 24×24 グリッド + 1.5px stroke（DESIGN.md §7）を踏襲。デカすぎる気配。
- 🟡 SVG を直書き（speakerdeck）→ Lucide にないなら別アイコンセットでも可（細・スクエア・モノラインを保つ）。

---

## 3. ページ

### `pages/index.tsx`
- 🔴 `text-gray-400` → cool gray。`text-ink-tertiary` (`--text-tertiary` = concrete) に。
- 🟡 プロフィール画像 `rounded-lg` → 写真にも角丸最小（0–6px）。`rounded-md` か **角丸なし**（工業的）が望ましい。
- 🟡 ヒーローコピーがブランドガイドの「一人称・単数の I」「事実淡々」と一致していない。`DESIGN.md §1` のヒーローコピー例に寄せる。

### `pages/about.tsx`
- 🟡 段落が長く Voice ガイド（短文・体言止め・形容詞 1 つ）と乖離。リライト対象。
- 🟡 「Coming soon...」放置。プロダクトとして弱いので埋める or セクションごと隠す。

### `pages/blog/index.tsx`
- 🔴 `shadow-lg`（ソフト影）→ 影禁止。`lift` バリアントが必要なら `shadow-hard` のみ。
- 🔴 `rounded overflow-hidden border-2` の組み合わせは grid カードとして DESIGN.md の `Card` 仕様に置き換え。
- 🔴 `hover:border-gray-400` → cool gray。`hover:border-line-strong`（CONCRETE）に。
- 🔴 `text-gray-400` → ink-tertiary。

### `pages/blog/[id].tsx`
- 🟡 「いいね！」ボタン文言に `！` 全角感嘆 + 絵文字感。DESIGN.md §1（誇張・感嘆禁止）。`Like` か `いいね` に。
- 🟡 prose は `tailwind/typography` 標準のまま → DESIGN.md のフォント/字間/行間に合わせて `prose` カスタマイズが必要。

### `pages/products/index.tsx`
- 🔴 `shadow-lg` 影、`rounded` cool gray border-hover。blog 同様。
- 🟡 `Card` コンポーネント未抽出。`DESIGN.md §8` の `Card` に置き換える。

### `pages/products/[id].tsx`
- 🔴 `text-blue-600 hover:text-blue-800` → リンク色は `--hazard #BB6A35` のみ。
- 🟡 「作品 URL」見出しなど h3 を Heading コンポーネント経由にしていない。

### `pages/work/index.tsx`
- 🔴 `text-slate-400` → cool gray。`text-ink-tertiary`。
- 🟡 期間表示は mono の小文字大文字（micro label）に。日付フォーマットも DESIGN.md の "FROM / TO" 表記に揃える余地。

---

## 4. トークン未使用箇所のサマリ

| カテゴリ | 違反箇所数 | 対応 |
|---|---|---|
| cool gray (`slate-*`, `gray-*`) | 8 箇所 | `ink-*` / `line-*` / `surface-*` へ置換 |
| `shadow-lg` | 2 箇所 | 削除、必要時のみ `shadow-hard` |
| `rounded-2xl`, `rounded-lg` (UI コントロール) | 3 箇所 | `rounded-md`（4px） |
| リンク色 (`text-blue-*`) | 1 箇所 | `<a>` 既定 hazard で OK（クラス削除） |
| Emoji / 絵文字感のあるコピー | 1 箇所（"いいね！"） | 文言調整 |

---

## 5. 推奨される段階的移行プラン

1. **基盤** — `styles/tokens.css` 導入 + Tailwind 接続 ✅ 済
2. **共通コンポーネント刷新** — `Button` / `Card`（新規）/ `Tooltip` / `Header` / `Heading` を DESIGN.md §8 仕様で書き直し
3. **ページ移行** — pages/* を新コンポーネントに差し替え、cool gray を一掃
4. **prose スタイル** — blog 本文の typography をブランドフォントに揃える
5. **コピー刷新** — index / about / blog タイトル等を Voice & Tone ガイドでリライト
6. **アイコン整理** — Lucide 1.5px stroke / 24×24 を共通化、ICON_SIZE 廃止

---

## 6. 参照

- SSoT: `../DESIGN.md`
- トークン定義: `../styles/tokens.css`
- Tailwind 接続: `../tailwind.config.ts`
- プロジェクト規約: `../.claude/CLAUDE.md`
