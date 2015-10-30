var crypto = require('crypto')

var keyLookup = {};
var siteLookup = {};
var _this = this;

exports.requestToken = function(req, res) {
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

exports.requestKey = function(req, res) {
	var sha1 = crypto.createHash('sha1')
	if(req.body.regData) {
		var website = req.body.regData.website;
		if(_this.alreadyExists(website)){
			res.send(500)
		} else if(req.body.regData.email && website){
			sha1.update(req.body.regData.email + new Date().getTime())
			var apiKey = sha1.digest('hex')
			keyLookup[apiKey] = website
			siteLookup[website] = apiKey
			res.json({'apiKey': apiKey})
		}
	} else {
		res.send(400);
	}
};

exports.alreadyExists = function(siteName) {
	return siteLookup[siteName];
};