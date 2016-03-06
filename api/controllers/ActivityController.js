/**
 * ActivitiesController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global Activity, Brewery */
var Promise = require("bluebird");

module.exports = {
  find: function(req, res) {
    var query = req.query;

    if (query.start_date) {
      query.timestamp = {">": query.start_date};
      delete query.start_date;
    }

    if (query.end_date) {
      query.timestamp = {"<": query.end_date};
      delete query.end_date;
    }

    if (!query.limit) {
      query.limit = 10;
    }

    Activity.find(query)
      .sort("timestamp desc")
      .populate(["user", "beer"])
      .then(function(activities) {
        return Promise.map(activities, function(activity) {
          return Brewery.findOne({ id: activity.beer.brewery })
            .then(function(brewery) {
              activity.beer.brewery = brewery;
              return activity;
            });
        });
      })
      .then(function(activities) {
        res.json(activities);
      })
      .catch(function(error) {
        res.serverError(error);
      });
  },
  create: function(req, res) {
    var user = req.user; // current authenticated user
    var body = req.body;

    // user can only create an Activity for themselves!
    if (body.user && user.id != body.user) {
      return res.forbidden({error: "Users can only create an Activity for themselves."});
    } else if (!body.user) {
      body.user = user.id;
    }

    // Sanitize before inserting
    if ("id" in body) {
      delete body.id;
    }

    Activity.create(body)
      .then(function(result) {
        return Activity.findOne(result.id).populate("user");
      })
      .then(function (result) {
        res.status(201).json(result);
      })
      .catch(function (err) {
        res.serverError(err);
      });
  }
};
