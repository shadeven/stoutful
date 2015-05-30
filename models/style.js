var database = require('../database');
var bookshelf = require('bookshelf')(database);

var Category = require('./category');

module.exports = bookshelf.Model.extend({
  tableName: 'style',
  category: function() {
    return this.belongsTo(Category);
  }
});
