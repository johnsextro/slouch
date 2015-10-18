var http = require('http')
  , appBoot = require('./appBoot.js')
  , config = require('./config')
  , jwt = require('jsonwebtoken')
  , bodyParser = require('body-parser')
  , authorization = require('./authorization/service');

var app = appBoot.init();

// Compatible

// Now less files with @import 'whatever.less' will work(https://github.com/senchalabs/connect/pull/174)
var TWITTER_BOOTSTRAP_PATH = './vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn){
  try {
    var less = require('less');var parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});
    parser.parse(str, function(err, root){fn(err, root.toCSS());});
  } catch (err) {fn(err);}
}

app.use(bodyParser.json());

// REST Routes for the API
app.get('/get-score/:id', function(req, res) {
  if (req.params.id == '2') {
    res.json({score: 20});
  } else {
    res.send(400)
  }
});

app.post('/authorize/get-token', authorization.getToken);

// app.post('/api/createshow', showrest.create);
// app.put('/api/updateshow/:id', showrest.update);

var server = app.listen(3000, function(){
  console.log("Express server listening on port " + app.address().port, app.settings.env);
});
