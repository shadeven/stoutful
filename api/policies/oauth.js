var chain = require("connect-chain");

module.exports = function(req, res, next) {
  var middleware = chain(
    Passport.authenticate("basic", {session: false}),
    Oauth2.token
  );
  middleware(req, res, next);
};
