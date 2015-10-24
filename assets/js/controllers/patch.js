angular.module('stoutful.controllers')
  .controller('PatchController', function($scope, $http, patchCache, $location) {
    $scope.emptyTitle = 'Sorry!';
    $scope.emptyMessage = 'No patches available.';

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

    $scope.loading = true;
    $http.get('/api/patches')
      .then(function(results) {
        $scope.patches = results.data;
        $scope.loading = false;
      })
      .catch(function(err) {
        console.log('Error fetching patches: ', err);
        $scope.loading = false;
      });
  });
