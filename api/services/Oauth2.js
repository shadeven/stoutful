/* global User, AccessToken */

var oauth2orize = require("oauth2orize");
var chain = require("connect-chain");

var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(function(client, username, password, done) {
  User.findOne({ email: username })
    .then(function(user) {
      if (!user) return done(null, false);

      user.verifyPassword(password)
        .then(function(match) {
          if (!match) return done(null, false);
          AccessToken.generateAndSave(user.id)
            .then(function(accessToken) {
              done(null, accessToken.token);
            });
        });
    });
}));

module.exports.token = chain(server.token(), server.errorHandler());
