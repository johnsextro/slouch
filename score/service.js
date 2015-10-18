
exports.getScore = function(req, res) {
  if (req.params.id == '2') {
    res.json({score: 20});
  } else {
    res.send(400)
  }
};