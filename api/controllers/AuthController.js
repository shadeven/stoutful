var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var CLIENT_ID = "$2a$08$y9XgmyXZvOS0ulJHz1ZH0eLcjegUwoKLc2sss0beebAD/wYtWF22O";
var CLIENT_SECRET = "$2a$10$WGKsiK58U11EdeMJWMmoHOZoScMQ7qvGJixNH6Z9cWEu62M3sD9N6";

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
              .then(generateRefreshToken)
              .then(saveRefreshToken)
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
    var AccessToken = this.sails.models.accesstoken;

    AccessToken.native(function(err, redis) {
      var key = 'waterline:accesstoken:id:' + accessToken.id;
      var expiresIn = 24 * (60*60); // 24 hours
      redis.expire([key, expiresIn], function(err, success) {
        if (err) reject(err);
        if (success) {
          accessToken.expires_in = expiresIn;
          delete accessToken.id; // Drop access token ID as it's not relevant to the client.
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
function saveAccessToken(payload) {
  return new Promise(function(fulfill, reject) {
    var AccessToken = this.sails.models.accesstoken;

    AccessToken.create({ user_id: payload.user.id, token: payload.token })
      .then(function(accessToken) {
        accessToken.refresh_token = payload.refresh_token;
        fulfill(accessToken);
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
    var refresh_token = jwt.sign({
      iss: 'stoutful',
      aud: CLIENT_ID,
      sub: payload.token },
      CLIENT_SECRET,
      {algorithm: 'HS512'});

    payload.refresh_token = refresh_token;
    fulfill(payload);
  });
}

/**
 * Generates an access token for the given user.
 */
function generateAccessToken(user) {
  return new Promise(function(fulfill) {
    var token = jwt.sign({ iss: 'stoutful', aud: CLIENT_ID, sub: user.id }, CLIENT_SECRET);
    fulfill({user: user, token: token});
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
