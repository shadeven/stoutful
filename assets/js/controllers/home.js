/* Home controller */

(function() {
  "use strict";

  angular.module("stoutful.controllers")
    .controller("HomeController", HomeController);

  function HomeController($http, rx, $location, $q) {
    var vm = this;

    vm.searchText = '';
    vm.suggestionsEmptyMessage = "Start checking into beers to get personalized suggestions.";
    vm.suggestions = [];
    vm.popularPartial = "partials/most-popular.html";

    vm.performSearch = function(query) {
      var searchBeers = $http.get('/api/beers/search?query=' + query);
      var searchBrewery = $http.get('/api/breweries/search?query=' + query);
      return $q.all([searchBeers, searchBrewery])
          .then(function(results) {
            return results[0].data.concat(results[1].data);
          });
    };

    vm.onSelect = function (item) {
      if (!item) return;
      if (item.brewery) {
        $location.url('/beer/' + item.id);
      } else {
        $location.url('/brewery/' + item.id);
      }
    };

    vm.showBeerDetails = function(beer) {
      $location.url('/beer/' + beer.id);
    };

    $http.get('/api/beers/suggestions')
      .then(function(response) {
        vm.suggestions = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
})();
