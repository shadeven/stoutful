/* global passport */
module.exports = function(req, res, next) {
  if (req.user) {
    return next();
  }
  passport.authenticate(["basic", "bearer"])(req, res, next);
};
