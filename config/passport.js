module.exports.passport = {
  google: {
    strategy: require('passport-google-plus-token'),
    callback: require('../api/services/auth/callbacks/gplus'),
    options: {
      clientID: "1068487601849-a0ep88imse3bn202daabmndcni4abhgl.apps.googleusercontent.com",
      clientSecret: "CwnmJZwHRxhvJlOye8y9FgQE"
    }
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
