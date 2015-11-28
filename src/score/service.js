var _this = this;

exports.getScore = function(req, res, redisClient) {
	if (req.body.userId) {
		redisClient.get(req.body.userId, function(err, reply) {
			_this.sendScoreResponse(res, reply);
		});
	} else {
		res.send(400)
	}
};

exports.sendScoreResponse = function(res, reply) {
	console.error(reply);
	if(reply){
		res.json({score: reply});
	} else {
		res.send(400);
	}
}