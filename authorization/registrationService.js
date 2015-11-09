var crypto = require('crypto')
  , redis = require('redis')
  , client = redis.createClient();

var _this = this;

client.on("connect", function () {
    console.log("connected");
});

// Begin Public API
exports.requestToken = function(req, res) {
	var apiKey = req.body.key;
	if(apiKey) {
		if(client.exists(apiKey)){
			res.json({token: apiKey});	
		} else {
			res.send(401);	
		}
	} else {
		res.send(400);
	}
};

exports.requestKey = function(req, res) {
	if(_this.doesKeyReqHaveRequiredData(req.body)) {
		_this.siteExists(req.body.regData.email, req.body.regData.website, res, _this.sendResponseBasedOnSiteExistence)	
	} else {
		res.send(400);
	}
};

// End Public API

exports.doesKeyReqHaveRequiredData = function(body) {
	var retVal = false;
	if(body.regData && body.regData.website && body.regData.email) {
		retVal = true;
	}
	
	return retVal;
};

exports.sendApiKey = function(email, siteName, res) {
	var sha1 = crypto.createHash('sha1')
	sha1.update(email + new Date().getTime());
	var apiKey = sha1.digest('hex');
	client.set(apiKey, '');
	client.hmset(siteName, {'email': email, 'key': apiKey});
	res.json({'apiKey': apiKey });
	res.end();
};

exports.siteExists = function(email, siteName, res, callback) {
	client.hgetall(siteName, function(err, reply) {
		callback(reply, email, siteName, res);
	});
};

exports.sendResponseBasedOnSiteExistence = function(reply, email, siteName, res) {
	if(reply) { //The site exists already
		res.send(500)
	} else {
		_this.sendApiKey(email, siteName, res); 
	}
}