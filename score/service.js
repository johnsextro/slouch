var fakeRedis = {'2': 20}
exports.getScore = function(req, res) {
	if (req.params.id) {
		if(fakeRedis[req.params.id]){
			res.json({score: fakeRedis[req.params.id]});
		} else {
			res.send(400)
		}
	} else {
		res.send(400)
	}
};