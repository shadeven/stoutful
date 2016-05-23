/* Suggestion controller */

(function() {
  "use strict";

  angular.module("stoutful.controllers")
    .controller("SuggestionController", SuggestionController);

  function SuggestionController($location, $http) {
    var vm = this;

    vm.suggestions = [];
    vm.emptyMessage = "Start checking into beers to get personalized suggestions.";
    vm.showBeerDetails = showBeerDetails;

    fetchSuggestions();

    function showBeerDetails(beer) {
      $location.url("/beer/" + beer.id);
    }

    function fetchSuggestions() {
      $http.get('/api/beers/suggestions')
        .then(function(response) {
          vm.suggestions = response.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
})();
