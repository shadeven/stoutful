/**
 * BreweriesController
 *
 * @description :: Server-side logic for managing breweries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 /* global Brewery, Patch */
var Rx = require('rx');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  search: function(req, res) {
    var query = req.query.query;
    searchBrewery(query)
      .flatMap(function (breweries) {
        return Rx.Observable.from(breweries);
      })
      .toArray()
      .subscribe(function (breweries) {
        res.json(breweries);
      }, function (err) {
        res.serverError(err);
      });
  },
  update: function(req, res) {
    // Do we have a user?
    var user = req.user;
    if (!user) return res.unAuthorized();

    var file = req.file('file');
    var opt = {
      adapter: require('skipper-s3'),
      key: sails.config.aws.key,
      secret: sails.config.aws.secret,
      bucket: 'stoutful-dev'
    };
    file.upload(opt, function(err, uploadedFiles) {
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
            res.ok();
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
          return Brewery.updateIndex({
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
  return Rx.Observable.fromPromise(Brewery.search({
    index: 'stoutful',
    body: { query: { match: { name: query }}}
  }))
  .flatMap(function (result) {
    return Rx.Observable.from(result.hits.hits);
  })
  .map(function (hit) {
    return {id: parseInt(hit._id)};
  })
  .toArray()
  .switchMap(function (ids) {
    return Rx.Observable.fromPromise(Brewery.find(ids));
  });
}
