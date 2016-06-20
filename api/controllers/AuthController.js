/* global OAuth2 */

module.exports = {
  token: function(req, res, next) {
    OAuth2.token(req, res, next);
  },

  login: function(req, res) {
    var user = req.user;
    req.login(user, function(err) {
      if (err) return res.negotiate(err);
      return res.ok(user);
    });
  },

  logout: function(req, res) {
    req.session.destroy(function(err) {
      if (err) return res.negotiate(err);
      req.logout();
      res.status(200).end();
    });
  },
};
