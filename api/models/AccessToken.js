/**
* AccessToken.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
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
    expires_at: {
      type: 'datetime',
      required: true
    },
    expiresIn: function() {
      return parseInt(moment.duration(moment(this.expires_at).diff(moment())).asSeconds());
    }
  },
  generate: function() {
    var prefix = crypto.randomBytes(4).toString('hex');
    var body = crypto.randomBytes(60).toString('hex');
    return prefix + '.' + body;
  }
};
