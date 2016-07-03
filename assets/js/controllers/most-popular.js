/* MostPopularController */

(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("MostPopularController", MostPopularController);

  function MostPopularController($location, $http) {
    var vm = this;

    vm.popular = [];
    vm.emptyMessage = "There doesn't seem to be any popular beers.";
    vm.showBeerDetails = showBeerDetails;

    fetchPopularBeers();

    function showBeerDetails(beer) {
      $location.url("/beer/" + beer.id);
    }

    function fetchPopularBeers() {
      $http.get("/api/beers/popular")
        .then(function(results) {
          vm.popular = results.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
})();
