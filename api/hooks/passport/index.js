/**
 * passport hook
 */

module.exports = function (sails) {
  return {
    // Run when sails loads-- be sure and call `next()`.
    initialize: function (next) {
      sails.services.passport.loadStrategies();
      return next();
    }
  };
};
