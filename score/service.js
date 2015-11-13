var fakeRedis = {'2': 20}
exports.getScore = function(req, res) {
	if (req.body.userId) {
		if(fakeRedis[req.body.userId]){
			res.json({score: fakeRedis[req.body.userId]});
		} else {
			res.send(400)
		}
	} else {
		res.send(400)
	}
};