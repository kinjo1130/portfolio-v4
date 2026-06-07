# アフロ Design System — DESIGN.md

**金城将太郎（アフロ / Kinjo Shotaro）** のパーソナルブランド・デザインシステム。
小さく鋭い SaaS プロダクトを複数手がけるフルスタックエンジニア。TypeScript / React / Next.js。
キーボードを離れれば、ランエボ・スキー・旅。

> 素材は **アスファルト・コンクリート・紙**。静かで、工業的で、控えめ。
> 路面と紙のような手触り、彩度はほぼゼロ、余白はたっぷり、角丸は最小。
> **グラデーションも影も使わない。** 自信は声量ではなく、抑制で示す。

---

## 1. ブランドの基本（Content Fundamentals）

| 項目 | 指針 |
|---|---|
| **Voice** | 一人称・単数。"I build SaaS." 顔の見えない "we" ではなく、常に人がいるパーソナルブランド。 |
| **Tone** | 静かな自信、控えめ。事実を淡々と述べ、そのまま立たせる。誇張も感嘆もしない。 |
| **Casing** | 見出し・本文はセンテンスケース。**大文字は mono のマイクロラベルだけ**（アイブロウ、メタ情報、スペックキー、フッター）。そこでは 0.16em のワイドトラッキング。 |
| **Brevity** | 短文。リズムのための体言止め・断片も可。形容詞は2つ目を削る。 |
| **Bilingual** | 日本語は英語と自然に同居（ワードマーク「アフロ」、タグ「ランエボ・スキー・旅」、日本語読者向けの本文）。装飾としてではなく、意味を持つ場所にだけ。 |
| **Numbers** | 控えめな証拠として少数の正直な数字（"5 products shipped", "100% TypeScript"）。虚栄の指標の壁は作らない。 |
| **Emoji** | 使わない。プロダクトでもコピーでも。状態は Badge とドットで表す。 |
| **Vocabulary** | 素朴な職人言葉 — "ship", "build", "the line", "stack"。マーケ語（leverage / synergy / best-in-class）は避ける。 |

ヒーローコピー例：
*"Kinjo Shotaro — full-stack engineer shipping a handful of small, sharp SaaS products.
TypeScript front to back. Off the keyboard: a Lancer Evolution, spring corn snow, and a one-way ticket somewhere."*

---

## 2. カラー（Color）

彩度ほぼゼロの暖色ニュートラル。**フラットのみ、グラデーション禁止。**

### 2.1 素材アンカー
| トークン | 値 | 役割 |
|---|---|---|
| `--asphalt` | `#302F2C` | 暗いサーフェス / 主インク |
| `--concrete` | `#8A8680` | 中間点 — 二次テキスト、ボーダー、ディバイダー |
| `--paper` | `#EFEDE3` | 明るいサーフェス / 紙のストック |

### 2.2 ニュートラル・ランプ（暖色・低彩度 16 段）
`--neutral-950 #1B1A18` → `--neutral-900` → `--neutral-850` → **`--neutral-800 #302F2C`（= ASPHALT）** →
`--neutral-700` → `--neutral-600` → `--neutral-500` → **`--neutral-450 #8A8680`（= CONCRETE）** →
`--neutral-400` → `--neutral-300` → `--neutral-250` → `--neutral-200` → `--neutral-150` →
**`--neutral-100 #EFEDE3`（= PAPER）** → `--neutral-50` → `--neutral-0 #FAF8F0`

> ランプの値は**塗り**に使う。コンポーネントでは**セマンティックエイリアス**を参照する。

### 2.3 シグナルトーン（控えめに、低彩度のまま）
| トークン | 値 | 意味 |
|---|---|---|
| `--signal-positive` | `#5C6E54` | lichen green |
| `--signal-caution` | `#9C7B3F` | ochre / desaturated hazard |
| `--signal-critical` | `#92503F` | oxide rust-red |
| `--signal-info` | `#4F6470` | slate blue |

主に Badge の輪郭やステータスドットとして。塗りとして使うのは稀。

### 2.4 アクセント — Hazard（リンクとホバー専用）
| トークン | 値 | 用途 |
|---|---|---|
| `--hazard` / `--accent` / `--link` | `#BB6A35` | 焦げた琥珀。**インラインリンク、nav リンクのホバー、カード矢印のホバー、フッターリンクのホバーのみ。** |
| `--hazard-deep` / `--accent-hover` | `#A85A2B` | ホバー / プレス |
| （Asphalt 文脈） | `#CF8348` / `#DD9358` | 暗背景では可読性のため少し持ち上げる |

> Primary ボタン・タブ・選択チップは**インク（asphalt）のまま**。アクセントが主役（うるさい要素）にならないようにする。

### 2.5 セマンティックエイリアス（コンポーネントで使う）
- **サーフェス**: `--surface-page` / `--surface-raised` / `--surface-sunken` / `--surface-card` / `--surface-inverse`
- **テキスト**: `--text-primary` / `--text-secondary` / `--text-tertiary` / `--text-disabled` / `--text-on-inverse`
- **ボーダー**: `--border-strong`（CONCRETE）/ `--border-default` / `--border-subtle` / `--divider`
- **アクション**: `--action-primary-*`（インク on 紙）/ `--action-secondary-*` / `--action-ghost-*` / `--focus-ring`

### 2.6 2つの文脈（Surface contexts）
- 既定の **Paper（明）** と **Asphalt（暗）** の2文脈。`data-theme="asphalt"` で切り替え。
- 同じトークン名で値だけ反転。フッターや反転パネルに使用。

---

## 3. タイポグラフィ（Type）

| ロール | フォント | 設定 |
|---|---|---|
| **Display / Headings** | `--font-display` = **Space Grotesk** (500–700) | 大サイズで letter-spacing −0.02〜−0.03em、センテンスケース |
| **Body / UI** | `--font-body` = **DM Sans** (400–600) | line-height 1.5（UI）〜 1.7（prose） |
| **Mono / Labels / Code** | `--font-mono` = システム mono スタック（webfont なし） | アイブロウ・メタ・スペックキー。大文字 + 0.16em |
| **Japanese** | `--font-jp` = **Noto Sans JP** (400/500/700) | 全ファミリーのフォールバックに含み、JP と Latin を綺麗に同居 |

### 3.1 スケール（1.250 major-third, 11px → 88px）
`--size-3xs 11px`（micro）/ `--size-2xs 12px` / `--size-xs 13px` / `--size-sm 14px` /
`--size-md 16px`（base body）/ `--size-lg 18px` / `--size-xl 22px`（H4）/ `--size-2xl 28px`（H3）/
`--size-3xl 36px`（H2）/ `--size-4xl 48px`（H1）/ `--size-5xl 64px`（display）/ `--size-6xl 88px`（hero）

> 本文の最小は 16px、マイクロラベルは 11–12px。

### 3.2 行間・字間
- Line-height: `--leading-tight 1.05` / `--leading-snug 1.18` / `--leading-normal 1.5` / `--leading-relaxed 1.7`
- Tracking: `--tracking-tight −0.02em` / `--tracking-snug −0.01em` / `--tracking-wide 0.08em` / `--tracking-wider 0.16em`

### 3.3 合成ロール
`--text-display` / `--text-h1` / `--text-h2` / `--text-h3` / `--text-body-lg` / `--text-body` / `--text-mono`

---

## 4. スペーシング & レイアウト（Spacing & Layout）

たっぷりの余白が署名。セクションは呼吸する（縦リズム 64–128px）。

- **スケール**（4px base, 8px rhythm）: `--space-1 4` / `-2 8` / `-3 12` / `-4 16` / `-5 24` / `-6 32` / `-7 48` / `-8 64` / `-9 96` / `-10 128` / `-11 192`
- **コンテナ**: `--container-prose 68ch` / `--container-narrow 720px` / `--container-content 1080px` / `--container-wide 1320px` / `--gutter = --space-5`
- インラインフローではなく **flex / grid + `gap`** を全面採用。

---

## 5. ボーダー・角丸・深度（Borders, Radius, Depth）

- **角丸は最小（0–6px）**: `--radius-xs 2` / `-sm 3` / `--radius-md 4`（コントロール・カード既定）/ `-lg 6` / `--radius-pill 999`（タグ・アバターのみ）。スクエアで工業的。
- **ボーダーが構造を担う**: 既定 1px ハードライン `--border-default`、強調に CONCRETE `--border-strong`、エディトリアルな区切り・選択状態に 2–3px のインク罫（`--border-thick 2` / `--border-rule 3`）。
- **影は使わない。** 深度はボーダー・サーフェスのコントラスト・余白から。唯一許される持ち上げは、フラットな**ハードオフセット** `--shadow-hard: 4px 4px 0 0` インク（ぼかしなし）。インタラクティブなカードのホバーのみ。ソフト/ブラー影は禁止。

---

## 6. モーション（Motion）

- 抑制的。**120–320ms**、`--ease-standard cubic-bezier(0.2,0,0.2,1)`。
- バウンスなし、スプリングなし、無限ループなし。
- ホバー = 色 / ボーダーのシフト。プレス = 1px 下に translate。タブの下線は左からスケールイン。
- `prefers-reduced-motion` を尊重。
- トークン: `--duration-fast 120ms` / `--duration-normal 200ms` / `--duration-slow 320ms` / `--ease-standard` / `--ease-out`

---

## 7. アイコノグラフィ（Iconography）

- **システム**: [Lucide](https://lucide.dev) — 細い **1.5px** ストローク、スクエアな linecap、24×24 グリッド。機械的で抑制された線質が工業的なトーンに合う。CDN（`unpkg.com/lucide`）から読み込み、レンダー後に `lucide.createIcons()` を呼ぶ。`currentColor` を継承。
- **代替フラグ**: Lucide は「選んだ」マッチであり既存のブランド資産ではない。別セットに差し替えても可 — 細く・スクエアな・モノラインの性格を保つこと。
- **Emoji**: アイコンにもコピーにも一切使わない。
- **Unicode**: アイコノグラフィに使わない。状態は Lucide グリフか Badge ドットで。
- 共通セット: ski / car / travel / build / ship / stack / link / status（`guidelines/iconography.card.html`）。

---

## 8. コンポーネント（Components）

ロード後、各コンポーネントは `window.DesignSystem_83d653` に公開される。

```html
<link rel="stylesheet" href="_ds/<folder>/tokens/fonts.css">
<link rel="stylesheet" href="_ds/<folder>/tokens/colors.css">
<link rel="stylesheet" href="_ds/<folder>/tokens/typography.css">
<link rel="stylesheet" href="_ds/<folder>/tokens/spacing.css">
<link rel="stylesheet" href="_ds/<folder>/tokens/base.css">
<link rel="stylesheet" href="_ds/<folder>/styles.css">
<script src="_ds/<folder>/_ds_bundle.js"></script>
```

`window.React` / `window.ReactDOM` を先に読み込むこと。バンドルは通常の `<script>`（`type="text/babel"` も `module` も不要）。

| コンポーネント | 説明 | 例 |
|---|---|---|
| **Button** | ブランドの主アクション。インク on 紙、スクエア、影なし。`variant`: primary / secondary、`size`: sm 等 | `<Button variant="primary">Ship it</Button>` |
| **IconButton** | ラベルなしの正方形アクション（ツールバー） | `<IconButton aria-label="Close"><X /></IconButton>` |
| **Input** | ラベル・ヒント・アイコン・エラー状態付き 1 行テキスト | `<Input label="Email" type="email" required />` |
| **Switch** | バイナリ on/off。スクエアなトラック、紙のサム | `<Switch label="Dark surface" defaultChecked />` |
| **Card** (+ `Card.Body`) | ボーダー付きサーフェス。静止時は影なし、任意のハードオフセット lift。`interactive` / `lift` / `rule` | `<Card><h3>Ran Evo</h3></Card>` |
| **Badge** | 小さなステータス / カテゴリマーカー。mono、大文字、スクエア。`variant`: solid / positive…、`dot` | `<Badge variant="positive" dot>Live</Badge>` |
| **Tag** | フィルタ・キーワード用ピル。選択可・削除可 | `<Tag active onClick={toggle}>React</Tag>` |
| **Tabs** | 水平セクション切替。underline / enclosed（pill） | `<Tabs value={tab} onChange={setTab} … />` |

```jsx
const { Button, Card, Badge, Tag, Tabs, Input, Switch, IconButton } = window.DesignSystem_83d653;
```

### カードのバリエーション
- 既定: `--surface-card` + 1px `--border-default`、4px 角丸、静止時影なし。
- `interactive`: ホバーで CONCRETE ボーダー。
- `lift`: ホバーでハードオフセット影。
- `rule`: 全周ボーダーを 1 本の重いインク上罫に差し替え（エディトリアル）。

---

## 9. UI キット & 参照

- `ui_kits/portfolio/` — アフロのパーソナル SaaS ポートフォリオ（hero / work grid / project detail / writing / about + contact）。クリックスルー可、上記コンポーネントを構成。
- `guidelines/*.card.html` — Colors / Type / Spacing / Brand の仕様カード（Design System タブ）。
- ワードマークは純粋にタイポグラフィ的 — ロゴマークは不要。

---

## 10. 注意点（Caveats）

- **フォントは CDN 配信**（自前ホストではない）。`tokens/fonts.css` が Space Grotesk + DM Sans + Noto Sans JP を Google Fonts から `@import`。mono はOSスタック。オフライン/自前ホストが必要なら `.woff2` を入れて `@import` をローカル `@font-face` に置換。
- コードベース / Figma / ライブサイトは**提供されていない**。ブランドブリーフから起こしたもの。UI キットのサンプル内容（プロジェクト名・コピー・数値）は**説明用**であり、実素材に差し替えること。
- Voice / Tone とアイコノグラフィは推定を含む。実物のサイトやリポジトリがあれば突き合わせ可能。
