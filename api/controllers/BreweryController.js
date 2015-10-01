/**
 * BreweriesController
 *
 * @description :: Server-side logic for managing breweries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 /* global Brewery */
var Rx = require('rx');
var update = require('sails/lib/hooks/blueprints/actions/update');

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

      update(req, res);
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
