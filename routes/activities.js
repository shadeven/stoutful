var express = require('express');
var Redis = require('ioredis');
var auth = require('../auth');
var database = require('../database');
var Promise = require('promise');

var router = express.Router();

/* GET activity listing. */
router.get('/', auth, function(req, res) {
  var accessToken = req.headers.authorization;

  var redis = new Redis();
  redis.get(accessToken, function(err, result) {
    if (err) {
      res.status(500).end();
    } else {
      getActivities(req, result)
        .then(function(activities) {
          res.status(200).json(activities);
        })
        .catch(function(err) {
          console.log('Error querying activities: ', err);
          res.status(500).end();
        });
    }
  });
});

function getActivities(req, thirdPartyId) {
  return new Promise(function(resolve, reject) {
    // Handle request params
    var limit = req.query.limit || '10';

    // Query
    database
      .select('activities.*')
      .from('activities')
      .innerJoin('user_ids', 'activities.user_id', 'user_ids.user_id')
      .where('user_ids.third_party_id', thirdPartyId)
      .limit(limit)
      .then(function(rows) {
        resolve(rows);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

module.exports = router;
