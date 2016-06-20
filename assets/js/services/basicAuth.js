/* Basic auth service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("basicAuth", basicAuth);

  function basicAuth($http, $base64) {
    return {
      login: function(email, password) {
        var config = {
          headers: {
            "Authorization": $base64.encode(email + ":" + password)
          }
        };
        return $http.post("/login", null, config);
      }
    };
  }

})();
