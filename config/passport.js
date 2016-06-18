module.exports.passport = {
  google: {
    strategy: require('../passport/strategies/google'),
    callback: require('../api/services/auth/callbacks/gplus')
  },
  basic: {
    strategy: require('passport-http').BasicStrategy,
    callback: require('../api/services/auth/callbacks/basic')
  },
  bearer: {
    strategy: require("passport-http-bearer").Strategy,
    callback: require("../api/services/auth/callbacks/bearer")
  }
};
