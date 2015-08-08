module.exports = {
  signIn: function (user, cb) {
    AccessToken.generateAndSave(user.id)
      .then(function (token) {
        cb(null, token.toJSON());
      })
      .catch(cb);
  }
};
