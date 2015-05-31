var database = require('../database');
var bookshelf = require('bookshelf')(database);
var elasticsearch = require('../elasticsearch');

var Brewery = require('./brewery');

module.exports = bookshelf.Model.extend({
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
