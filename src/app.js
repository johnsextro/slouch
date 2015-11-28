var http = require('http')
  , appBoot = require('./appBoot.js')
  , config = require('./config')
  , jwt = require('jsonwebtoken')
  , bodyParser = require('body-parser')
  , registration = require('./authorization/registrationService')
  , score = require('./score/service')
  , redis = require('redis')
  , client = redis.createClient('6379', 'redis');
var SCORE_DB = 1;
var REGISTRATION_DB = 0;


client.on("connect", function () {
    console.log("connected");
});

var app = appBoot.init();
app.use(bodyParser.json());

// REST Routes for the API
app.post('/get-score', function(req, res) {
	client.select(SCORE_DB);
	score.getScore(req, res, client);
});
app.post('/register/request-token', function(req, res) {
	client.select(REGISTRATION_DB);
	registration.requestToken(req, res, client);
});
app.post('/register/request-key', function(req, res) {
	client.select(REGISTRATION_DB);
	registration.requestKey(req, res, client);
});

var server = app.listen(3000, function(){
  console.log("Express server listening on port " + app.address().port, app.settings.env);
});
