/* global sails, User */
var passport = require('passport');

passport.provider = function(req, res, next, callback) {
  var provider = req.params.provider;
  if (!provider) return res.status(400).end();

  this.authenticate(provider, callback)(req, res, next);
};

passport.loadStrategies = function() {
  var self = this;
  var strategies = sails.config.passport;

  Object.keys(strategies).forEach(function(key) {
    var Strategy = strategies[key].strategy;
    var options = strategies[key].options || {};
    var callback = strategies[key].callback || null;

    self.use(key, new Strategy(options, callback));
  });
};

passport.serializeUser(function (user, next) {
  next(null, user.id);
});

passport.deserializeUser(function (id, next) {
  User.findOne({id: id})
    .then(function (user) {
      next(null, user || null);
    })
    .catch(next);
});

module.exports = passport;
