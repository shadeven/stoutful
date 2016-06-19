/* global Passport */
module.exports = function(req, res, next) {
  if (req.user) {
    return next();
  }
  Passport.authenticate(["basic", "bearer"])(req, res, next);
};
