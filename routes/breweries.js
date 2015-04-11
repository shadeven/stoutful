var express = require('express');
var knex = require('knex')({ client: 'pg', connection: process.env.DATABASE });
var router = express.Router();

/* GET brewery listing. */
router.get('/', function(req, res, next) {
  var limit = req.query.limit || '10';

  knex.select('*')
  .from('breweries')
  .limit(limit)
  .then(function(rows) {
    res.status(200).json(rows);
  })
  .catch(function(err) {
    console.log(err);
  });

});

module.exports = router;
