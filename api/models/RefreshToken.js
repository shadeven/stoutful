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
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    user_id: {
      type: 'integer',
      required: true
    },
    token: {
      type: 'string',
      required: true
    },
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return new Date();
      }
    },
    updated_at: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return new Date();
      }
    }
  },
  beforeUpdate: function(values, cb) {
    values.updated_at = new Date();
    cb();
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
