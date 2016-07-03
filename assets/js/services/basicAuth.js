/* Basic auth service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("basicAuth", basicAuth);

  function basicAuth($http) {
    return {
      login: function(email, password) {
        return $http.post("/login", {username: email, password: password});
      }
    };
  }

})();
