/* global Client */

module.exports = function(clientId, clientSecret, done) {
  Client.findOne({ clientId: clientId })
    .then(function(client) {
      if (!client) return done(null, false);
      if (client.clientSecret != clientSecret) return done(null, false);

      done(null, client);
    });
};
