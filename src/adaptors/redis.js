const config = require('config');
const client = new (require("ioredis"))(config.redis.url);
client.on("error", function (err) {
    console.log("Error " + err);
});

function getRejectedLogKey(teamId, channelId){
  const REJECTED_LOG_PREFIX = 'REJECTED:';
  return `${REJECTED_LOG_PREFIX}${teamId}-${channelId}`;
}

async function addRejectedLog(teamId, channelId, actionUserId, actionValue){
  const ts = new Date().getTime();
  const key = getRejectedLogKey(teamId, channelId);
  console.log(key);
  const body = JSON.stringify({ teamId, channelId, actionUserId, ts, actionValue});
  await client.lpush(key, body);
}

async function getLatestRejectedLog(teamId, channelId){
  const key = getRejectedLogKey(teamId, channelId);
  const logs = await client.lrange(key,0,0);
  return (logs[0])? JSON.parse(logs[0]) : null;
}

function getWarnLogKey(teamId, channelId){
  const WARN_LOG_PREFIX = 'WARN:';
  return `${WARN_LOG_PREFIX}${teamId}-${channelId}`;
}

async function addWarnLog(teamId, channelId, actionUserId){
  const ts = new Date().getTime();
  const key = getWarnLogKey(teamId, channelId);
  const body = JSON.stringify({ teamId, channelId, actionUserId, ts});
  await client.lpush(key, body);
}

async function getLatestWarnLog(teamId, channelId){
  const key = getWarnLogKey(teamId, channelId);
  const logs = await client.lrange(key,0,0);
  return (logs[0])? JSON.parse(logs[0]) : null;
}

async function createOrUpdateWorkspace( teamId, teamName, botUserId, botAccessToken, incoming_webhook, lastRegisterUserId ){
  const key = teamId;
  const team = await getTeamObject(key);
  if(!team){
    await client.set(key, JSON.stringify({ teamId, teamName, botUserId, botAccessToken, lastRegisterUserId, incoming_webhook,users:[] }));
  }else{
    team.incoming_webhook = incoming_webhook;
    team.botAccessToken = botAccessToken;
    team.botUserId = botUserId;
    team.lastRegisterUserId = lastRegisterUserId;
    await client.set(key, JSON.stringify( team ));
  }
}

async function getTeamObject( teamId ){
  const key = teamId;
  const team = await client.get(key);
  if(!team){
    return null;
  }else{
    return JSON.parse(team);
  }
};

async function addOrUpdateUserToken( teamId, userId, userAccessToken ){
  const key = teamId;
  const team = await getTeamObject(key);
  if(!team){
    throw new Error('no application installed');
  }else{
    const user = team.users.find(u => u.userId === userId);
    if( user ){
      user.userAccessToken = userAccessToken;
      user.ts = new Date().getTime();
    }else{
      team.users.push({userId, userAccessToken, ts: new Date().getTime()});
    }
    await client.set(key, JSON.stringify( team ));
  }
}

async function deleteReejctedLog(teamId, channelId){
  const key = getRejectedLogKey(teamId, channelId);
  return client.del(key)
}

async function getBotToken( teamId ) {
  const key = teamId;
  const team = await getTeamObject(key);
  if(!team) { return null; }
  return team.botAccessToken;
}

async function getWebhookUrl(teamId) {
  const team = await getTeamObject(teamId);
  if(!team){ throw new Error('no team fond'); }
  if(!team.incoming_webhook){ throw new Error('the team does not webhook scope'); }
  return team.incoming_webhook.url;
}
async function getUserAccessToken(teamId, userId) {
  const team = await getTeamObject(teamId);
  if(!team){ throw new Error('no team fond'); }

  const user = team.users.find(u => u.userId === userId);
  if(!user){ throw new Error('not registered'); }

  return user.userAccessToken;
}

module.exports = {
  createOrUpdateWorkspace,
  addOrUpdateUserToken,
  getUserAccessToken,
  getWebhookUrl,
  getBotToken,
  deleteReejctedLog,
  addWarnLog,
  getLatestWarnLog,
  addRejectedLog,
  getLatestRejectedLog,
};
