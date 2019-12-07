const config = require('config');
const url = require('url');

// これを利用することで...
function hostVerifier(req, res, next){
  const requestHost = req.headers.host;
  const configHost = url.parse(config.host).host;
  if( configHost !== requestHost) {
    const msg = `Env value HOST_URL did not match request.headers.host: ${requestHost} vs ${configHost}`;
    console.error(msg);
    return res.send(msg);
  }
  next();
}

module.exports = {
  hostVerifier
};
