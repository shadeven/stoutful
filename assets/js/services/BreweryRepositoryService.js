(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("breweryRepository", breweryRepository);

  function breweryRepository() {
    return {
      getBrewery: function($http, breweryId) {
        return $http.get('/api/breweries/' + breweryId);
      }
    };
  }

})();
