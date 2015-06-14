var router = require('express').Router();
var Redis = require('ioredis');
var winston = require('winston');
var database = require('../database');
var auth = require('../auth');

var Beer = require('../models/beer');

/* GET beer listing. */
router.get('/', auth, function(req, res) {
  var limit = req.query.limit || '10';

  Beer.collection().query('limit', limit)
    .fetch({ withRelated: ['brewery', 'style'] })
    .then(function(models) {
      res.status(200).json(models);
    })
    .catch(function(err) {
      winston.error('Querying beers: ' + err.message);
      res.status(500).end();
    });
});

/* GET beer data */
router.get(/^\/(\d+)$/, auth, function(req, res) {
  // Extract beer id from path.
  var regex = /^\/(\d+)$/;
  var id = regex.exec(req.path)[1];

  winston.info('Querying for beer with id = ' + id);

  Beer.where({id: id})
    .fetch({ withRelated: ['brewery', 'style'] })
    .then(function(model) {
      if (model) {
        res.status(200).json(model);
      } else {
        res.status(404).end();
      }
    })
    .catch(function(err) {
      winston.error(err);
      res.status(500).end();
    });
});

/* Search route */
router.get('/search', auth, function(req, res) {
  var limit = req.query.limit || '10';

  Beer.search(req.query.query)
    .then(function (ids) {
      return Beer
        .query(function (qb) {
          qb.whereIn('id', ids).limit(limit);
        })
        .fetchAll({ withRelated: ['brewery', 'style'] });
    })
    .then(function(models) {
      res.status(200).json(models);
    })
    .catch(function (err) {
      winston.error('Error searching for beer: ', err);
      res.status(500).end();
    });
});

/* Suggestions */
router.get('/suggestions', auth, function(req, res) {
  var limit = req.query.limit || '10';

  var accessToken = req.headers.authorization;
  var redis = new Redis();
  redis.get(accessToken, function(err, socialId) {
    if (err) {
      res.status(500).end();
    } else {
      Beer.query(function (qb) {
        var styleSubquery = database('beers')
          .innerJoin('activities', 'beers.id', 'activities.beer_id')
          .innerJoin('user_identities', 'activities.user_id', 'user_identities.user_id')
          .where('user_identities.provider_id', socialId)
          .andWhere('activities.type', 'like')
          .andWhere('beers.style_id', '!=', -1)
          .groupBy('beers.style_id')
          .select('beers.style_id');

        var beerSubquery = database('beers')
            .innerJoin('activities', 'beers.id', 'activities.beer_id')
            .innerJoin('user_identities', 'activities.user_id', 'user_identities.user_id')
            .where('user_identities.provider_id', socialId)
            .select('beers.id');

        qb.where('style_id', 'IN', styleSubquery)
          .andWhere('id', 'NOT IN', beerSubquery)
          .limit(limit);
      }).fetchAll({ withRelated: ['brewery', 'style'] })
        .then(function (models) {
          res.status(200).json(models);
        })
        .catch(function (err) {
          winston.error(err);
          res.status(500).end();
        });
    }
  });
});

module.exports = router;
