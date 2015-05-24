var util = require('util');
var rp = require('request-promise');
var crypto = require('crypto');
var Strategy = require('passport-strategy');
var Redis = require('ioredis');

function StoutfulStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }

  if (!verify) {
    throw new TypeError('StoutfulStrategy requires a verify callback');
  }

  Strategy.call(this);

  this.name = 'custom';
  this._verify = verify;
}

util.inherits(StoutfulStrategy, Strategy);

StoutfulStrategy.prototype.authenticate = function(req, options) {
  var self = this;

  function verified(err) {
    if (err) {
      self.error(err);
    } else {
      self.success();
    }
  }

  var accessToken = req.headers.authorization;
  var redis = new Redis();
  redis.get(accessToken, function(err, userId) {
    if (err) {
      self.error(err);
    } else {
      self._verify(userId, accessToken, verified);
    }
  });
};

module.exports = StoutfulStrategy;
