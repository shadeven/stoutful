(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("beerRepositry", beerRepositry);

  function beerRepositry() {
    return {
      getBeer: function($http, beerId) {
        $http.get('/api/beers/' + beerId)
          .then(function(response) {
            return response.data;
          })
          .catch(function(err) {
            console.log(err);
          });
      },

      getBeerActivity: function($http, beerId) {
        var config = {
          params: {
            'beer_id': beerId
          }
        };

        $http.get('/api/activities', config)
          .then(function(response) {
            return response.data;
          })
          .catch(function(err) {
            console.log(err);
          });
      },

      getLikeBeerActivity: function($http, beerId, userId) {
        var criteria = {
          params: {
            'beer': beerId,
            'user': userId,
            'type': 'like'
          }
        };

        $http.get('/api/activities', criteria)
          .then(function(response) {
            return response.data;
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    };
  }

})();
