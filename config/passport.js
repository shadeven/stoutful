module.exports.passport = {
  google: {
    strategy: require('../passport/strategies/google'),
    callback: require('../api/services/auth/callbacks/gplus')
  }
};
