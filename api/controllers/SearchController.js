/**
 * SearchController
 */

var _ = require("underscore");

module.exports = {
  /**
   * `SearchController.search()`
   */
  search: function (req, res) {
    var types = req.query.type.split(",");
    var query = req.query.query;

    elasticsearch.search({
      type: types,
      q: "name:" + req.query.query
    })
    .then(function(results) {
      return results.hits.hits;
    })
    .then(function(hits) {
      return hits.map(function(hit) {
        return {
          id: parseInt(hit._id),
          name: hit._source.name,
          type: hit._type
        };
      });
    })
    .then(function(results) {
      res.ok(results);
    })
    .catch(function(error) {
      res.serverError(error);
    })
  }
};

