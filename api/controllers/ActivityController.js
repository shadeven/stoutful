/**
 * ActivitiesController
 *
 * @description :: Server-side logic for managing activities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* global Activity, Beer, Brewery */
var Rx = require('rx');

module.exports = {
  find: function(req, res) {
    var query = req.query;

    if (query.start_date) {
      query.timestamp = {'>': query.start_date};
      delete query.start_date;
    }

    Rx.Observable.fromPromise(Activity.find(query))
      .flatMap(function (activities) {
        return Rx.Observable.from(activities);
      })
      .selectMany(function (activity) {
        return Rx.Observable.zip(Rx.Observable.just(activity), beerObservable(activity.beer_id), function (activity, beer) {
          activity.beer = beer;
          return activity;
        });
      })
      .toArray()
      .subscribe(function (activities) {
        res.json(activities);
      }, function (error) {
        res.serverError(error);
      });
  },
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

function beerObservable(beerId) {
  return Rx.Observable.fromPromise(Beer.findOne({id: beerId}))
    .switchMap(function (beer) {
      return Rx.Observable.zip(Rx.Observable.just(beer), breweryObservable(beer.brewery_id), function (beer, brewery) {
        beer.brewery = brewery;
        return beer;
      });
    });
}

function breweryObservable(breweryId) {
  return Rx.Observable.fromPromise(Brewery.findOne({id: breweryId}));
}
