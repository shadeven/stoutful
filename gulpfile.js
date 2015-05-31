var gulp = require('gulp');

var Beer = require('./models/beer');
var Brewery = require('./models/Brewery');

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
