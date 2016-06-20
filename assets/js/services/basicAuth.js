/* Basic auth service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("basicAuth", basicAuth);

  function basicAuth($http) {
    return {
      login: function(email, password) {
        var body = {
          "grant_type": "password",
          "username": email,
          "password": password
        };

        return $http.post("/oauth/token", body);
      }
    };
  }

})();
