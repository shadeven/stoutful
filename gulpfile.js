var gulp = require('gulp');
var gls = require('gulp-live-server');

var Beer = require('./models/beer');
var Brewery = require('./models/Brewery');

gulp.task('serve', function () {
  var server = gls.new('bin/www');
  server.start();

  gulp.watch(['routes/**/*.js', 'views/**/*.jade'], function () {
    server.stop();
    server.start();
  });
});

gulp.task('db:index', function () {
  var modelsToIndex = [Beer, Brewery];

  return Promise.all(modelsToIndex.map(function (Model) {
    return Model.collection()
      .fetch()
      .then(function(models) {
        models.forEach(function (model) {
          model.index();
        });
      });
  }));
});
