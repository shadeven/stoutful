/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  provider: function(req, res, next) {
    if (req.user) return res.status(200).end(); // User is already logged in

    sails.services.passport.provider(req, res, next, function(err, user, accessToken) {
      req.login(user, function(err) {
        if (err) {
          console.log('Error logging in user: ', err);
          return res.status(401).end();
        }

        if (!accessToken) {
          return res.status(401).end();
        }

        return res.status(200).end();
      });
    });
  }
};
