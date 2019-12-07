
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/rockymanobi/dm-keisatsu)

# DM警察です

* [公式サイト](https://dm-keisatsu.herokuapp.com) からインストールして使えます
* 独自環境を構築したい場合は[こちらの記事](https://rocky-dev.kibe.la/shared/entries/4d1c1fd8-c2cb-4399-ab28-42380f812839) を参考にどうぞ。

# ローカルで動かす

* 一度[Herokuボタンを使った環境構築](https://rocky-dev.kibe.la/shared/entries/4d1c1fd8-c2cb-4399-ab28-42380f812839)をやってみると、設定項目などの感覚がわかって良いと思います。

### 注意

### requirement

* node.js v10.0 or later
* redis
* slackアプリのトークン（client_id, client_secret, verification_token)
* ngrockなど、グローバルIPでローカルPCにアクセスできるような環境

### 動かし方

#### 依存関係のインストール

```
npm i
```

#### 起動

```
REDIS_URL=${redisのURL} \n
SLACK_APP_CLIENT_ID=${slack app の client id} \n
SLACK_APP_CLIENT_SECRET=${slack app の client secret} \n
SLACK_APP_VERIFICATION_TOKEN=${slack app の verification token} \n
npm start
```

# Contribution

* Super Welcom!
* なのですが、勢いで書いてるから、しばらくは大変だと思います。闇をみる覚悟を。
* 永続化機構がRedisオンリー。すでに辛いので移行したい。
* テストはコンソールデバッグ機としての用途でしか書いてないので気をつけて

# License

[MIT](https://github.com/rockymanobi/dm-keisatsu/blob/master/LICENSE)

