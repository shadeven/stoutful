/* Home controller */

(function() {
  "use strict";

  angular.module("stoutful.controllers")
    .controller("HomeController", HomeController);

  function HomeController($http, rx, $location, $q) {
    var vm = this;

    vm.searchText = '';
    vm.popularPartial = "partials/most-popular.html";
    vm.suggestionPartial = "partials/suggestions.html";

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
  }
})();
