module.exports = function(email, password, next) {
  User.findOne({ email: email })
    .then(function(user) {
      if (!user) return next(null, false);
      user.verifyPassword(password)
        .then(function(match) {
          if (!match) return next(null, false);
          next(null, user);
        });
    });
};
