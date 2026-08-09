---
title: "Ruby3.1.5がインストールできなかったのを解決した"
description: "Ruby3.1.5をm1のmacOSインストールする方法"
createdAt: "2024-05-23T15:40:36.578Z"
updatedAt: "2024-05-23T15:55:15.452Z"
publishedAt: "2024-05-23T15:43:45.917Z"
heroImage:
  url: "/images/blogs/3hhag_3ugr/cover.webp"
  width: 1024
  height: 1024
---

# Ruby 3.1.5をmacOSにインストールする方法

Rubyのインストールで苦戦したことはありませんか？私も最近、Ruby 3.1.5をインストールする際にいくつかの問題に直面しましたが、最終的に成功しました。この記事では、その手順と注意点を共有します。

## 前提条件

- macOS（今回はmacOS Ventura 13.4を使用）
- Homebrewがインストールされていること
- rbenvがインストールされていること

## 手順

### 1. Homebrewと関連パッケージのアップデート

まず、Homebrewを最新の状態にアップデートします。また、必要なパッケージもインストールまたは再インストールします。

```bash
brew update
brew upgrade
brew reinstall openssl@3 readline libyaml gmp
```

### 2. 必要な環境変数の設定

OpenSSLや他のライブラリが正しくリンクされるように環境変数を設定します。

```bash
export LDFLAGS="-L/usr/local/opt/openssl@3/lib"
export CPPFLAGS="-I/usr/local/opt/openssl@3/include"
export PKG_CONFIG_PATH="/usr/local/opt/openssl@3/lib/pkgconfig"
```

### 3. rbenvとruby-buildのアップデート

rbenvとruby-buildを最新の状態にアップデートします。

```bash
brew upgrade rbenv ruby-build
```

### 4. Rubyのインストール

ここが最も重要なステップです。ruby-buildに必要な設定オプションを渡して、Ruby 3.1.5をインストールします。

```bash
CONFIGURE_OPTS="--with-readline-dir=$('/opt/homebrew/bin/brew' --prefix readline) --with-openssl-dir=$('/opt/homebrew/bin/brew' --prefix openssl@3)" rbenv install 3.1.5
```

### 5. インストールの確認

インストールが完了したら、Rubyのバージョンを確認します。

```bash
rbenv versions
rbenv global 3.1.5
ruby -v
```

## トラブルシューティング

私が直面したいくつかのエラーについても触れておきます。

### readlineの問題

ローカルのreadlineが使用されてしまう問題がありました。これを解決するために、Homebrewのreadlineを明示的に指定しました。

```bash
CONFIGURE_OPTS="--with-readline-dir=$('/opt/homebrew/bin/brew' --prefix readline)" rbenv install 3.1.5
```

### OpenSSLの問題

OpenSSLのライブラリが見つからないエラーが発生しました。これも同様に、HomebrewのOpenSSLを指定することで解決しました。

```bash
CONFIGURE_OPTS="--with-openssl-dir=$('/opt/homebrew/bin/brew' --prefix openssl@3)" rbenv install 3.1.5
```

## 結論

これらの手順を踏むことで、無事にRuby 3.1.5をインストールすることができました。同じような問題に直面している方の助けになれば幸いです。

もし問題が解決しない場合は、以下のコマンドで詳細なログを確認することも有効です。

```
tail -f /var/log/install.log
```
