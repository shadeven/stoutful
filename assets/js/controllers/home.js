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
  }
})();
