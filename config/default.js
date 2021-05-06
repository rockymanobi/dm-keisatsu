module.exports = {
  slack:{
    clientId: process.env.SLACK_APP_CLIENT_ID,
    clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
    verificationToken: process.env.SLACK_APP_VERIFICATION_TOKEN,
    appLevelToken: process.env.SLACK_APP_LEVEL_TOKEN,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  envName: 'local-development',
  host: process.env.HOST_URL || 'hppt://localhost:4000',
  timeSpanForIgnoreMsec: 1 * 60 * 1000
};
