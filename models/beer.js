var database = require('../database');
var bookshelf = require('bookshelf')(database);

var Brewery = require('./brewery');

module.exports = bookshelf.Model.extend({
  tableName: 'beers',
  brewery: function() {
    return this.belongsTo(Brewery);
  }
});
