var database = require('../database');
var bookshelf = require('bookshelf')(database);
var elasticsearch = require('../elasticsearch');

var Brewery = require('./brewery');

var Beer = bookshelf.Model.extend({
  tableName: 'beers',
  initialize: function () {
    // Update elasticsearch index after save.
    this.on('saved', this.index);
  },
  brewery: function() {
    return this.belongsTo(Brewery);
  },
  index: function () {
    elasticsearch.index({
      index: 'stoutful',
      type: 'beer',
      id: this.get('id'),
      body: {
        name: this.get('name'),
        description: this.get('description')
      }
    }, function(err) {
      if (err) {
        console.log('Unable to index beer:', err);
      }
    });
  }
});

Beer.search = function(query) {
  return new Promise(function (resolve, reject) {
    elasticsearch.search({
      index: 'stoutful',
      body: {
        query: {
          match: {
            name: query
          }
        }
      }
    }, function (err, response) {
      if (err) {
        reject(err);
      } else {
        var ids = response.hits.hits.map(function (hit) {
          return parseInt(hit._id);
        });
        resolve(ids);
      }
    });
  });
};

module.exports = Beer;
