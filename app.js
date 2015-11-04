var http = require('http')
  , appBoot = require('./appBoot.js')
  , config = require('./config')
  , jwt = require('jsonwebtoken')
  , bodyParser = require('body-parser')
  , registration = require('./authorization/registrationService')
  , score = require('./score/service');

var app = appBoot.init();
app.use(bodyParser.json());

// REST Routes for the API
app.post('/get-score', score.getScore);
app.post('/register/request-token', registration.requestToken);
app.post('/register/request-key', registration.requestKey);

var server = app.listen(3000, function(){
  console.log("Express server listening on port " + app.address().port, app.settings.env);
});
