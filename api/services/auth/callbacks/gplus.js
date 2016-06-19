/* global User, UserIdentity, UserFactory */

module.exports = function(accessToken, refreshToken, profile, next) {
  findOrCreateUser(profile)
    .then(function(user) {
      next(null, user);
    })
    .catch(function(err) {
      next(err);
    });
};

function findOrCreateUser(profile) {
  var emails = profile.emails.map(function(email) {
    return email.value;
  });
  return User.find({ email: emails })
    .then(function(users) {
      if (users.length === 0) {
        return UserFactory.createFromGoogle(profile);
      } else {
        return users[0];
      }
    })
    .then(function(user) {
      var attrs = {
        provider: "google",
        user: user.id,
        provider_id: profile.id
      };
      return UserIdentity.findOrCreate(attrs);
    });
}
