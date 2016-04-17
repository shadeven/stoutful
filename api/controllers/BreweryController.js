/**
 * BreweriesController
 *
 * @description :: Server-side logic for managing breweries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 /* global Brewery, ESBrewery, Patch */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  search: function(req, res) {
    var query = req.query.query;
    searchBrewery(query)
      .then(function(breweries) {
        res.json(breweries);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  },
  update: function(req, res) {
    // Do we have a user?
    var user = req.user;
    if (!user) return res.unAuthorized();

    var file = req.file('file');
    file.upload(sails.config.skipper, function(err, uploadedFiles) {
      if (err) {
        console.log('Error uploading files: ', err);
      } else {
        if (uploadedFiles.length > 0) {
          req.params.all().image_url = uploadedFiles[0].extra.Location;
        }
      }

      var values = actionUtil.parseValues(req);
      var id = req.params.id;

      // If user is an editor, we save changes to the "staging" db for review
      if (user.isEditor()) {
        Patch.create({editor: user.id, model: id, type: 'brewery', changes: values})
          .then(function() {
            res.notModified();
          })
          .catch(function(err) {
            console.log('Error saving brewery patch: ', err);
            res.serverError(err);
          });
        return;
      }

      Brewery.update(id, values)
        .then(function(breweries) {
          var brewery = breweries[0];
          if (!brewery) return res.serverError('Could not find record after updating!');
          return ESBrewery.updateIndex({
            index: 'stoutful',
            type: 'brewery',
            id: id,
            body: {
              doc: {
                name: brewery.name,
                description: brewery.description
              }
            }
          });
        })
        .then(function(response) {
          var id = response._id;
          return Brewery.findOne(id);
        })
        .then(function(brewery) {
          if (!brewery) return res.serverError('Could not find record after updating!');
          res.ok(brewery);
        })
        .catch(function(err) {
          res.serverError(err);
        });
    });
  }
};

function searchBrewery(query) {
  var esQuery = {
    index: 'stoutful',
    body: { query: { match: { name: query }}}
  };
  return ESBrewery.search(esQuery)
    .then(function(results) {
      return results.hits.hits.map(function(hit) {
        return {id: parseInt(hit._id)};
      });
    })
    .then(function(ids) {
      return Brewery.find(ids);
    });
}
