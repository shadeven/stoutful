/**
* AccessToken.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

/* global AccessToken */

var Promise = require('bluebird');
var crypto = require('crypto');
var moment = require('moment');

module.exports = {
  connection: 'redis',
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
    token_type: {
      type: 'string',
      required: true
    },
    expires_at: {
      type: 'datetime',
      required: true
    },
    expiresIn: function() {
      return parseInt(moment.duration(moment(this.expires_at).diff(moment())).asSeconds());
    },
    toJSON: function() {
      var obj = this.toObject();
      obj.expires_at = moment(obj.expires_at).valueOf();
      obj.access_token = obj.token;
      delete obj.id;
      delete obj.token;
      delete obj.user_id;
      return obj;
    }
  },
  generate: function(userId) {
    var prefix = crypto.randomBytes(4).toString('hex');
    var body = crypto.randomBytes(60).toString('hex');
    var token = prefix + '.' + body;
    var type = 'bearer';
    var expiresAt = moment().add(24, 'hours').toDate();
    return {user_id: userId, token: token, expires_at: expiresAt, token_type: type};
  },
  generateAndSave: function(userId) {
    var token = this.generate(userId);
    var self = this;
    return new Promise(function(fulfill, reject) {
      self.create(token)
        .then(fulfill)
        .catch(reject);
    });
  },
  setTTL: function(id, ttl) {
    return new Promise(function (fulfill, reject) {
      if (!AccessToken.native) {
        fulfill();
        return;
      }
      AccessToken.native(function(err, redis) {
        var key = 'waterline:accesstoken:id:' + id;
        redis.expire([key, ttl], function(err, success) {
          if (err) reject(err);
          if (success) {
            fulfill();
          } else {
            reject(new Error('Unable to set TTL time on access token.'));
          }
        });
      });
    });
  },
  afterCreate: function(values, cb) {
    var expiresAt = moment(values.expires_at);
    var expiresIn = parseInt(moment.duration(expiresAt.diff(moment())).asSeconds());
    this.setTTL(values.id, expiresIn)
      .then(cb)
      .catch(cb);
  }
};
