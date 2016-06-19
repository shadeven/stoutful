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
    id: {
      type: "integer",
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: 'integer',
      required: true
    },
    token: {
      type: 'string',
      required: true
    },
    createdAt: {
      type: 'datetime',
      columnName: "created_at"
    },
    updatedAt: {
      type: 'datetime',
      columnName: "updated_at"
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
    return this.create(token);
  }
};
