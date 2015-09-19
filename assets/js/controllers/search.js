angular.module('stoutful.controllers').
  controller('SearchController', function($scope, $modal, $http) {
    $scope.searchQuery = { query: '' };
    $scope.beers = [];

    $scope.isValid = function() {
      return $scope.searchQuery.query.length > 0;
    };

    $scope.performSearch = function(event) {
      var value = event.target.value;
      $http.get('/api/beers/search?query=' + value)
        .then(function (data) {
          $scope.beers = data.data;
        })
        .catch(function (err) {
          console.log('Err = ', err);
        });
    };

    $scope.open = function (beer) {
      $modal.open({
        templateUrl: 'partials/edit-beer.html',
        controller: 'EditBeerCtrl',
        windowClass: 'beer-details',
        resolve: {
          beer: function() {
            return beer;
          }
        }
      });
    };
  });
