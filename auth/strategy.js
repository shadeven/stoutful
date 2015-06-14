var util = require('util');
var Strategy = require('passport-strategy');
var Redis = require('ioredis');
var winston = require('winston');

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

StoutfulStrategy.prototype.authenticate = function(req) {
  winston.info('Authenticating request...');
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
      winston.error('Error fetching access token: ', err);
      self.error(err);
    } else {
      self._verify(userId, accessToken, verified);
    }
  });
};

module.exports = StoutfulStrategy;
