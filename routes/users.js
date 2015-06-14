var router = require('express').Router();
var winston = require('winston');

var auth = require('../auth');
var User = require('../models/user');
var Activity = require('../models/activity');

/* POST /users */
router.post('/', auth, function (req, res) {
  winston.info('Not Implemented');
  res.status(501).end();
});

/* PUT /users */
router.put('/', auth, function (req, res) {
  winston.info('Not Implemented');
  res.status(501).end();
});

/* POST /users/activities */
router.post('/activities', auth, function (req, res) {
  winston.info('Not Implemented');
  res.status(501).end();
});

/* PUT /users/activities */
router.put('/activities', auth, function (req, res) {
  winston.info('Not Implemented');
  res.status(501).end();
});

/* GET /users/{id} */
router.get(/^\/(\d+)$/, auth, function(req, res) {
  // Extract user id from path.
  var regex = /^\/(\d+)$/;
  var id = regex.exec(req.path)[1];

  var limit = parseInt(req.query.limit) || 10;

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
      winston.error(err);
      res.status(500).end();
    });
});

/* GET /users/{id}/activities */
router.get(/^\/(\d+)\/activities$/, auth, function (req, res) {
  // Extract user id from path.
  var regex = /^\/(\d+)\/activities$/;
  var userId = regex.exec(req.path)[1];

  var page = parseInt(req.query.page) || 0;
  var limit = parseInt(req.query.limit) || 10;

  Activity.query({ limit: limit, offset: (page * limit), orderBy: 'id' })
    .where({ user_id: userId })
    .fetchAll({ withRelated: ['beer'] })
    .then(function (models) {
      res.status(200).json(models);
    })
    .catch(function (err) {
      wintson.error(err);
      res.status(500).end();
    });
});

module.exports = router;
