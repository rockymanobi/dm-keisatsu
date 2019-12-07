const config = require('config');
function ensureRequestFromSlack(req, res, next){
  if( req.body.token !== config.slack.verificationToken ){
    console.error('invalid verification token');
    return res.send('ng');
  }
  next();
}

function challengeRequestHandler(req, res, next){
  if( req.body.challenge ){
    return res.send(req.body.challenge);
  }
  next();
}

module.exports = {
  ensureRequestFromSlack,
  challengeRequestHandler,
};
