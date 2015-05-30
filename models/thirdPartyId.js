var database = require('../database');
var bookshelf = require('bookshelf')(database);

var User = require('./user');

module.exports = bookshelf.Model.extend({
  tableName: 'third_party_ids',
  user: function () {
    return this.belongsTo(User);
  }
});
