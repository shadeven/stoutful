var express = require('express');
var database = require('../database');
var router = express.Router();

/* GET brewery listing. */
router.get('/', function(req, res, next) {
  var limit = req.query.limit || '10';

  database.select('*')
  .from('styles')
  .limit(limit)
  .then(function(rows) {
    res.status(200).json(rows);
  })
  .catch(function(err) {
    console.log(err);
  });

});

module.exports = router;
