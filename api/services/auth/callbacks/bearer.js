/* global User, AccessToken */

module.exports = function(token, done) {
  AccessToken.findOne({ token: token })
    .then(function(accessToken) {
      return User.findOne({ id: accessToken.user_id });
    })
    .then(function(user) {
      done(null, user);
    })
    .catch(function(err) {
      done(err);
    });
};
