var gulp = require('gulp');
var Rx = require('rx');
var Sails = require('sails');
var mocha = require('gulp-mocha');

gulp.task('elasticsearch:index', function(cb) {
  Sails.load(function (err, sails) {
    var Beer = sails.models.beer;
    var Brewery = sails.models.brewery;

    // Beers index
    var indexBeers = Rx.Observable.fromPromise(Beer.find())
      .flatMap(function(beers) {
        return Rx.Observable.from(beers);
      })
      .flatMapLatest(function(beer) {
        var promise = Beer.index({
          index: 'stoutful',
          type: 'beer',
          id: beer.id,
          body: {
            name: beer.name,
            description: beer.description
          }
        });

        return Rx.Observable.fromPromise(promise);
      });

    // Brewery index
    var indexBrewery = Rx.Observable.fromPromise(Brewery.find())
      .flatMap(function(breweries) {
        return Rx.Observable.from(breweries);
      })
      .flatMapLatest(function(brewery) {
        var promise = Brewery.index({
          index: 'stoutful',
          type: 'brewery',
          id: brewery.id,
          body: {
            name: brewery.name,
            description: brewery.description
          }
        });

        return Rx.Observable.fromPromise(promise);
      });

    Rx.Observable.forkJoin(indexBeers, indexBrewery)
      .subscribe(function () {
        cb();
      });
  });
});

gulp.task('test', function () {
  return gulp.src(['./test/bootstrap.test.js', './test/**/*.test.js'])
    .pipe(mocha({reporter: 'spec'}))
    .once('error', function () {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.on('stop', function() {
  process.nextTick(function() {
    process.exit(0);
  });
});
