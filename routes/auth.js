var router = require('express').Router();
var rp = require('request-promise');
var Redis = require('ioredis');
var winston = require('winston');
var database = require('../database');
var Promise = require('promise');
var bookshelf = require('bookshelf')(database);

var UserIdentity = require('../models/userIdentity');
var User = require('../models/user');

router.post('/', function(req, res) {
  var accessToken = req.headers.authorization;

  var options = {
    url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
    qs: {
      access_token: accessToken
    }
  };

  // Verify
  rp(options)
    .then(function(body) {
      var info = JSON.parse(body);
      var socialId = info.user_id;
      var redis = new Redis();

      // Check for existing key
      redis.get(accessToken, function(err, result) {
        if (err) {
          res.status(500).end();
        } else {
          if (!result) {
            redis.set(accessToken, socialId);
            redis.expire(accessToken, info.expires_in);
          }

          checkForExistingUser(socialId)
            .then(function(user) {
              if (user) {
                res.status(200).json(user);
              } else {
                createUser(socialId, accessToken)
                  .then(function(model) {
                    res.status(201).json(model);
                  })
                  .catch(function(err) {
                    winston.error('Error creating user: ', err);
                    res.status(500).end();
                  });
              }
            })
            .catch(function(err) {
              winston.error('Error checking for existing user: ',err);
              res.status(500).end();
            });
        }
      });
    })
    .catch(function(err) {
      if (err.statusCode) {
        res.status(err.statusCode).end();
      } else {
        res.status(400).end();
      }
    });
});

function checkForExistingUser(socialId) {
  return new Promise(function(resolve, reject) {
    winston.info('Looking for user with social id = ' + socialId);

    UserIdentity.where({ provider_id: socialId })
      .fetch({ withRelated: 'user' })
      .then(function(model) {
        var user = null;
        if (model) {
          user = model.related('user');
        }
        resolve(user);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function createUser(socialId, accessToken) {
  return new Promise(function(resolve, reject) {
    var options =  {
      url: 'https://www.googleapis.com/oauth2/v1/userinfo',
      qs: {
        access_token: accessToken
      }
    };

    // Get user info
    rp(options)
      .then(function(body) {
        var info = JSON.parse(body);

        // Start a transaction
        bookshelf.transaction(function(t) {
          // Insert user
          return new User({
            display_name: info.name,
            first_name: info.given_name,
            last_name: info.family_name,
            gender: info.gender,
            photo: info.picture
          })
          .save(null, { transacting: t })
          .tap(function(user) {
            // Insert third party id
            return new UserIdentity({
              user_id: user.id,
              provider_id: socialId,
              provider: 'google'
            })
            .save(null, { transacting: t, method: 'insert' });
          });
        }).then(function(user) {
          resolve(user);
        }).catch(function(err) {
          reject(err);
        });
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

module.exports = router;
