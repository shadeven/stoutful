(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("beerRepository", beerRepository);

  function beerRepository() {
    return {
      getBeer: function($http, beerId) {
        return $http.get('/api/beers/' + beerId);
      },

      getBeerActivity: function($http, beerId) {
        return $http.get('/api/activities', {'beer_id': beerId});
      },

      getUserBeerActivity: function($http, beerId, userId, type) {
        return $http.get('/api/activities', {'beer_id': beerId, 'user': userId, 'type': type});
      },

      getBeerStats: function($http, beerId) {
        return $http.get("/api/beers/" + beerId + "/stats");
      },

      createBeerActivity: function($http, beerId, type) {
        return $http.post("/api/users/activity", {"beer": beerId, "type": type});
      }
    };
  }

})();
