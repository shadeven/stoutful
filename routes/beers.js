var express = require('express');
var auth = require('../auth');
var database = require('../database');

var router = express.Router();

/* GET beer listing. */
router.get('/', auth, function(req, res) {
  var limit = req.query.limit || '10';
  database.select('*')
    .from('beers')
    .limit(limit)
    .then(function(rows) {
      res.status(200).json(rows);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
})

/* GET beer data */
router.get('/:id', auth, function(req, res) {
  var limit = req.query.limit || '10';
  database.select('*')
    .from('beers')
    .limit(limit)
    .where('id', req.params.id)
    .then(function(rows) {
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(204).end();
      }
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
})

/* Search route */
router.get('/search', auth, function(req, res) {
  res.status(200).end();
})

module.exports = router;
