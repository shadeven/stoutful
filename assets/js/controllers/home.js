angular.module('stoutful.controllers').
  controller('HomeController', function($scope, $http, rx, $location) {
    $scope.searchQuery = { query: '' };

    $scope.$watch('searchQuery.query', function(newValue) {
      if (!newValue) return;
      $scope.performSearch(newValue);
    });

    $scope.isValid = function() {
      return $scope.searchQuery.query.length > 0;
    };

    $scope.performSearch = function(query) {
      var value = query;

      return Promise.all([$http.get('/api/beers/search?query=' + value),
        $http.get('/api/breweries/search?query=' + value)])
          .then(function(values) {
            var response1 = values[0].data;
            var response2 = values[1].data;
            return response1.concat(response2);
          });
    };

    $scope.onSelect = function (item) {
      if (item.brewery) {
        $location.url('/beer/' + item.id);
      } else {
        $location.url('/brewery/' + item.id);
      }
    };

    $scope.showBeerDetails = function(beer) {
      $location.url('/beer/' + beer.id);
    };

    $http.get('/api/beers/popular')
      .then(function(results) {
        $scope.popular = results.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
