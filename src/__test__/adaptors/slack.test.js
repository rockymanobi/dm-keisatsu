
const { slack } = require('config');
const { revokeToken, getChannelInfo } = require('../../adaptors/slack');

describe('', () => {
  it('', async () => {
    const token = slack.testToken;
    const res =  await getChannelInfo(token, 'GJK5G9LE7');
    console.log(res);
  });
});
describe('', () => {
  it('', async () => {
    const token = slack.testToken;
    const res =  await revokeToken(token, 1); // TESTモードで実行
    console.log(res);
  });
});
