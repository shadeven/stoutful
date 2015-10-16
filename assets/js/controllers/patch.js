angular.module('stoutful.controllers')
  .controller('PatchController', function($scope, $http, patchCache, $location) {
    $scope.onPatchClicked = function(patch) {
      patchCache.push(patch);
      $location.url('/patches/' + patch.id);
    };

    $scope.formattedTimestamp = function(timestamp) {
      var date = moment(timestamp);
      var format;
      if (date.year() == moment().year()) {
        format = 'MMMM Do';
      } else {
        format = 'MMMM Do YYYY';
      }
      return date.format(format);
    };

    $http.get('/api/patches')
      .then(function(results) {
        $scope.patches = results.data;
      })
      .catch(function(err) {
        console.log('Error fetching patches: ', err);
      });
  });
