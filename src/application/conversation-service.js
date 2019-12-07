const store = require('../adaptors/redis');
const msg = require('./message/msg');

function handleButtonActions(payload) {

  const action = payload.actions[0];

  const reaction = {
    userSelection: null,
    actionValue: null,
  };
  if(action.type === 'button'){
    const button = payload.actions[0];
    reaction.actionValue = JSON.parse(button.value);
    reaction.userSelection = button.name;
  }else if(action.type === 'select'){
    const selected = payload.actions[0].selected_options[0];
    reaction.actionValue = JSON.parse(selected.value);
    reaction.userSelection = `理由 : 「${reaction.actionValue.text}」`;
  }

  if(reaction.actionValue.storyKey === 'rejected'){
    store.addRejectedLog(payload.team.id, payload.channel.id, payload.user.id, reaction.actionValue);
  }

  // update selected value
  const lastAttachment = payload.original_message.attachments[payload.original_message.attachments.length -1];
  lastAttachment.actions = [];
  lastAttachment.color = '#aaaaaa';
  lastAttachment.fields = [{value: `:slightly_smiling_face: <@${payload.user.id}>\n${reaction.userSelection}`}];

  let newFields = [];
  payload.original_message.attachments.forEach((at)=>{
    newFields = newFields.concat(at.fields);
  });
  payload.original_message.attachments = [{ fields: newFields}];

  // next anser
  const n = msg.getAttachments(reaction.actionValue.storyKey,{});
  payload.original_message.attachments = payload.original_message.attachments.concat(n);


  return payload.original_message;
}

module.exports = { handleButtonActions };
