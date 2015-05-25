var express = require('express');
var rp = require('request-promise');
var Redis = require('ioredis');
var database = require('../database');
var Promise = require('promise');
var router = express.Router();

router.post('/', function(req, res, next) {
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
      var userId = info.user_id;
      var redis = new Redis();

      // Check for existing key
      redis.get(accessToken, function(err, result) {
        if (err) {
          res.status(500).end();
        } else {
          if (!result) {
            redis.set(accessToken, userId);
            redis.expire(accessToken, info.expires_in);
          }

          checkForExistingUser(userId)
            .then(function(user) {
              if (user) {
                res.status(200).json(user);
              } else {
                createUser(userId, accessToken)
                  .then(function(result) {
                    var newId = result[0];
                    database
                      .select('*')
                      .from('users')
                      .where({ id: newId })
                      .then(function(result) {
                        var user = result[0];
                        res.status(201).json(user);
                      })
                      .catch(function(err) {
                        res.status(500).end();
                      });
                  })
                  .catch(function(err) {
                    res.status(500).end();
                  });
              }
            })
            .catch(function(err) {
              console.log(err);
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

function checkForExistingUser(userId) {
  return new Promise(function(resolve, reject) {
    database
      .select('users.*')
      .from('users')
      .innerJoin('user_ids', 'users.id', 'user_ids.user_id')
      .where('third_party_id', userId)
      .then(function(rows) {
        if (rows.length > 0) {
          resolve(rows[0]);
        } else {
          resolve(null);
        }
      })
      .catch(function(err) {
        console.log(err);
        reject(err);
      });
  });
}

function createUser(thirdPartyId, accessToken) {
  return new Promise(function(resolve, reject) {
    var options =  {
      url: 'https://www.googleapis.com/oauth2/v1/userinfo',
      qs: {
        access_token: accessToken
      }
    };
    rp(options)
      .then(function(body) {
        var info = JSON.parse(body);
        database('users')
          .returning('id')
          .insert({
            first_name: info.given_name,
            last_name: info.family_name,
            gender: info.gender,
            photo: info.picture,
          })
          .then(function(result) {
            var id = result[0];
            database('user_ids')
              .returning('user_id')
              .insert({
                user_id: id,
                third_party_id: thirdPartyId,
                type: 'google'
              })
              .then(function(result) {
                resolve(result);
              })
              .catch(function(err) {
                reject(err);
              });
          })
          .catch(function(err) {
            reject(err);
          });
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

module.exports = router;
