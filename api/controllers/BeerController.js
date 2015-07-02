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
    Beer.search(query)
      .then(function(results) {
        res.json(results);
      })
      .catch(function () {
        res.status(500).end();
      });
  }
};
