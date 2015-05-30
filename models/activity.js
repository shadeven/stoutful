var database = require('../database');
var bookshelf = require('bookshelf')(database);

module.exports = bookshelf.Model.extend({
  tableName: 'activities'
});
