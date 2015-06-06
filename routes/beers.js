var router = require('express').Router();
var Redis = require('ioredis');
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
      console.log(err);
      res.status(500).end();
    });
});

/* GET beer data */
router.get(/^\/(\d+)$/, auth, function(req, res) {
  // Extract beer id from path.
  var regex = /^\/(\d+)$/;
  var id = regex.exec(req.path)[1];

  console.log('Querying for beer with id = ' + id);

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
      console.log(err);
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
      console.log('Error searching for beer: ', err);
      res.status(500).end();
    });
});

/* Suggestions */
router.get('/suggestions', auth, function(req, res) {
  var limit = req.query.limit || '10';

  var accessToken = req.headers.authorization;
  var redis = new Redis();
  redis.get(accessToken, function(err, thirdPartyId) {
    if (err) {
      res.status(500).end();
    } else {
      Beer.query(function (qb) {
        var styleSubquery = database('beers')
          .innerJoin('activities', 'beers.id', 'activities.beer_id')
          .innerJoin('third_party_ids', 'activities.user_id', 'third_party_ids.user_id')
          .where('third_party_ids.id', thirdPartyId)
          .andWhere('activities.type', 'like')
          .andWhere('beers.style_id', '!=', -1)
          .groupBy('beers.style_id')
          .select('beers.style_id');

        var beerSubquery = database('beers')
            .innerJoin('activities', 'beers.id', 'activities.beer_id')
            .innerJoin('third_party_ids', 'activities.user_id', 'third_party_ids.user_id')
            .where('third_party_ids.id', thirdPartyId)
            .select('beers.id');

        qb.where('style_id', 'IN', styleSubquery)
          .andWhere('id', 'NOT IN', beerSubquery)
          .limit(limit);
      }).fetchAll({ withRelated: ['brewery', 'style'] })
        .then(function (models) {
          res.status(200).json(models);
        })
        .catch(function (err) {
          console.log(err);
          res.status(500).end();
        });
    }
  });
});

module.exports = router;
