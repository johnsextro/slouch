var http = require('http')
  , appBoot = require('./appBoot.js')
  , config = require('./config')
  , jwt = require('jsonwebtoken')
  , bodyParser = require('body-parser')
  , authorization = require('./authorization/service')
  , score = require('./score/service');

var app = appBoot.init();
app.use(bodyParser.json());

// REST Routes for the API
app.get('/get-score/:id', score.getScore);
app.post('/authorize/get-token', authorization.getToken);


var server = app.listen(3000, function(){
  console.log("Express server listening on port " + app.address().port, app.settings.env);
});
