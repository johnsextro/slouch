var crypto = require('crypto')
var sha1 = crypto.createHash('sha1')

var fakeRedis = {'12345678': 'abc123'}

exports.getToken = function(req, res) {
	if(req.body.key) {
		if(fakeRedis[req.body.key]) {
			res.json({token: fakeRedis[req.body.key]});
		} else {
			res.send(401)
		}
	} else {
	res.send(400);
	}
};

exports.registerKey = function(req, res) {
	if(req.body.regData) {
		if(req.body.regData.email && req.body.regData.website){
			sha1.update(req.body.regData.email + new Date().getTime())
			var newKey = sha1.digest('hex')
			fakeRedis[newKey] = 'newToken'
			console.log(fakeRedis)
			res.json({key: newKey})
		}
	} else {
		res.send(400);
	}
};