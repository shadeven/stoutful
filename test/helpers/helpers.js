var Promise = require("bluebird");

module.exports.createAccessToken = function(user) {
  var accessToken = AccessToken.generateAndSave(user.id);
  var refreshToken = RefreshToken.generateAndSave(user.id);
  return Promise.all([accessToken, refreshToken]);
};

module.exports.destroyModels = function() {
  var keys = Object.keys(sails.models);
  var promises = keys.map(function(key) {
    return sails.models[key].destroy();
  });
  return Promise.all(promises);
};
