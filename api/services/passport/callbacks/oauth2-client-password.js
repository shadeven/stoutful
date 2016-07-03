/* global Client */

module.exports = function(clientId, clientSecret, next) {
  Client.findOne({ clientId: clientId })
    .then(function(client) {
      if (!client) return next(null, false);
      if (client.clientSecret != clientSecret) return next(null, false);

      next(null, client);
    });
};
