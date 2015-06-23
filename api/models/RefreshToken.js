/**
* RefreshToken.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Promise = require('bluebird');
var crypto = require('crypto');

module.exports = {
  tableName: 'refresh_tokens',
  attributes: {
    user_id: {
      type: 'integer'
    },
    token: {
      type: 'string'
    }
  },
  generate: function(userId) {
    var prefix = crypto.randomBytes(4).toString('hex');
    var body = crypto.randomBytes(60).toString('hex');
    var token = prefix + '.' + body;
    return {user_id: userId, token: token};
  },
  generateAndSave: function(userId) {
    var token = this.generate(userId);
    var self = this;
    return new Promise(function (fulfill, reject) {
      self.create(token)
        .then(fulfill)
        .catch(reject);
    });
  }
};
