angular.module('stoutful.controllers').
  controller('BeerDetailsController', function($scope, $routeParams, $http) {
    var beerId = $routeParams.beerId;

    $http.get('/api/beers/' + beerId)
      .then(function(beer) {
        $scope.beer = beer.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
