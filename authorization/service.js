var fakeRedis = {'12345678': 'abc123'}

exports.getToken = function(req, res) {
	if(req.body.key) {
		if(fakeRedis[req.body.key]) {
			res.json({token: fakeRedis[req.body.key]});
		}
			res.send(401)
	} else {
	res.send(400);
	}
};