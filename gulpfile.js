var gulp = require('gulp');
var runSequence = require('run-sequence');
var Rx = require('rx');
var Sails = require('sails');
var mocha = require('gulp-mocha');
var migration = require('sails-migrations');

gulp.task('db:create', function () {
  return migration.createDatabase();
});

gulp.task('db:migrate', function () {
  return migration.migrate();
});

gulp.task('db:drop', function () {
  return migration.dropDatabase();
});

gulp.task('db:test:create', function () {
  process.env.NODE_ENV = 'test';
  return migration.createDatabase();
});

gulp.task('db:test:migrate', function () {
  process.env.NODE_ENV = 'test';
  return migration.migrate();
});

gulp.task('db:test:drop', function () {
  process.env.NODE_ENV = 'test';
  return migration.dropDatabase();
});

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

gulp.task('mocha', function () {
  return gulp.src(['./test/bootstrap.test.js', './test/**/*.test.js'])
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function () {
      process.exit(1);
    })
    .on('end', function () {
      process.exit();
    });
});

gulp.task('pre-test', function (cb) {
  runSequence('db:test:drop', 'db:test:create', 'db:test:migrate', cb);
});

gulp.task('test', function (cb) {
  runSequence('pre-test', 'mocha', cb);
});

gulp.on('stop', function() {
  process.nextTick(function() {
    process.exit(0);
  });
});
