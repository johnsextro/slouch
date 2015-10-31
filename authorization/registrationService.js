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
	if(_this.reqHasRequiredData(req.body)) {
		if(_this.siteAlreadyRegistered(req.body.regData.website)){
			res.send(500)
		} else {
			res.json({'apiKey': _this.calcApiKey(req.body.regData.email, req.body.regData.website) })
		}
	} else {
		res.send(400);
	}
};

exports.reqHasRequiredData = function(body) {
	var retVal = false;
	console.log(body.regData);
	if(body.regData && body.regData.website && body.regData.email) retVal = true;
	
	return retVal;
};

exports.calcApiKey = function(email, siteName) {
	var sha1 = crypto.createHash('sha1')
	sha1.update(email + new Date().getTime());
	var apiKey = sha1.digest('hex');
	keyLookup[apiKey] = siteName;
	siteLookup[siteName] = apiKey;

	return apiKey;
};

exports.siteAlreadyRegistered = function(siteName) {
	return siteLookup[siteName];
};