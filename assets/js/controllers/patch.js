angular.module('stoutful.controllers')
  .controller('PatchController', function($scope, $http) {
    $http.get('/api/patches')
      .then(function(results) {
        $scope.patches = results.data;
      })
      .catch(function(err) {
        console.log('Error fetching patches: ', err);
      });
  });
