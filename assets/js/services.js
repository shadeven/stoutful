angular.module('stoutful.services', ['ngCookies']).
  service('session', function($cookies) {
    var session = {
      user: undefined,
      destroy: function() {
        this.user = undefined;
        this.setExpiresAt(0);
      },
      setExpiresAt: function(expiresAt) {
        $cookies.put('expires_at', expiresAt);
      },
      isExpired: function() {
        var expiresAt = $cookies.get('expires_at');
        return !expiresAt || (expiresAt - moment().valueOf()) <= 0;
      },
      isLoggedIn: function() {
        return !this.isExpired();
      }
    };
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
  })
  .service('patchCache', function() {
    var patches = [];
    return {
      push: function(patch) {
        var existing = _.find(patches, function(item) { return item.id == patch.id;});
        if (!existing) {
          patches.push(patch);
        }
      },
      pop: function() {
        return patches.pop();
      },
      findById: function(id) {
        return _.find(patches, function(item) {
          return item.id == id;
        });
      }
    };
  });
