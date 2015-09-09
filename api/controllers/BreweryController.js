/**
 * BreweriesController
 *
 * @description :: Server-side logic for managing breweries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 /* global Brewery */
var Rx = require('rx');

module.exports = {
  search: function(req, res) {
    var query = req.query.query;
    searchBrewery(query)
      .flatMap(function (breweries) {
        return Rx.Observable.from(breweries);
      })
      .toArray()
      .subscribe(function (breweries) {
        res.json(breweries);
      }, function (err) {
        res.serverError(err);
      });
  }
};

function searchBrewery(query) {
  return Rx.Observable.fromPromise(Brewery.search({
    index: 'stoutful',
    body: { query: { match: { name: query }}}
  }))
  .flatMap(function (result) {
    return Rx.Observable.from(result.hits.hits);
  })
  .map(function (hit) {
    return {id: parseInt(hit._id)};
  })
  .toArray()
  .switchMap(function (ids) {
    return Rx.Observable.fromPromise(Brewery.find(ids));
  });
}
