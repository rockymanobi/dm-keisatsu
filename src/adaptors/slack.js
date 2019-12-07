
const request = require("request-promise");

async function sendWebhook(webhookUrl, body){
  const requestOptions = {
    method: 'POST',
    url: webhookUrl,
    json: true,
    body: body,
  };

  return request(requestOptions)
    .then((e)=>{  console.log(e.ok); console.log("webhook sent."); return e; })
    .catch((e)=>{ console.log("fail"); console.log(e); return e; })
}


function sendMessage(token, body){
  const requestOptions = {
    method: 'POST',
    url: "https://slack.com/api/chat.postMessage",
    json: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: body
  };

  return request(requestOptions)
    .then((e)=>{  console.log(e.ok); console.log("message sent."); return e;})
    .catch((e)=>{ console.log("fail"); console.log(e); return e;})
}


function revokeToken(token, testMode) {
  const test = testMode? 1 : 0;
  const requestOptions = {
    method: 'GET',
    url: `https://slack.com/api/auth.revoke?token=${token}&test=${test}`,
    json: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return request(requestOptions)
    .then((e)=>{ return JSON.parse(e);})
    .catch((e)=>{ console.log("Fail on getChannelInfo"); console.log(e); return e;})

}

function getChannelInfo(token, channelId){
  const requestOptions = {
    method: 'GET',
    url: `https://slack.com/api/conversations.info?channel=${channelId}&token=${token}`,
    json: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return request(requestOptions)
    .then((e)=>{ return JSON.parse(e);})
    .catch((e)=>{ console.log("Fail on getChannelInfo"); console.log(e); return e;})
}

module.exports = {
  sendWebhook,
  sendMessage,
  getChannelInfo,
  revokeToken,
};

// is_mpim
//// COnversation : multiple
//{
//	"ok": true,
//	"channel": {
//		"id": "GJK5G9LE7",
//		"name": "mpdm-tak.koroki--jdwfg704g--takanori.koroki-1",
//		"is_channel": false,
//		"is_group": true,
//		"is_im": false,
//		"created": 1558510071,
//		"is_archived": false,
//		"is_general": false,
//		"unlinked": 0,
//		"name_normalized": "mpdm-tak.koroki--jdwfg704g--takanori.koroki-1",
//		"is_shared": false,
//		"parent_conversation": null,
//		"creator": "U81GRA5FY",
//		"is_ext_shared": false,
//		"is_org_shared": false,
//		"shared_team_ids": [
//			"T81HEV46T"
//		],
//		"pending_shared": [],
//		"pending_connected_team_ids": [],
//		"is_pending_ext_shared": false,
//		"is_member": true,
//		"is_private": true,
//		"is_mpim": true,
//		"last_read": "1558594010.001900",
//		"is_open": true,
//		"topic": {
//			"value": "Group messaging",
//			"creator": "U81GRA5FY",
//			"last_set": 1558510071
//		},
//		"purpose": {
//			"value": "Group messaging with: @tak.koroki @jdwfg704g @takanori.koroki",
//			"creator": "U81GRA5FY",
//			"last_set": 1558510071
//		}
//	}
//}
//
//
//
//
//
//
// SELF
//{
//	"ok": true,
//	"channel": {
//		"id": "D81NQBWET",
//		"created": 1510749349,
//		"is_archived": false,
//		"is_im": true,
//		"is_org_shared": false,
//		"user": "U81GRA5FY",
//		"is_starred": true,
//		"last_read": "1574223550.000300",
//		"latest": {
//			"type": "message",
//			"subtype": "bot_message",
//			"text": "お疲れ様です！私DM警察と申します！試験運用中です。\n現在 <@U81GRA5FY>さん 宛てのDMが *オープンチャネル利用推進強化のためのパトロール* の対象となっておりまして、DMを送られた方にお声かけさせて頂いております。\n\n *試験運用中* : 監視方式、メッセージなど含めてFeedbackをもらいながら改善中です ",
//			"ts": "1574223550.000300",
//			"username": "dm-keisatsu",
//			"bot_id": "BQTN29X9U",
//			"attachments": [
//				{
//					"callback_id": "1574222954632",
//					"fallback": "Adding this command requires an official Slack client.",
//					"id": 1,
//					"color": "ff3300",
//					"actions": [
//						{
//							"id": "1",
//							"name": "DM警察って何？",
//							"text": "DM警察って何？",
//							"type": "button",
//							"value": "{\"version\":\"v1\",\"storyKey\":\"what_is_dm_keisatsu\"}",
//							"style": "default"
//						},
//						{
//							"id": "2",
//							"name": "あ、オープンチャネル行きます",
//							"text": "あ、オープンチャネル行きます",
//							"type": "button",
//							"value": "{\"version\":\"v1\",\"storyKey\":\"go_open_channel\"}",
//							"style": "primary"
//						},
//						{
//							"id": "3",
//							"name": "いや、これはDMじゃないと",
//							"text": "いや、これはDMじゃないと",
//							"type": "button",
//							"value": "{\"version\":\"v1\",\"storyKey\":\"keep_dm_light\"}",
//							"style": "danger"
//						},
//						{
//							"id": "4",
//							"name": "これはただの雑談なので...",
//							"text": "これはただの雑談なので...",
//							"type": "button",
//							"value": "{\"version\":\"v1\",\"storyKey\":\"rejected\",\"reasonKey\":\"just_a_chat_talk\"}",
//							"style": "default"
//						}
//					]
//				}
//			]
//		},
//		"unread_count": 0,
//		"unread_count_display": 0,
//		"is_open": true,
//		"priority": 0
//	}
//}
