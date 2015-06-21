/* global sails */

module.exports = function(req, res, next) {
  var accessToken = req.headers.authorization;

  // No access token no access
  if (!accessToken) {
    return res.status(401).end();
  }

  // Verify access token is correct
  sails.models.accesstoken.findOne({token: accessToken}, function(err, token) {
    if (err) return next(err);

    if (!token) {
      return res.status(401).end();
    }

    next();
  });
};
