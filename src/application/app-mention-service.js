const config = require('config');
const store = require('../adaptors/redis');
const slack = require('../adaptors/slack');

async function handleAppMention({
  sendUserId,
  channelId,
  teamId,
  text,
}) {
  console.log(text);
  try {
    const replyText = await reaction({ text, sendUserId, teamId });
    // REPLY
    const botToken = await store.getBotToken(teamId);
    const body = {
      text: replyText,
      channel: channelId,
    }
    slack.sendMessage( botToken, body);
  } catch (e) {
    console.error(e);
  }
}

async function reaction({text, sendUserId, teamId}){
  try {
    if(text.includes('パトロールよろしく')){
      return `<@${sendUserId}>ありがとうございます。<${config.host}/auth/register|コチラ> から登録してください！`
    } else if (text.includes('パトロールおしまい')) {
      // await REVOKE
      console.log(sendUserId)
      const token = await store.getUserAccessToken(teamId, sendUserId)
      console.log(token)
      const result = await slack.revokeToken(token);
      console.log(result);
      return `<@${sendUserId}>ありがとうございました！再度パトロールをご要望の際は「パトロールよろしく」とメンションください！\n\n` +
        `注意 : アプリをインストールした人コマンドを実行すると、@DM警察 がチャネルからいなくなってしまいます。\n` +
        `もしも\`removed an integration from this channel: dm-keisatsu\`と表示されている場合は、再度 ${config.host} からDMをワークスペースにインストールし直してください（消去する必要はありません）`
    } else if (text.includes('実績')){
      return `実装したいね`
    } else {
      return `<@${sendUserId}> すみません。まだ勉強中につき「パトロールよろしく」か「パトロールおしまい」しか理解できないんです。`
    }
  } catch(e) {
    console.error(e);
    return `<@${sendUserId}> 失敗した... Twitterで@rocky_manobi とかに聞いてみてください`
  }
}


module.exports = { handleAppMention };
// <${config.host}/auth/register|コチラ>
