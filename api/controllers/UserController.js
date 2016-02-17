/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global Activity, Patch, Promise */

module.exports = {
  me: function(req, res) {
    if (!req.user) {
      res.status(401).end();
    } else {
      res.status(200).json(req.user);
    }
  },
  stats: function(req, res) {
    var likeCount = Activity.count({
      user_id: req.user.id, type: "like"
    });
    var checkInCount = Activity.count({
      user_id: req.user.id, type: "check_in"
    });
    var patchCount = Patch.count({
      editor: req.user.id
    });
    Promise.all([likeCount, checkInCount, patchCount])
      .then(function(results) {
        res.json({
          likes: results[0],
          check_ins: results[1],
          submitted_patches: results[2]
        });
      })
      .catch(function(err) {
        res.serverError(err);
      });
  }
};
