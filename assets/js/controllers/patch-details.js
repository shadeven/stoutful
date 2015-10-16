angular.module('stoutful.controllers')
  .controller('PatchDetailsController', function($scope, $routeParams, patchCache, $http) {
    var patchId = $routeParams.patchId;
    $scope.patch = patchCache.findById(patchId);

    if (!$scope.patch) {
      $http.get('/api/patches/' + patchId)
        .then(function(response) {
          $scope.patch = response.data;
          loadPatchModel($scope.patch.model, $scope.patch.type);
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      loadPatchModel($scope.patch.model, $scope.patch.type);
    }

    function loadPatchModel(id, type) {
      var url = '/api';
      if (type === 'beer') {
        url += '/beers/' + id;
      }
      if (type === 'brewery') {
        url += '/breweries/' + id;
      }
      $http.get(url)
        .then(function(response) {
          $scope.original = response.data;
        })
        .catch(function(err) {
          console.log('Error loading model: ',err);
        });
    }
  });
