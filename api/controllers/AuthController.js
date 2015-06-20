/* global sails */

var Promise = require('bluebird');
var bcrypt = require('bcrypt');

module.exports = {
  token: function(req, res) {
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // Request requires an email and password
    if (!email && !password) {
      res.status(400).end();
    }

    // Find user in database and generate an access token.
    findUser(email)
      .then(function(user) {
        this.sails.models.accesstoken.findOne({user_id: user.id}, function(err, accessToken) {
          if (err) {
            res.status(500).end();
            return;
          }
          if (accessToken) {
            // We already have an access token for this user.
            res.status(200).json(accessToken);
          } else {
            // We don't already have an access token for this user.
            verifyCredentials(user, password)
              .then(generateAccessToken)
              .then(saveAccessToken)
              .then(setAccessTokenTTL)
              .then(function(token) {
                res.status(201).json(token);
              })
              .catch(function(err) {
                console.log(err);
                res.status(500).end();
              });
          }
        });
      })
      .catch(function(err) {
        console.log(err);
        res.status(500).end();
      });
  }
};

/**
 * Sets an expire time on the given access token.
 */
function setAccessTokenTTL(accessToken) {
  return new Promise(function(fulfill, reject) {
    this.sails.models.accesstoken.native(function(err, redis) {
      var key = 'waterline:accesstoken:id:' + accessToken.id;
      var expiresIn = 24 * (60*60); // 24 hours
      redis.expire([key, expiresIn], function(err, success) {
        if (err) reject(err);
        if (success) {
          fulfill(accessToken);
        } else {
          reject(new Error('Unable to set TTL time on access token.'));
        }
      });
    });
  });
}

/**
 * Stores given access token.
 */
function saveAccessToken(accessToken) {
  return new Promise(function(fulfill, reject) {
    this.sails.models.accesstoken.create({user_id: accessToken.user.id, token: accessToken.token}, function(err, token) {
      if (err) reject(err);
      fulfill(token);
    });
  });
}

/**
 * Generates an access token for the given user.
 */
function generateAccessToken(user) {
  return new Promise(function(fulfill, reject) {
    bcrypt.hash(user.email, 10, function(err, hash) {
      if (err) reject(err);
      fulfill({user: user, token: hash});
    });
  });
}

/**
 * Checks the given password against the stored password.
 */
function verifyCredentials(user, password) {
  return new Promise(function(fulfill, reject) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) reject(err);
      if (result) {
        fulfill(user);
      } else {
        reject(new Error('Password does not match.'));
      }
    });
  });
}

/**
 * Fetches the user associated with the given email.
 */
function findUser(email) {
  return new Promise(function(fulfill, reject) {
    this.sails.models.user.findOne({ email: email }, function(err, user) {
      if (err) reject(err);
      fulfill(user);
    });
  });
}
