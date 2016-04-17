/**
 * BeerController
 *
 * @description :: Server-side logic for managing beers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* global Beer, ESBeer, Patch, Activity */
var path = require("path");
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var Promise = require('bluebird');

module.exports = {
  findOne: function(req, res) {
    var id = req.params.id;

    if (isNaN(id)) {
      return res.badRequest({error: 'id is not a number'});
    }

    Beer.findOne({id: id})
      .populateAll()
      .then(function(beers) {
        res.ok(beers);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  },

  suggestions: function(req, res) {
    var userId = req.params.id;
    var beerQuery = Promise.promisify(Beer.query);
    beerQuery("SELECT * FROM beers WHERE style_id IN " +
    "(SELECT styles.id FROM activities " +
    "INNER JOIN beers on beers.id = activities.beer_id " +
    "INNER JOIN styles on beers.style_id = styles.id " +
    "WHERE activities.type = 'like' AND activities.user_id = " + userId + ") " +
    "AND beers.id NOT IN (SELECT beers.id FROM activities " +
    "INNER JOIN beers ON beers.id = activities.beer_id " +
    "WHERE activities.type = 'like' AND activities.user_id = " + userId + ") " +
    "ORDER BY name LIMIT 10")
    .then(function(results) {
      res.ok(results.rows);
    })
    .catch(function(err) {
      res.serverError(err);
    });
  },

  search: function(req, res) {
    var query = req.query.query;
    ESBeer.search({
      index: 'stoutful',
      body: { query: { match: { name: query }}}
    })
    .then(function(results) {
      var ids = results.hits.hits.map(function(hit) {
        return {id: parseInt(hit._id)};
      });
      return Beer.find(ids).populateAll();
    })
    .then(function(beers) {
      res.ok(beers);
    })
    .catch(function(err) {
      res.serverError(err);
    });
  },

  update: function(req, res) {
    // Do we have a user?
    var user = req.user;
    if (!user) return res.unAuthorized();

    // Upload incoming image, if there is one
    var file = req.file('file');
    file.upload(sails.config.skipper, function(err, uploadedFiles) {
      if (err) {
        console.log('Error uploading files: ', err);
      } else {
        if (uploadedFiles.length > 0) {
          var file = uploadedFiles[0];
          if (file.fd) {
            req.params.all().image_url = path.relative("/app/dist", file.fd);
          }
          if (file.extra && file.extra.Location) {
            req.params.all().image_url = file.extra.Location;
          }
        } else {
          delete req.params.all().file;
        }
      }

      // Parse out values
      var values = actionUtil.parseValues(req);
      var id = req.params.id;

      // If user is an editor, we save changes to patches
      if (user.isEditor()) {
        Patch.create({editor: user.id, model: id, type: 'beer', changes: values})
          .then(function() {
            res.notModified();
          })
          .catch(function(err) {
            console.log('Error saving beer patch: ', err);
            res.serverError(err);
          });
        return;
      }

      // Update directly to the database
      Beer.update(id, values)
        .then(function(beers) {
          var beer = beers[0];
          if (!beer) return res.serverError('Could not find record after updating!');
          return ESBeer.updateIndex({
            index: 'stoutful',
            type: 'beer',
            id: id,
            body: {
              doc: {
                name: beer.name,
                description: beer.description
              }
            }
          });
        })
        .then(function(response) {
          var id = response._id;
          return Beer.findOne(id);
        })
        .then(function(beer) {
          if (!beer) return res.serverError('Could not find record after updating!');
          res.ok(beer);
        })
        .catch(function(err) {
          res.serverError(err);
        });
    });
  },

  popular: function(req, res) {
    var activityQuery = Promise.promisify(Activity.query);
    activityQuery("SELECT beer_id, count(beer_id) FROM activities WHERE type = 'like' GROUP BY beer_id ORDER BY count DESC LIMIT 10")
      .then(function(results) {
        var query = results.rows.map(function(result) {
          return {id: result.beer_id};
        });
        return Beer.find(query).populateAll();
      })
      .then(function(beers) {
        res.ok(beers);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  },

  stats: function(req, res) {
    var id = req.params.id;
    var likes = Activity.count().where({beer: id, type: "like"});
    var checkIns = Activity.count().where({beer: id, type: "check_in"});
    Promise.all([likes, checkIns])
      .spread(function(likeCount, checkInCount) {
        res.ok({"like_count": likeCount, "check_in_count": checkInCount});
      })
      .catch(function(err) {
        res.serverError(err);
      });
  }
};
