/**
 * BeerController
 *
 * @description :: Server-side logic for managing beers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/* global Beer, Brewery, Style, Category */
var Rx = require('rx');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  findOne: function(req, res) {
    var id = req.params.id;

    if (isNaN(id)) {
      return res.badRequest({error: 'id is not a number'});
    }

    return Rx.Observable.fromPromise(Beer.findOne({id: id}))
      .flatMap(populate)
      .subscribe(function (beer) {
        res.json(beer);
      }, function (err) {
        res.serverError(err);
      });
  },
  suggestions: function(req, res) {
    res.json({ok: "ok"});
  },
  search: function(req, res) {
    var query = req.query.query;
    searchBeer(query)
      .flatMap(function (beers) {
        return Rx.Observable.from(beers);
      })
      .flatMap(populate)
      .toArray()
      .subscribe(function (beers) {
        res.json(beers);
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

      var values = actionUtil.parseValues(req);
      var id = req.params.id;
      Beer.update(id, values)
        .then(function(beers) {
          var beer = beers[0];
          if (!beer) return res.serverError('Could not find record after updating!');
          return Beer.updateIndex({
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
  }
};

function populate(beer) {
  var beerObservable = Rx.Observable.just(beer);
  return Rx.Observable.zip(beerObservable, getBrewery(beer.brewery_id), getStyle(beer.style_id), getCategory(beer.cat_id), function (beer, brewery, style, category) {
    beer.brewery = brewery;
    beer.style = style;
    beer.category = category;
    return beer;
  });
}

function searchBeer(query) {
  return Rx.Observable.fromPromise(Beer.search({
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
    return Rx.Observable.fromPromise(Beer.find(ids));
  });
}

function getBrewery(breweryId) {
  return Rx.Observable.fromPromise(Brewery.findOne({id: breweryId}));
}

function getStyle(styleId) {
  return Rx.Observable.fromPromise(Style.findOne({id: styleId}));
}

function getCategory(categoryId) {
  return Rx.Observable.fromPromise(Category.findOne({id: categoryId}));
}
