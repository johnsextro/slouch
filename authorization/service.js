var crypto = require('crypto')

var keyLookup = {'12345678': 'abc123'}
var siteLookup = {}

exports.getToken = function(req, res) {
	if(req.body.key) {
		if(keyLookup[req.body.key]) {
			res.json({token: keyLookup[req.body.key]});
		} else {
			res.send(401)
		}
	} else {
	res.send(400);
	}
};

exports.registerKey = function(req, res) {
	var sha1 = crypto.createHash('sha1')
	if(req.body.regData) {
		var website = req.body.regData.website;
		if(siteLookup[website]){
			res.send(500)
		} else if(req.body.regData.email && website){
			sha1.update(req.body.regData.email + new Date().getTime())
			var newKey = sha1.digest('hex')
			keyLookup[newKey] = website
			siteLookup[website] = newKey
			console.log(keyLookup)
			res.json({key: newKey})
		}
	} else {
		res.send(400);
	}
};