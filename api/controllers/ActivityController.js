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
        return populate(activity);
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

function findActivities(req) {
  var userId = req.params.id;
  var limit = req.query.limit || 10;
  var offset = req.query.offset || 0;

  return Activity
    .find({user_id: userId})
    .skip(offset)
    .limit(limit);
}

function populate(activity) {
  return Rx.Observable.fromPromise(Beer.findOne({id: activity.beer_id}))
    .flatMap(function (beer) {
      var brewery = getBrewery(beer.brewery);
      var category = getCategory(beer.category);
      var style = getStyle(beer.style);
      return Rx.Observable.forkJoin(brewery, category, style)
        .map(function (results) {
          beer.brewery = results[0];
          beer.brewery_id = beer.brewery.id;
          beer.category = results[1];
          beer.cat_id = beer.category.id;
          beer.style = results[2];
          beer.style_id = beer.style.id;
          activity.beer = beer;
          return activity;
        });
    });
}

function getBrewery(breweryId) {
  return Rx.Observable.fromPromise(Brewery.findOne({id: breweryId}));
}

function getCategory(categoryId) {
  return Rx.Observable.fromPromise(Category.findOne({id: categoryId}));
}

function getStyle(styleId) {
  return Rx.Observable.fromPromise(Style.findOne({id: styleId}));
}
