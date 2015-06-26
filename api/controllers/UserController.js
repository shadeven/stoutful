/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  get: function(req, res) {
    if (!req.user) {
      res.status(401).end();
    } else {
      res.status(200).json(req.user);
    }
  }
};
