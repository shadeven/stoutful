/* global Passport */
module.exports = function(req, res, next) {
  if (req.user) return next(null, req.user);
  var provider = ["local", "bearer"];
  if (req.params && req.params.provider) {
    provider = req.params.provider;
  }
  Passport.authenticate(provider)(req, res, next);
};
