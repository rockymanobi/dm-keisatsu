const config = require('config');
const tripleQuart = '```';

function getMessageBody(key, options){
  const bodyGenerater = {
    'hello' : helloBody,
    'ignored' : ignoredBody,
  }[key];
  if(!bodyGenerater){ throw new Error('no such message body template:' + key); }
  const body = bodyGenerater(options || {});
  body.attachments = body.attachments.map(at => Object.assign({}, baseAttachment, at) );
  return body;
}

const helloBody = (options)=>{
  if(!options.userIds || options.userIds.length <= 0){ throw new Error('userIds must be passed'); }
  const users = options.userIds.map(uid => `<@${uid}>さん`).join('、');

  return {
    text: `お疲れ様です！私DM警察と申します！試験運用中です。\n現在 ${users} 宛てのDMが *オープンチャネル利用推進強化のためのパトロール* の対象となっておりまして、DMを送られた方にお声かけさせて頂いております。`,
    attachments: [
      {
        actions: [
          button('DM警察って何？', buttonValue('what_is_dm_keisatsu')),
          button('あ、オープンチャネル行きます', buttonValue('go_open_channel'), 'primary'),
          button('いや、これはDMじゃないと', buttonValue('keep_dm_light'), 'danger'),
          button('これはただの雑談なので...', buttonValue({ storyKey: 'rejected', reasonKey: 'just_a_chat_talk'}), 'default'),
        ],
      }
    ]
  }
};

const ignoredBody = (options)=>{
  return {
    text: `ちょっとだけで良いですので、お話聞いていただけませんか？？(試験運用中です)`,
    attachments: [
      {
        actions: [
          button('DM警察って何？', buttonValue('what_is_dm_keisatsu')),
          button('はいはい、違うとこでやります', buttonValue('go_open_channel'), 'primary'),
          button('いや、これはDMじゃないと', buttonValue('keep_dm_light'), 'danger'),
          button('これはただの雑談なので...', buttonValue({ storyKey: 'rejected', reasonKey: 'just_a_chat_talk'}), 'default'),
        ],
      }
    ]
  }
};

function getAttachments(key, options){
  const attachmentGenerater = {
    'keep_dm_light' : forKeepDmLight,
    'what_is_dm_keisatsu' : whatIsDmKeisatsu,
    'go_open_channel' : thankYouForYourCooperation,
    'keep_dm_strong' : forKeepDmStrong,
    'rejected' : rejected,
  }[key];
  if(!attachmentGenerater){ throw new Error('no such atachemnt template:' + key); }
  return attachmentGenerater(options || {}).map( m => Object.assign({}, baseAttachment, m) );
}

const baseAttachment = {
  callback_id: new Date().getTime(),
  attachment_type: 'default',
  color: '#ff3300',
  // title: 'オープンチャネル推進委員会',
  // title_link: config.host,
  fallback: 'Adding this command requires an official Slack client.',
};

function button(text, value, style){
  if( !value || !JSON.parse(value).version ){ throw new Error('button value has invalid format: '+ value); }
  const name = text;
  return {
    name, text, value, style: style || 'default', type: 'button'
  };
}
function buttonValue(value){
  const _value = typeof value === 'string' ? { storyKey: value }:value;
  const base = {
    version: 'v1',
  };
  return JSON.stringify(Object.assign({}, base, _value));
}

const whatIsDmKeisatsu = (options)=>{
  return [
    {
      fields : [
        {
          title: `:male-police-officer: DM警察`,
          value: `ありがとうございます。我々こういうものです。`,
        },
        {
          title: '',
          value: `${tripleQuart} # オープンチャネル推進委員会 - DM警察\nより多くの情報がオープンな場所でやりとりされるSlackワークスペースを目指して活動しています。\n\n`
            + `パトロール希望者にDMが送られたとき、その方に代わってオープンチャネルでコミュニケーションを取っていただけるようお声かけをしています。`
            + `\n\nパトロールのお申し込みは<${config.host}/auth/register|コチラ>からどうぞ！\n${config.host}/auth/register${tripleQuart}`
          ,
        },
      ],
    },
    {
      actions: [
        button('なるほど、オープンチャネル行きますね', buttonValue('go_open_channel'), 'primary'),
        button('いや、やっぱりこれはDMで', buttonValue('keep_dm_light'), 'danger'),
      ],
    }
  ];
};

const rejected = (options)=>{
  return [
    {
      color: '#ff3300',
      fields : [
        {
          title: `:male-police-officer: DM警察`,
          value: `ありがとうございます。\nでは私は他のチャネルのパトロールに行ってきますので、その間にご要件お済ませください。`,
        },
        {
          value: `${tripleQuart}10分程度でこのチャネルにおけるパトロールが再開されます。${tripleQuart}`,
        },
      ],
    },
  ];
};


const thankYouForYourCooperation = (options)=>{
  return [
    {
      fields : [
        {
          title: `:male-police-officer: DM警察`,
          value: `ご協力ありがとうございます！\nパトロールの申請も受け付けておりますので、よろしければご利用ください！`,
        },
      ],
      color: '#88cc99',
    },
    {
      title: 'オープンチャネル推進委員会',
      title_link: config.host,
      fields : [
        {
          value: `より多くの情報がオープンな場所でやりとりされるSlackワークスペースを目指し、活動しています。`,
        },
        {
          value: `パトロールのお申し込みは<${config.host}/auth/register|コチラ>からどうぞ！`,
        },
      ],
      color: '#88cc99',
    }
  ];
};


const forKeepDmLight = (options)=>{
  return [
    {
      fields : [
        {
          title: `:male-police-officer: DM警察`,
          value: `そうおっしゃる方も多いのですが、我々としてもこのような考え方に基づいてパトロールを行っておりまして...ご協力いただけますでしょうか。`,
        },
        {
          value: `${tripleQuart}#本当にDMが最適ですか？\n\n` +
            `* ここに居ない人の力や情報を頼りたくなったとき、やり取りをシェアしたくなったときなど、ダイレクトメッセージよりもオープンチャネルに情報があった方が何かと便利です\n` +
            `* 通知を飛ばしたい場合は、DMでなくともオープンチャネルにメンション(@rocky等)をつけてメッセージを投稿する\n` +
            `* 複数人DMを多用すると、あとでどこで話したのかわからなくなるので注意です\n` +
            `* 適切なチャネルがわからないならチャネルを立ててしまったり、どこで話すべきかオープンチャネルで聞いてしまうのも良い手です\n` +
            `* いきなりオープンなところに投稿することに抵抗がある場合は、チャネルを作ってその人だけを招待しましょう。そのあと、必要あらばそのチャネルの存在を皆に知らせるなどしてシェアすることができます。\n` +
            `* 内容を秘密にしたい場合、やり取りが恒久的に発生する場合はprivateチャネルを立てましょう\n\n` +
            `* そもそも秘密にすべき情報は思ったより少ないはずです。情報の非対称性を作った時点で情報が少ない人には能動的な行動を期待することが難しくなります。\n` +
            tripleQuart,
        },
      ],
    },
    {
      actions: [
        button('オープンチャネルに行く', buttonValue('go_open_channel'), 'primary'),
        button('いや、やっぱりDMがいい', buttonValue('keep_dm_strong'), 'danger'),
      ],
    }
  ];
};

const forKeepDmStrong = (options)=>{
  return [
    {
      fields : [
        {
          title: `:male-police-officer: DM警察`,
          value: `わかりました。最後に理由だけお答えください！そしたら黙ります！`,
        },
      ],
    },
    {
      fields: [{
        text: 'DMにする理由を教えてください'
      }],
      actions: [
        {
          name: 'reason_list',
          text: 'DMを利用する理由',
          type: 'select',
          options: [
            {
              text: '業務関係ない単なる雑談だから',
              value: buttonValue({ storyKey: 'rejected', text: '業務関係ない単なる雑談だから', reasonKey: 'just_a_chat_talk'}),
            },
            {
              text: '内密に話をしたい',
              value: buttonValue({ storyKey: 'rejected', text: '内密に話をしたい', reasonKey: 'to_keep_it_secret'}),
            },
            {
              text: '通知を飛ばしたい',
              value: buttonValue({ storyKey: 'rejected', text: '通知を飛ばしたい', reasonKey: 'to_mention'}),
            },
            {
              text: '確実に読んでほしい',
              value: buttonValue({ storyKey: 'rejected', text: '確実に読んでほしい', reasonKey: 'to_make_sure_to_read'}),
            },
            {
              text: '適切なチャネルが存在しない',
              value: buttonValue({ storyKey: 'rejected', text: '適切なチャネルが存在しない', reasonKey: 'no_channel_for_the_topic'}),
            },
            {
              text: '面倒臭い',
              value: buttonValue({ storyKey: 'rejected', text: '面倒臭い', reasonKey: 'be_too_lazy'}),
            },
            {
              text: 'その他',
              value: buttonValue({ storyKey: 'rejected', text: 'その他', reasonKey: 'other'}),
            }
          ]
        },
        button('やっぱりオープンチャネル行きます', buttonValue('go_open_channel'), 'primary'),
      ]

    }
  ];
};

module.exports = {
  getAttachments,
  getMessageBody,
};

