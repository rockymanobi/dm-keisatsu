const express = require('express');
const router = express.Router();
const passport = require('../passport');
const store = require('../redis');
const slack = require('../slack');
const config = require('config');

// あんまりたくさん修正入らないので、
// このままロジックもここに置いておくことにする
router.get('/add_to_slack', (req, res)=>{
  res.render('add_to_slack', {});
});

router.get('/add_to_slack/success', (req, res)=>{
  res.render('add_to_slack_result', {success: true});
});
router.get('/add_to_slack/fail', (req, res)=>{
  res.render('add_to_slack_result', {success: false} );
});

router.get('/register/success', (req, res)=>{
  res.render('register_result', {success: true});
});
router.get('/register/fail', (req, res)=>{
  res.render('register_result', {success: false});
});

router.get('/register', (req, res)=>{
  res.render('register', {});
});

router.get('/slackPersonal', passport.authorize('slack-personal'));
router.get('/slack', passport.authorize('slack-admin'));

router.get('/slack/callback',
  passport.authorize('slack-admin', { failureRedirect: '/auth/add_to_slack/fail' }),
  (req, res)=>{
    const account = req.account;
    // console.log( account );
    store.createOrUpdateWorkspace(
      account.team_id,
      account.team_name,
      account.bot.bot_user_id,
      account.bot.bot_access_token,
      account.incoming_webhook,
      account.user_id
    ).then((e)=>{
      sendWebhook(account.team_id, welcomMessageBody(config.host, account.user_id,));
      res.redirect('/auth/add_to_slack/success');
    }).catch((e)=>{
      res.redirect('/auth/add_to_slack/fail');
      console.log(e);
    });
  }
);

router.get('/slackPersonal/callback',
  passport.authorize('slack-personal', { failureRedirect: '/auth/register/fail' }),
  (req, res) => {
    const account = req.account;
    store.addOrUpdateUserToken(
      account.team_id,
      account.user_id,
      account.access_token
    ).then(()=>{
      res.redirect("/auth/register/success");
    }).catch((e)=>{
      console.log(e);
      res.redirect("/auth/register/fail");
    });
  }
);

async function sendWebhook(teamId, body){
  const webhookUrl = await store.getWebhookUrl(teamId);
  return slack.sendWebhook(webhookUrl, body);
}

function welcomMessageBody(host, userId){
  return {
    text: 'SlackBot DM警察がインストールされました',
    attachments: [
      {
        title: `DM警察`,
        title_link: `${host}`,
        fields: [
          {
            value: `<@${userId}>さんによってDM警察がチームにインストールされました。`,
          },
          {
            value: `DMパトロールをご希望の方は<${host}/auth/register|コチラ>より登録いただけます`,
          },
          {
            value: `めっちゃ試験運用なので、動きとか監視ポリシーとか含めて全部試験です`,
          },
          {
            value: `マニュアルやサポート周りなどはまだないです。すみません`,
          },
          {
            value: `身に覚えのない方はアプリの設定画面からこのアプリを決してください`,
          }

        ],
      },
    ],
    footer: 'オープンチャネル利用推進委員会の提供でお送りいたします',
  }
}

module.exports = router;
