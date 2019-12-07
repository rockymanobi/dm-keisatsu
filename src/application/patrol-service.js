const store = require('../adaptors/redis');
const slack = require('../adaptors/slack');
const Patrol = require('./patrol');
const msg = require('./message/msg');

async function handleMessage(reqBody) {
  const patrol = new Patrol(reqBody, store);
  if( await patrol.shouldIgnore() ){ return; }

  const latestWarnLog = await store.getLatestWarnLog(reqBody.team_id, reqBody.event.channel);
  const recentEnough = !!latestWarnLog && new Date().getTime() - latestWarnLog.ts < 20000;

  setTimeout(()=>{
    const receiverUserId = patrol.pickReceiverUserId();
    const token = store.getUserAccessToken( reqBody.team_id, receiverUserId).then((token)=>{
      const body = (recentEnough)?
        msg.getMessageBody('ignored',{}) :
        msg.getMessageBody('hello', { userIds: reqBody.authed_users, tokenHolder: receiverUserId });
      body.channel = reqBody.event.channel;
      slack.sendMessage( token, body);
    });
  },1000);

  store.addWarnLog(reqBody.team_id, reqBody.event.channel, reqBody.event.user);
  return;
}

async function reActivatePatrol(reqBody) {
  return store.deleteReejctedLog( teamId, channelId)
}

module.exports = { handleMessage, reActivatePatrol };
