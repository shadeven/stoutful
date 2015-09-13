/* global AccessToken, User */

var Promise = require('bluebird');

module.exports = function(req, res, next) {
  if (req.user) {
    return next();
  }

  var authorization = req.headers.authorization;

  // No access token no access
  if (!authorization) {
    return res.status(401).end();
  }

  // Extract token from Authorization header
  // Expect Authorization to be "Bearer ..."
  var regex = /^Bearer (.*)$/;
  var match = regex.exec(authorization);
  if (!match) {
    return res.status(400).end();
  }
  var token = match[1];

  // Verify access token is correct and that user exists
  AccessToken.findOne({token: token})
    .then(findUser)
    .then(function (user) {
      if (user) {
        req.user = user;
        next();
      } else {
        next(new Error('User not found'));
      }
    })
    .catch(function() {
      res.status(401).end();
    });
};

function findUser(accessToken) {
  return new Promise(function(fulfill, reject) {
    if (accessToken) {
      User.findOne({id: accessToken.user_id})
        .then(fulfill)
        .catch(reject);
    } else {
      reject(new Error('Access token not found'));
    }
  });
}
