var router = require('express').Router();
var auth = require('../auth');

var Beer = require('../models/beer');

/* GET beer listing. */
router.get('/', auth, function(req, res) {
  var limit = req.query.limit || '10';

  Beer.collection().query('limit', limit)
    .fetch({ withRelated: ['brewery'] })
    .then(function(models) {
      res.status(200).json(models);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
});

/* GET beer data */
router.get(/^\/\d+$/, auth, function(req, res) {
  var id = req.path.substring(1); // Removes forward slash

  console.log('Querying for beer with id = ' + id);

  Beer.where({id: id})
    .fetch({ withRelated: ['brewery'] })
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
  res.status(200).end();
});

module.exports = router;
