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
      res.status(500).end();
      console.log(err);
    });
});

module.exports = router;
