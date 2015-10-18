
exports.getToken = function(req, res) {
  if(req.body.key) {
    res.json({token: "abc123"});
  } else {
    res.send(400);
  }
};