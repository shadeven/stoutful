/* global Passport */
module.exports = function () {
  return {
    initialize: function (next) {
      Passport.loadStrategies();
      return next();
    }
  };
};
