var request = require('supertest');

module.exports = {
  signIn: function (user, cb) {
    request(sails.hooks.http.app)
      .post('/oauth/token')
      .send({grant_type: 'password', username: user.email, password: user.password})
      .end(function (err, res) {
        if (err) return cb(err);
        cb(null, res.body);
      });
  }
};
