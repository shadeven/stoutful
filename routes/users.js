var router = require('express').Router();
var auth = require('../auth');

var User = require('../models/user');
var Activity = require('../models/activity');

/* POST /users */
router.post('/', function (req, res) {
  console.log('Not Implemented');
  res.status(501).end();
});

/* PUT /users */
router.put('/', function (req, res) {
  console.log('Not Implemented');
  res.status(501).end();
});

/* POST /users/activities */
router.post('/activities', function (req, res) {
  console.log('Not Implemented');
  res.status(501).end();
});

/* PUT /users/activities */
router.put('/activities', function (req, res) {
  console.log('Not Implemented');
  res.status(501).end();
});

/* GET /users/{id} */
router.get(/^\/(\d+)$/, auth, function(req, res) {
  // Extract user id from path.
  var regex = /^\/(\d+)$/;
  var id = regex.exec(req.path)[1];

  var limit = req.query.limit || '10';

  User.query({ limit: limit })
    .where({ id: id })
    .fetch()
    .then(function (model) {
      if (model) {
        res.status(200).json(model);
      } else {
        res.status(404).end();
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).end();
    });
});

/* GET /users/{id}/activities */
router.get(/^\/(\d+)\/activities$/, auth, function (req, res) {
  // Extract user id from path.
  var regex = /^\/(\d+)\/activities$/;
  var userId = regex.exec(req.path)[1];

  var limit = req.query.limit || '10';

  Activity.query({ limit: limit })
    .where({ user_id: userId })
    .fetchAll({ withRelated: ['beer'] })
    .then(function (models) {
      res.status(200).json(models);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).end();
    });
});

module.exports = router;
