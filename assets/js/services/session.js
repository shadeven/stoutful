/* Session service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("session", session);

  function session($cookies) {
    var session = {
      setUser: function(user) {
        this.user = user;
        $cookies.putObject("user", user);
      },
      destroy: function() {
        this.user = undefined;
        $cookies.remove("user");
      },
      isLoggedIn: function() {
        return this.user !== undefined;
      }
    };
    session.user = $cookies.getObject("user");
    return session;
  }

})();
