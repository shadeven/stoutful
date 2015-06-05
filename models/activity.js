var database = require('../database');
var bookshelf = require('bookshelf')(database);

var Beer = require('./beer');

module.exports = bookshelf.Model.extend({
  tableName: 'activities',
  beer: function () {
    return this.belongsTo(Beer);
  }
});
