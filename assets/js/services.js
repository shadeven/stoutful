angular.module('stoutful.services', ['ngCookies']).
  service('session', function($cookies) {
    var session = {
      setUser: function(user) {
        this.user = user;
        $cookies.putObject('user', user);
      },
      destroy: function() {
        this.user = undefined;
        $cookies.remove('user');
      },
      isLoggedIn: function() {
        return this.user !== undefined;
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
