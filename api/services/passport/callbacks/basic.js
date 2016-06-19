/* global User */
module.exports = function(email, password, done) {
  User.findOne({ email: email })
    .then(function(user) {
      if (!user) return done(null, false);
      user.verifyPassword(password)
        .then(function(match) {
          done(null, match ? user : false);
        })
        .catch(function(err) {
          done(err);
        });
    })
    .catch(function(err) {
      done(err);
    });
};
