angular.module('stoutful.controllers').
  controller('HomeController', function($scope, $http, rx, $location, $q, beerRepository) {
    beerRepository.getPopularBeer($http)
      .then(function(response) {
        $scope.popular = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    beerRepository.getSuggestedBeer($http)
      .then(function(response) {
        $scope.suggestions = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    var vm = this;
    vm.searchText = '';
    vm.popularPartial = "partials/most-popular.html";
    vm.suggestionPartial = "partials/suggestions.html";

    vm.performSearch = function(query) {
      return $http.get("/api/search", {
        params: {
          type: "beer,brewery",
          query: query
        }
      })
      .then(function(results) {
        return results.data;
      });
    };

    vm.onSelect = function (item) {
      if (!item) return;

      if (item.type == "beer") {
        $location.url('/beer/' + item.id);
      }

      if (item.type == "brewery") {
        $location.url('/brewery/' + item.id);
      }
    };

    $scope.showBeerDetails = function(beer) {
      $location.url('/beer/' + beer.id);
    };
  });
