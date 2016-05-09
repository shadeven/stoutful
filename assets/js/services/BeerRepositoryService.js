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

      getLikeBeerActivity: function($http, beerId, userId) {
        var criteria = {
          params: {
            'beer': beerId,
            'user': userId,
            'type': 'like'
          }
        };

        return $http.get('/api/activities', criteria);
      }
    };
  }

})();
