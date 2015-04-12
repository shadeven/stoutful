var util = require('util');
var rp = require('request-promise');
var Strategy = require('passport-strategy');

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

  var accessToken = req.headers.Authorization;
  var verifyUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken;
  rp(verifyUrl)
    .then(function(resp) {
      self._verify(resp.userid, accessToken, verified);
    })
    .catch(function(err) {
      self.error(err);
    });
};

module.exports = StoutfulStrategy;
