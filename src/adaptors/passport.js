const config = require('config');
const CLIENT_ID = config.slack.clientId;
const CLIENT_SECRET = config.slack.clientSecret;
const SlackStrategy = require('passport-slack-oauth2').Strategy;
const passport = require('passport');

////////////////////////////////////
// DMパトロール依頼
passport.use(new SlackStrategy({
    name:"slack-personal",
    skipUserProfile: true,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: `${config.host}/auth/slackPersonal/callback`,
    scope: [ 'im:history', 'mpim:history','chat:write:bot', 'im:read']
  }, (accessToken, refreshToken, params , profile, done) => {
    // optionally persist profile data
    done(null, params);
  }
));

////////////////////////////////////
// アプリのインストール
passport.use(new SlackStrategy({
    name:"slack-admin",
    skipUserProfile: true,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: `${config.host}/auth/slack/callback`,
    scope: [ 'bot', 'commands', 'incoming-webhook']
  }, (accessToken, refreshToken, params,profile, done) => {
    console.log(params)
    console.log(profile)
    // optionally persist profile data
    done(null, params);
  }
));

module.exports = passport;
