var Promise = require("bluebird");
var gulp = require("gulp");
var Sails = require("sails");
var wiredep = require("wiredep");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
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
    "!assets/js/directives/**",
    "!assets/js/controllers/**" /* Exclude assets/js/controllers/ */
  ];
  return gulp.src(input, { base: "assets" })
    .pipe(gulp.dest(paths.dest.public));
});

gulp.task("concatControllers", ["clean"], function() {
  var input = [
    "assets/js/controllers/index.js",
    "assets/js/controllers/!(index).js"
  ];
  return gulp.src(input)
    .pipe(concat("controllers.js"))
    .pipe(gulp.dest(paths.dest.js));
});

gulp.task("concatDirectives", ["clean"], function() {
  var input = [
    "assets/js/directives/index.js",
    "assets/js/directives/*.directive.js",
  ];
  return gulp.src(input)
    .pipe(concat("directives.js"))
    .pipe(gulp.dest(paths.dest.js));
});

gulp.task("sass", ["clean"], function () {
  return gulp.src(paths.src.sass)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task("bower:js", ["clean"], function() {
  return gulp.src(wiredep().js, { base: "bower_components" })
    .pipe(gulp.dest(paths.dest.vendor.js));
});

gulp.task("bower:css", ["clean"], function() {
  return gulp.src(wiredep().css, { base: "bower_components" })
    .pipe(gulp.dest(paths.dest.vendor.css));
});

gulp.task("bower:inject", ["clean"], function() {
  return gulp.src("assets/layout.ejs")
    .pipe(wiredep.stream({
      ignorePath: "../bower_components/",
      fileTypes: {
        html: {
          replace: {
            js: "<script src='vendor/js/{{filePath}}'></script>",
            css: "<link rel='stylesheet' href='vendor/css/{{filePath}}' />"
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

gulp.task("concat", ["concatControllers", "concatDirectives"]);
gulp.task("bower", ["bower:js", "bower:css", "bower:inject"]);
gulp.task("build", ["copy", "concat", "sass", "bower"]);
gulp.task("prod", ["build"]);
gulp.task("default", ["build", "watch"]);

gulp.task("elasticsearch:index", function(cb) {
  Sails.load({ hooks: { grunt: false, gulp: false } }, function (err, sails) {
    if (err) {
      return cb(err);
    }

    var Beer = sails.models.beer;
    var Brewery = sails.models.brewery;
    var ESBeer = sails.models.esbeer;
    var ESBrewery = sails.models.esbrewery;

    // Beers index
    var indexBeers = Beer.find()
      .then(function(beers) {
        if (!beers || beers.length === 0) return null;

        var body = [];

        beers.forEach(function(beer) {
          var action = { index: { _index: "stoutful", _type: "beer", _id: beer.id } };
          var document = { name: beer.name, description: beer.description };
          body.push(action);
          body.push(document);
        });

        return ESBeer.bulkIndex({ body: body });
      });

    // Brewery index
    var indexBreweries = Brewery.find()
      .then(function(breweries) {
        if (!breweries || breweries.length === 0) return null;

        var body = [];

        breweries.forEach(function(brewery) {
          var action = { index: { _index: "stoutful", _type: "brewery", _id: brewery.id } };
          var document = { name: brewery.name, description: brewery.description };
          body.push(action);
          body.push(document);
        });

        return ESBrewery.bulkIndex({ body: body });
      });

    Promise.all([indexBeers, indexBreweries])
      .then(function() {
        sails.lower(cb);
      })
      .catch(function(err) {
        cb(err);
      });
  });
});
