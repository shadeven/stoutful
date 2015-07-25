/**
 * ActivitiesController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global Activity */

module.exports = {
  create: function(req, res) {
    var user = req.user; // current authenticated user
    var body = req.body;

    // user can only create an Activity for themselves!
    if (user.id != body.user_id) {
      return res.forbidden({error: 'Users can only create an Activity for themselves.'});
    }

    // Sanitize before inserting
    if ('id' in body) {
      delete body.id;
    }

    Activity.create(body)
      .then(function (result) {
        res.status(201).json(result);
      })
      .catch(function (err) {
        res.serverError(err);
      });
  }
};
