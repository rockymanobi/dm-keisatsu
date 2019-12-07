const express = require('express');
const config = require('config');
const router = express.Router();
const { handleMessage, reActivatePatrol } = require('../../application/patrol-service');
const { handleButtonActions } = require('../../application/conversation-service');
const { handleAppMention } = require('../../application/app-mention-service');

/**
 * Slack Event Subscription を捌く
 */
router.post('/', async (req, res)=>{
  if( req.body.challenge ){ return res.send(req.body.challenge); }
  if( req.body.token !== config.slack.verificationToken ){ console.error('invalid verification token'); return res.send('ng'); }
  // 応答は非同期
  res.send('ok');

  if(req.body.event.type ==='app_mention' ){
    // DM以外でメンションされた
    return handleAppMention({
      teamId: req.body.team_id,
      channelId: req.body.event.channel,
      sendUserId: req.body.event.user,
      text: req.body.event.text,
    });
  }else{
    // それ以外（DM)
    return handleMessage(req.body)
  }
});

/**
 * Slack Button Actions を捌く
 */
router.post('/buttonActions', (req, res)=>{
  const payload = JSON.parse(req.body.payload);
  if( payload.token !== config.slack.verificationToken ){
    console.error('invalid verification token'); return res.send('ng');
  }
  const responsePayload = handleButtonActions(payload);
  return res.send(responsePayload);
});


/**
 * Slack Slush Commandを捌く
 */
router.post('/slush', async (req, res)=>{
  if( req.body.token !== config.slack.verificationToken ){
    console.error('invalid verification token'); return res.send('ng');
  }
  const teamId = req.body.team_id;
  const channelId = req.body.channel_id;
  await reActivatePatrol(teamId, channelId);
  res.send('ok');
});

module.exports = router;
