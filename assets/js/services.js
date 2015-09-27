angular.module('stoutful.services', []).
  service('session', function() {
    var session;
    return session;
  }).
  service('basicAuth', function($http, $base64) {
    return {
      login: function(email, password) {
        var req = {
          method: 'POST',
          url: '/login/basic',
          headers: {
            'Authorization': 'Basic ' + $base64.encode(email + ':' + password)
          }
        };

        return $http(req);
      }
    };
  });
