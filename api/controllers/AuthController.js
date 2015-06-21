var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var moment = require('moment');

module.exports = {
  token: function(req, res) {
    var grantType = req.body.grant_type;

    if (!grantType) {
      res.status(400).end();
      return;
    }

    if (grantType == 'password') {
      handlePasswordGrant(req, res);
    } else if (grantType == 'refresh_token') {
      handleRefreshTokenGrant(req, res);
    }
  }
};

/**
 * Handles a refresh token grant
 */
function handleRefreshTokenGrant(req, res) {
  var body = req.body;
  var refreshToken = body.refresh_token;

  // A refresh token is needed in order to refresh a users token.
  if (!refreshToken) {
    res.status(400).end();
  }

  // Authenticate client?

  // Validate refresh token
  var RefreshToken = this.sails.models.refreshtoken;
  RefreshToken.findOne({ token: refreshToken })
    .then(function(result) {
      if (!result) {
        res.status(401).end();
        return;
      }

      // Issue a new access token
      generateAccessToken({ id: result.user_id })
        .then(saveAccessToken)
        .then(function(token) {
          // Reformat this token to comply with OAuth2 spec
          delete token.user;
          res.status(201).json(token);
        })
        .catch(function(err) {
          console.log('Error issuing access token: ', err);
          res.status(500).end();
        });
    });
}

/**
 * Handles a password credentials grant
 */
function handlePasswordGrant(req, res) {
  var body = req.body;
  var email = body.username;
  var password = body.password;

  // Request requires an email and password
  if (!email || !password) {
    res.status(400).end();
    return;
  }

  // Find user in database and generate an access token
  findUser(email)
    .then(function(user) {
      if (!user) {
        // The user doesnt exist in our system
        res.status(401).end();
        return;
      }

      var AccessToken = this.sails.models.accesstoken;
      var RefreshToken = this.sails.models.refreshtoken;
      AccessToken.findOne({user_id: user.id}, function(err, accessToken) {
        if (err) {
          res.status(500).end();
          return;
        }
        if (accessToken) {
          // We already have an access token for this user,
          // so we must also have a refresh token
          RefreshToken.findOne({ user_id: accessToken.user_id })
            .then(function(refreshToken) {
              res.status(200).json({
                access_token: accessToken.token,
                refresh_token: refreshToken.token,
                token_type: 'bearer',
                expires_in: accessToken.expiresIn()
              });
            })
            .catch(function(err) {
              console.log('Error querying refresh token: ', err);
              res.status(500).end();
            });
        } else {
          // We don't already have an access token for this user.
          verifyCredentials(user, password)
            .then(generateAccessToken)
            .then(generateRefreshToken)
            .then(saveRefreshToken)
            .then(saveAccessToken)
            .then(function(token) {
              // Reformat this token to comply with OAuth2 spec
              delete token.user;
              res.status(201).json(token);
            })
            .catch(function(err) {
              console.log('Error issuing access token: ', err);
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

/**
 * Stores given access token.
 */
function saveAccessToken(payload) {
  return new Promise(function(fulfill, reject) {
    var AccessToken = this.sails.models.accesstoken;
    var expiresAt = moment().add(24, 'hours').toDate();
    AccessToken.create({ user_id: payload.user.id, token: payload.access_token, expires_at: expiresAt })
      .then(function(accessToken) {
        // Apply a TTL to the access token.
        AccessToken.native(function(err, redis) {
          var key = 'waterline:accesstoken:id:' + accessToken.id;
          var expiresIn = accessToken.expiresIn();
          redis.expire([key, expiresIn], function(err, success) {
            if (err) reject(err);
            if (success) {
              payload.expires_in = expiresIn;
              fulfill(payload);
            } else {
              reject(new Error('Unable to set TTL time on access token.'));
            }
          });
        });
      })
      .catch(reject);
  });
}

function saveRefreshToken(payload) {
  return new Promise(function(fulfill, reject) {
    var RefreshToken = this.sails.models.refreshtoken;

    RefreshToken.create({ user_id: payload.user.id, token: payload.refresh_token })
      .then(function() { fulfill(payload); })
      .catch(reject);
  });
}

/**
 * Generates a refresh token for the given access token.
 */
function generateRefreshToken(payload) {
  return new Promise(function(fulfill) {
    var prefix = crypto.randomBytes(4).toString('hex');
    var body = crypto.randomBytes(60).toString('hex');
    var refresh_token = prefix + '.' + body;

    payload.refresh_token = refresh_token;
    fulfill(payload);
  });
}

/**
 * Generates an access token for the given user.
 */
function generateAccessToken(user) {
  var AccessToken = this.sails.models.accesstoken;
  return new Promise(function(fulfill) {
    var token = AccessToken.generate();
    var type = 'bearer';
    fulfill({user: user, access_token: token, token_type: type});
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
