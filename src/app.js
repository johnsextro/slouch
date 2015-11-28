var http = require('http')
  , appBoot = require('./appBoot.js')
  , config = require('./config')
  , jwt = require('jsonwebtoken')
  , bodyParser = require('body-parser')
  , registration = require('./authorization/registrationService')
  , score = require('./score/service')
  , redis = require('redis')
  , client = redis.createClient('6379', 'redis');

client.on("connect", function () {
    console.log("connected");
});

var app = appBoot.init();
app.use(bodyParser.json());

// REST Routes for the API
app.post('/get-score', score.getScore);
app.post('/register/request-token', function(req, res) {
	registration.requestToken(req, res, client);
});
app.post('/register/request-key', function(req, res) {
	registration.requestKey(req, res, client);
});

var server = app.listen(3000, function(){
  console.log("Express server listening on port " + app.address().port, app.settings.env);
});
