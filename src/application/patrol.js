const config = require('config');
const slack = require('../adaptors/slack');

class Patrol {

  constructor(params, store){
    this.store = store;

    this.sendUserId = params.event.user; // メッセージを送信したユーザ
    this.authedUsers = params.authed_users; // DM内にいるDM警察パトロール対象のユーザ
    this.channelId = params.event.channel;
    this.teamId = params.team_id;
    this.eventType = params.event.type;
    this.eventSubType = params.event.subtype;
  }

  async shouldIgnore(){
    if(this.eventType !== 'message' ){ return true; }
    if(false && this.authedUsers.includes( this.sendUserId ) ){
      console.log("自分のメッセージなのでで無視しました");
      return true;
    }
    if( this.eventSubType === 'bot_message'){
      console.log("bot messageなので無視しました");
      return true;
    }
    if( this.eventSubType === 'message_changed'){
      console.log("change イベントは無視です");
      return true;
    }

    const rejectedLog = await this.store.getLatestRejectedLog( this.teamId, this.channelId);
    if(rejectedLog){
      const pastTimeMsec = new Date().getTime() - rejectedLog.ts;
      if(pastTimeMsec < config.timeSpanForIgnoreMsec){
        console.log('猶予期間なので無視')
        return true;
      }
    }

    const isSelfDM = await ( async ()=>{
      const token = await this.store.getUserAccessToken( this.teamId, this.sendUserId)
        .catch(printAndIgnoreError);
      if(!token){ return false }

      const channelInfo = await slack.getChannelInfo(token, this.channelId);
      if(!channelInfo.channel){ return false; } // Channel情報取得に失敗 -> 無視しないに倒す

      return channelInfo.channel.user === this.sendUserId;
    })();
    if(isSelfDM) {
      console.log('自分宛のDMは許可');
      return true;
    }
    console.log("介入しますNE");
    return false;
  }

  pickReceiverUserId(){
    // TODO メソッド名と実態が全然違うので変えよう
    const primaryUserId = this.authedUsers.find( au => au === this.sendUserId);
    if( primaryUserId ){ return primaryUserId; }

    const userId = this.authedUsers.find( au => au !== this.sendUserId);
    return (userId)? userId : this.sendUserId; // 上記の場合どのみち失敗するのだが
  }
}

function printAndIgnoreError(e){
  console.error(e);
}

module.exports = Patrol;
