/**
 * BeerController
 *
 * @description :: Server-side logic for managing beers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* global Beer, Brewery, Style, Category */
var Rx = require('rx');

module.exports = {
  findOne: function(req, res) {
    var id = req.params.id;

    return Rx.Observable.fromPromise(Beer.findOne({id: id}))
      .flatMap(populate)
      .subscribe(function (beer) {
        res.json(beer);
      }, function (err) {
        res.serverError(err);
      });
  },
  suggestions: function(req, res) {
    res.json({ok: "ok"});
  },
  search: function(req, res) {
    var query = req.query.query;
    Beer.search({
      index: 'stoutful',
      body: { query: { match: { name: query } } }
    })
    .then(function(results) {
      var ids = results.hits.hits.map(function (hit) {
        return {id: parseInt(hit._id)};
      });
      return Beer.find(ids)
        .populate('brewery')
        .populate('category')
        .populate('style');
    })
    .then(function (beers) {
      res.json(beers);
    })
    .catch(function (err) {
      console.log('Error searching for beers: ', err);
      res.status(500).end();
    });
  }
};

function populate(beer) {
  var beerObservable = Rx.Observable.just(beer);
  return Rx.Observable.zip(beerObservable, getBrewery(beer.brewery_id), getStyle(beer.style_id), getCategory(beer.cat_id), function (beer, brewery, style, category) {
    beer.brewery = brewery;
    beer.style = style;
    beer.category = category;
    return beer;
  });
}

function getBrewery(breweryId) {
  return Rx.Observable.fromPromise(Brewery.findOne({id: breweryId}));
}

function getStyle(styleId) {
  return Rx.Observable.fromPromise(Style.findOne({id: styleId}));
}

function getCategory(categoryId) {
  return Rx.Observable.fromPromise(Category.findOne({id: categoryId}));
}
