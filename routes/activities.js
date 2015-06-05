var router = require('express').Router();
var Redis = require('ioredis');
var auth = require('../auth');
var Promise = require('promise');

var Activity = require('../models/activity');

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
    Activity.query(function(query) {
      query.innerJoin('third_party_ids', 'activities.user_id', 'third_party_ids.user_id')
        .where('third_party_ids.id', thirdPartyId)
        .limit(limit);
    })
    .fetchAll({ withRelated: ['beer'] })
    .then(function(model) {
      resolve(model);
    })
    .catch(function(err) {
      reject(err);
    });
  });
}

module.exports = router;
