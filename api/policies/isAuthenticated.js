/* global AccessToken */

module.exports = function(req, res, next) {
  var authorization = req.headers.authorization;

  // No access token no access
  if (!authorization) {
    return res.status(401).end();
  }

  // Extract token from Authorization header
  // Expect Authorization to be "Bearer ..."
  var regex = /^Bearer (.*)$/;
  var match = regex.exec(authorization);
  if (!match) {
    return res.status(400).end();
  }
  var token = match[1];

  // Verify access token is correct
  AccessToken.findOne({token: token}, function(err, result) {
    if (err) return next(err);

    if (!result) {
      return res.status(401).end();
    }

    next();
  });
};
