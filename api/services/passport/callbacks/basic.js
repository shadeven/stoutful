/* global User */
module.exports = function(email, password, done) {
  User.findOne({ email: email })
    .then(function(user) {
      if (user) {
        user.verifyPassword(password, function(err, verified) {
          if (err) return done(err);
          done(false, verified ? user : false);
        });
      } else {
        done(false, false);
      }
    })
    .catch(function(err) {
      done(err);
    });
};
