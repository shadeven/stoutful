module.exports.passport = {
  google: {
    strategy: require("passport-google-plus-token"),
    callback: require("../api/services/passport/callbacks/gplus"),
    options: {
      clientID: "1068487601849-a0ep88imse3bn202daabmndcni4abhgl.apps.googleusercontent.com",
      clientSecret: "CwnmJZwHRxhvJlOye8y9FgQE"
    }
  },
  "local": {
    strategy: require("passport-local").Strategy,
    callback: require("../api/services/passport/callbacks/local")
  },
  bearer: {
    strategy: require("passport-http-bearer").Strategy,
    callback: require("../api/services/passport/callbacks/bearer")
  },
  "oauth2-client-password": {
    strategy: require("passport-oauth2-client-password").Strategy,
    callback: require("../api/services/passport/callbacks/oauth2-client-password")
  },
  "anonymous": {
    strategy: require("passport-anonymous").Strategy
  }
};
