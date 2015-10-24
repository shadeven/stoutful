module.exports.passport = {
  google: {
    strategy: require('../passport/strategies/google'),
    callback: require('../api/services/auth/callbacks/gplus')
  },
  basic: {
    strategy: require('passport-http').BasicStrategy,
    callback: require('../api/services/auth/callbacks/basic')
  }
};
