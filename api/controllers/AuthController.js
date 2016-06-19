/* global RefreshToken, AccessToken, User, Passport */

var Promise = require('bluebird');
var bcrypt = require('bcrypt');
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
  },

  login: function(req, res, next) {
    if (req.user) return res.status(200).end(); // User is already logged in
    var provider = req.params.provider;
    Passport.authenticate(provider, function(err, user) {
      if (err) return res.negotiate(err);
      return res.ok(user);
    })(req, res, next);
  },

  logout: function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        console.log('Error destroying session: ', err);
        return res.status(500).end();
      }
      req.logout();
      res.status(200).end();
    });
  },
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
  RefreshToken.findOne({ token: refreshToken })
    .then(function(result) {
      if (!result) {
        res.status(401).end();
        return;
      }

      // Issue a new access token
      generateAccessToken({ id: result.user_id })
        .then(function(token) {
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
              var result = accessToken.toJSON();
              result.refresh_token = refreshToken.token;
              res.status(200).json(result);
            })
            .catch(function(err) {
              console.log('Error querying refresh token: ', err);
              res.status(500).end();
            });
        } else {
          // We don't already have an access token for this user.
          verifyCredentials(user, password)
            .then(function (user) {
              return Promise.all([generateAccessToken(user), generateRefreshToken(user)]);
            })
            .then(function(values) {
              var accessToken = values[0];
              var refreshToken = values[1];
              var result = accessToken.toJSON();
              result.refresh_token = refreshToken.token;
              res.status(201).json(result);
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
 * Generates a refresh token for the given access token.
 */
function generateRefreshToken(user) {
  return RefreshToken.generateAndSave(user.id);
}

/**
 * Generates an access token for the given user.
 */
function generateAccessToken(user) {
  return AccessToken.generateAndSave(user.id);
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
    User.findOne({ email: email }, function(err, user) {
      if (err) reject(err);
      fulfill(user);
    });
  });
}
