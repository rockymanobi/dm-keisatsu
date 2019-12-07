const config = require("config");
const express = require("express");
const bodyParser = require('body-parser');
const passport = require('./adaptors/passport');
const store = require('./adaptors/redis');
const expressLayouts = require('express-ejs-layouts');
const { hostVerifier } = require('./adaptors/express-middlewares/hostVerifier')
const app = express();

console.log( `========= env=${config.envName} で起動します=========` );

app.use(hostVerifier);
app.use(passport.initialize());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static('public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res)=>{
  res.render('index', {});
});

app.use('/auth', require('./adaptors/routes/auth'));
app.use('/slackEvents', require('./adaptors/routes/actions'));

const server = app.listen(process.env.PORT || 4000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});
