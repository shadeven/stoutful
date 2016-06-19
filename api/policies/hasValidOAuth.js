/* global Passport, OAuth2 */

var chain = require("connect-chain");

module.exports = function(req, res, next) {
  var middleware = chain(
    Passport.authenticate(["oauth2-client-password", "anonymous"], {session: false}),
    OAuth2.token
  );
  middleware(req, res, next);
};
