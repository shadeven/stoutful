angular.module('stoutful.controllers').
  controller('HomeController', function($scope, $http, rx, $location, $q, session) {
    $scope.searchQuery = { query: '' };

    $scope.$watch('searchQuery.query', function(newValue) {
      if (!newValue) return;
      $scope.performSearch(newValue);
    });

    $scope.isValid = function() {
      return $scope.searchQuery.query.length > 0;
    };

    $scope.performSearch = function(query) {
      var searchBeers = $http.get('/api/beers/search?query=' + query);
      var searchBrewery = $http.get('/api/breweries/search?query=' + query);
      return $q.all([searchBeers, searchBrewery])
          .then(function(results) {
            return results[0].data.concat(results[1].data);
          });
    };

    $scope.onSelect = function (item) {
      if (!item) return;
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

    $http.get('/api/beers/suggestions/' + session.user.id)
      .then(function(response) {
        $scope.suggestions = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
