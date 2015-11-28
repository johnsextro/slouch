var crypto = require('crypto');

var _this = this;

// Begin Public API
exports.requestToken = function(req, res, redisClient) {
	var apiKey = req.body.key;
	if(apiKey) {
		redisClient.get(apiKey, function(err, reply) {
			_this.sendTokenResponse(reply, apiKey, res);
		});
	} else {
		res.send(400);
	}
};

exports.requestKey = function(req, res, redisClient) {
	if(_this.doesKeyReqHaveRequiredData(req.body)) {
		_this.siteExists(req.body.regData.email, req.body.regData.website, res, _this.sendResponseBasedOnSiteExistence, redisClient)	
	} else {
		res.send(400);
	}
};

// End Public API

exports.sendTokenResponse = function(reply, apiKey, res) {
	if(reply !== null) {
		res.json({token: apiKey});
	} else {
		res.send(401);
	}	
};

exports.doesKeyReqHaveRequiredData = function(body) {
	var retVal = false;
	if(body.regData && body.regData.website && body.regData.email) {
		retVal = true;
	}
	
	return retVal;
};

exports.sendApiKey = function(email, siteName, res, redisClient) {
	var sha1 = crypto.createHash('sha1')
	sha1.update(email + new Date().getTime());
	var apiKey = sha1.digest('hex');
	redisClient.set(apiKey, '');
	redisClient.hmset(siteName, {'email': email, 'key': apiKey});
	res.json({'apiKey': apiKey });
	res.end();
};

exports.siteExists = function(email, siteName, res, callback, redisClient) {
	redisClient.hgetall(siteName, function(err, reply) {
		callback(reply, email, siteName, res, redisClient);
	});
};

exports.sendResponseBasedOnSiteExistence = function(reply, email, siteName, res, redisClient) {
	if(reply) { //The site exists already
		res.send(500)
	} else {
		_this.sendApiKey(email, siteName, res, redisClient); 
	}
}