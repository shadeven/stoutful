var database = require('../database');
var bookshelf = require('bookshelf')(database);
var elasticsearch = require('../elasticsearch');

module.exports = bookshelf.Model.extend({
  tableName: 'breweries',
  index: function () {
    elasticsearch.index({
      index: 'stoutful',
      type: 'brewery',
      id: this.get('id'),
      body: {
        name: this.get('name'),
        description: this.get('description')
      }
    }, function(err) {
      if (err) {
        console.log('Unable to index brewery:', err);
      }
    });
  }
});
