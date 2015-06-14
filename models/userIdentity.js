var database = require('../database');
var bookshelf = require('bookshelf')(database);

var User = require('./user');

module.exports = bookshelf.Model.extend({
  tableName: 'user_identities',
  user: function () {
    return this.belongsTo(User);
  }
});
