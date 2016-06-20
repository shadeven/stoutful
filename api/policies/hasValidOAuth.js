/* global Passport */

module.exports = function(req, res, next) {
  Passport.authenticate(["oauth2-client-password", "anonymous"], {session: false})(req, res, next);
};
