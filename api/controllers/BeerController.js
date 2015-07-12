/**
 * BeerController
 *
 * @description :: Server-side logic for managing beers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* global Beer */
module.exports = {
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
