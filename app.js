var http = require('http')
  , appBoot = require('./appBoot.js')
  , config = require('./config')
  , jwt = require('jsonwebtoken')
  , bodyParser = require('body-parser')
  , registration = require('./authorization/registrationService')
  , score = require('./score/service')
  , redis = require('redis')
  , client = redis.createClient();

var app = appBoot.init();
app.use(bodyParser.json());

// REST Routes for the API
app.post('/get-score', score.getScore);
app.post('/register/request-token', registration.requestToken);
app.post('/register/request-key', registration.requestKey);

client.on("error", function (err) {
    console.log("Error " + err);
});

client.on('connect', function() {
    console.log('connected');
});

var server = app.listen(3000, function(){
  console.log("Express server listening on port " + app.address().port, app.settings.env);
});
