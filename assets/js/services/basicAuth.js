/* Basic auth service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("basicAuth", basicAuth);

  function basicAuth($http, $base64) {
    return {
      login: function(email, password) {
        var req = {
          method: "POST",
          url: "/login/basic",
          headers: {
            "Authorization": "Basic " + $base64.encode(email + ":" + password)
          }
        };

        return $http(req);
      }
    };
  }

})();
