/* global User */
module.exports = function(email, password, done) {
  User.findOne({ email: email }).populate('identities')
    .then(function(user) {
      if (user && user.identities.length === 0) {
        user.verifyPassword(password, function(err, verified) {
          if (err) return done(err);
          done(false, verified ? user : false);
        });
      } else {
        done(false, false);
      }
    })
    .catch(function(err) {
      console.log('Error finding user with email: ', err);
      done(err);
    });
};
