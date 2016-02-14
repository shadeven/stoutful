var gulp = require('gulp');
var Rx = require('rx');
var Sails = require('sails');
var mocha = require('gulp-mocha');
var wiredep = require('wiredep');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var del = require("del");

var paths = {
  src: {
    fonts: "assets/styles/fonts/**",
    images: "assets/images/**",
    partials: "assets/partials/**",
    js: "assets/js/**/*.js",
    sass: "assets/styles/**/*.scss"
  },
  dest: {
    public: "dist",
    js: "dist/js",
    css: "dist/styles",
    views: "views",
    vendor: {
      js: "dist/vendor/js",
      css: "dist/vendor/css"
    }
  }
};

gulp.task("copy", ["clean"], function() {
  var input = [
    paths.src.fonts,
    paths.src.images,
    paths.src.partials,
    paths.src.js,
    "!assets/js/controllers/**" /* Exclude assets/js/controllers/ */
  ];
  return gulp.src(input, {base: "assets"})
    .pipe(gulp.dest(paths.dest.public));
});

gulp.task("concat", ["clean"], function() {
  var input = [
    "assets/js/controllers/index.js",
    "assets/js/controllers/!(index).js"
  ];
  return gulp.src(input)
    .pipe(concat("controllers.js"))
    .pipe(gulp.dest(paths.dest.js));
});

gulp.task('sass', ["clean"], function () {
  return gulp.src(paths.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task("bower:js", ["clean"], function() {
  return gulp.src(wiredep().js, {base: "bower_components"})
    .pipe(gulp.dest(paths.dest.vendor.js));
});

gulp.task("bower:css", ["clean"], function() {
  return gulp.src(wiredep().css, {base: "bower_components"})
    .pipe(gulp.dest(paths.dest.vendor.css));
});

gulp.task("bower:inject", ["clean"], function() {
  return gulp.src("assets/layout.ejs")
    .pipe(wiredep.stream({
      ignorePath: "../bower_components/",
      fileTypes: {
        html: {
          replace: {
            js: '<script src="vendor/js/{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="vendor/css/{{filePath}}" />'
          }
        }
      }
    }))
    .pipe(gulp.dest(paths.dest.views));
});

gulp.task("clean", function() {
  return del(["dist"]);
});

gulp.task("watch", function() {
  var watchlist = [
    "assets/**/*.js",
    "assets/**/*.html",
    "assets/**/*.ejs",
    "assets/**/*.scss"
  ];
  gulp.watch(watchlist, ["build"]);
});

gulp.task("bower", ["bower:js", "bower:css", "bower:inject"]);
gulp.task("build", ["copy", "concat", "sass", "bower"]);
gulp.task("default", ["build", "watch"]);

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
