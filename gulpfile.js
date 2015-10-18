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
        var body = [];

        beers.forEach(function(beer) {
          var action = {index: {_index: 'stoutful', _type: 'beer', _id: beer.id}};
          var document = {name: beer.name, description: beer.description};
          body.push(action);
          body.push(document);
        });

        var promise = Beer.bulkIndex({body: body});
        return Rx.Observable.fromPromise(promise);
      });

    // Brewery index
    var indexBrewery = Rx.Observable.fromPromise(Brewery.find())
      .flatMap(function(breweries) {
        var body = [];

        breweries.forEach(function(brewery) {
          var action = {index: {_index: 'stoutful', _type: 'brewery', _id: brewery.id}};
          var document = {name: brewery.name, description: brewery.description};
          body.push(action);
          body.push(document);
        });

        var promise = Brewery.bulkIndex({body: body});
        return Rx.Observable.fromPromise(promise);
      });

    Rx.Observable.forkJoin(indexBeers, indexBrewery)
      .subscribe(function () {
        cb();
      }, function(err) {
        cb(err);
      });
  });
});

gulp.task('test', function () {
  return gulp.src(['./test/bootstrap.test.js', './test/**/*.test.js'])
    .pipe(mocha({reporter: 'spec'}))
    .once('error', function (err) {
      console.error(err);
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
