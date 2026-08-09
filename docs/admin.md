# 管理画面

`/admin` から記事を作成・編集・削除できる。記事の実体は `content/blogs/<slug>.md` なので、
管理画面を使わずエディタで直接書いても構わない。どちらで書いても結果は同じファイルになる。

## 保存先

保存先は環境変数で決まる。

| モード | 条件 | 挙動 |
| --- | --- | --- |
| `fs` | `GITHUB_TOKEN` / `GITHUB_REPOSITORY` が未設定 (ローカル開発の既定) | リポジトリのファイルを直接書き換える。git の作業ツリーに差分が出るので、内容を確認してから自分でコミットする |
| `github` | 両方が設定済み (本番の既定) | GitHub にコミットする。push を受けて Vercel が再ビルドし、サイトに反映される |

`ADMIN_STORE` に `fs` / `github` を入れると明示的に切り替えられる。ただし本番で `fs` は使えない。
サーバーのファイルシステムはリクエストごとに捨てられるため、保存したつもりの内容が消えるから。

記事の本文と画像は Git Data API で1コミットにまとめて送る。中途半端な状態がコミットされない。

## 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 必須 | ログインパスワード |
| `ADMIN_SESSION_SECRET` | 必須 | セッション Cookie の署名鍵。`openssl rand -base64 32` などで作った十分長い文字列 |
| `GITHUB_TOKEN` | 本番で必須 | `contents: write` 権限を持つ fine-grained personal access token |
| `GITHUB_REPOSITORY` | 本番で必須 | `kinjo1130/portfolio-v4` の形式 |
| `GITHUB_BRANCH` | 任意 | コミット先ブランチ。既定は `main` |
| `ADMIN_STORE` | 任意 | `fs` / `github` を明示指定する |

`ADMIN_PASSWORD` と `ADMIN_SESSION_SECRET` の両方が揃っていない環境では、`/admin` は 404 を返す。
設定を忘れたまま公開して、パスワードなしで開けてしまう事故を防ぐため。

## 認証

パスワードを1回照合し、7日間有効の署名付き Cookie (HttpOnly / SameSite=Lax / 本番では Secure) を発行する。
Cookie の中身は有効期限と、それを `ADMIN_SESSION_SECRET` で HMAC-SHA256 した値だけで、
パスワードそのものは載せない。パスワードと署名の比較はどちらもダイジェスト同士の
`timingSafeEqual` で行う。

`/admin` 配下には `X-Robots-Tag: noindex, nofollow` を付けて検索結果に出さない。

## ローカルで動かす

```bash
ADMIN_PASSWORD=<好きな文字列> ADMIN_SESSION_SECRET=<好きな文字列> pnpm dev
```

`http://localhost:3000/admin` を開くとログイン画面に飛ぶ。
