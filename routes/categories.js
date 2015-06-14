var router = require('express').Router();
var winston = require('winston');

var auth = require('../auth');
var database = require('../database');

/* GET category listing. */
router.get('/', auth, function(req, res) {
  var limit = req.query.limit || '10';
  database.select('*')
    .from('categories')
    .limit(limit)
    .then(function(rows) {
      res.status(200).json(rows);
    })
    .catch(function(err) {
      winston.error(err);
    });
});

module.exports = router;
