/**
 * ActivitiesController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global sails */

module.exports = {
  get: function(req, res) {
    var userId = req.params.id;
    var limit = req.query.limit || 10;
    var offset = ((req.query.page || 1) * limit) - limit;

    // Get activities belonging to a user
    sails.models.activity.find({user_id: userId}).skip(offset).limit(limit)
      .then(function(result) {
        res.status(200).json(result);
      })
      .catch(function(err) {
        console.log('Error fetching activities for user: ', err);
        res.status(500).end();
      });
  }
};
