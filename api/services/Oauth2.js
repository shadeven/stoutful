var oauth2orize = require("oauth2orize");
var chain = require("connect-chain");

var server = oauth2orize.createServer();

server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
  // TODO: Handle
}));

module.exports.token = chain(server.token(), server.errorHandler());
