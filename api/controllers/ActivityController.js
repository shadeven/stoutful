/**
 * ActivitiesController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global Activity, Beer, Brewery */
var Rx = require('rx');

module.exports = {
  get: function(req, res) {
    // Get activities belonging to a user
    Rx.Observable.fromPromise(findActivities(req))
      .flatMap(function (activities) {
        return Rx.Observable.from(activities);
      })
      .flatMap(function (activity) {
        return populateBeer(activity);
      })
      .toArray()
      .subscribe(
        function (activities) {
          res.json(activities);
        }
      );
  },

  create: function(req, res) {
    var user = req.user; // current authenticated user
    var body = req.body;

    // user can only create an Activity for themselves!
    if (user.id != body.user_id) {
      return res.forbidden({error: 'Users can only create an Activity for themselves.'});
    }

    Activity.create(body)
      .then(function (result) {
        res.status(201).json(result);
      })
      .catch(function (err) {
        console.log(err);
        res.serverError(err);
      });
  }
};

function findActivities(req) {
  var userId = req.params.id;
  var limit = req.query.limit || 10;
  var offset = req.query.offset || 0;

  return Activity
    .find({user_id: userId})
    .skip(offset)
    .limit(limit);
}

function populateBeer(activity) {
  return Rx.Observable.fromPromise(Beer.findOne({id: activity.beer}))
    .flatMap(function (beer) {
      activity.beer = beer;
      return populateBrewery(beer)
        .map(function (beer) {
          activity.beer = beer;
          return activity;
        });
    });
}

function populateBrewery(beer) {
  return Rx.Observable.fromPromise(Brewery.findOne({id: beer.brewery}))
    .map(function (brewery) {
      beer.brewery = brewery;
      return beer;
    });
}
