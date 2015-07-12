var gulp = require('gulp');
var Rx = require('rx');
var Sails = require('sails');

gulp.task('elasticsearch:index', function(cb) {
  Sails.load(function (err, sails) {
    var Beer = sails.models.beer;
    var Brewery = sails.models.brewery;

    // Beers index
    var indexBeers = Rx.Observable.fromPromise(Beer.find())
      .flatMap(function(beers) {
        return Rx.Observable.from(beers);
      })
      .doOnNext(function(beer) {
        Beer.index({
          index: 'stoutful',
          type: 'beer',
          id: beer.id,
          body: {
            name: beer.name,
            description: beer.description
          }
        });
      });

    // Brewery index
    var indexBrewery = Rx.Observable.fromPromise(Brewery.find())
      .flatMap(function(breweries) {
        return Rx.Observable.from(breweries);
      })
      .doOnNext(function(brewery) {
        Brewery.index({
          index: 'stoutful',
          type: 'brewery',
          id: brewery.id,
          body: {
            name: brewery.name,
            description: brewery.description
          }
        });
      });

    Rx.Observable.forkJoin(indexBeers, indexBrewery)
      .subscribe(function () {
        cb();
      });
  });
});

gulp.on('stop', function() {
  process.nextTick(function() {
    process.exit(0);
  });
});
