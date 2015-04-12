var passport = require('passport');

/*
 * Authentication middleware to be used with routes.
 */
var isAuthenticated = function(req, res, next) {
  passport.authenticate('custom', {session: false}, function(err) {
    if (err) {
      if (err.response && err.response.body) {
        return res.type('application/json').status(401).send(err.response.body);
      } else {
        return res.type('application/json').status(401).end();
      }
    }
    next();
  })(req, res, next);
};

module.exports = isAuthenticated;
