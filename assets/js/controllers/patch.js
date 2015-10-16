angular.module('stoutful.controllers')
  .controller('PatchController', function($scope, $http) {
    $scope.onPatchClicked = function(patch) {
      console.log('Patch clicked = ', patch);
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
