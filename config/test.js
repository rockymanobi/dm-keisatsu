module.exports = {
  slack:{
    testToken: process.env.SLACK_TEST_TOKEN,
  }
}

if(process.env.NODE_ENV === 'test'){
  describe('', () => {
    it('', ()=>{});
  });
}
