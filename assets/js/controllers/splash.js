/* SplashController */

(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("SplashController", SplashController);

  function SplashController($http, $location, session, basicAuth) {
    var vm = this;

    vm.loading = false;
    vm.error = null;
    vm.loginPartial = "partials/login.html";
    vm.registerPartial = "partials/register.html";
    vm.showLoginView = showLoginView;
    vm.showRegisterView = showRegisterView;
    vm.logInWithGoogle = logInWithGoogle;
    vm.login = login;
    vm.register = register;
    vm.onGoogleSigninSuccess = onGoogleSigninSuccess;
    vm.onGoogleSigninFail = onGoogleSigninFail;

    $http({ method: "GET", url: "/api/users/me" })
      .then(function(response) {
        session.setUser(response.data);
        $location.url("/home");
      })
      .catch(function(err) {
        if (err.status === 401) {
          session.destroy();
        }
      });

    ////////////////////////////////////////////////////////////////////////////

    function showLoginView() {
      vm.showLogin = true;
    }

    function showRegisterView() {
      vm.showRegister = true;
    }

    function logInWithGoogle() {
    }

    function login(user) {
      vm.loading = true; // Initiate loading animation
      basicAuth.login(user.email, user.password)
        .then(function() {
          return $http.get("/api/users/me");
        })
        .then(function(response) {
          vm.loading = false;
          session.setUser(response.data);
          $location.url("/home");
        })
        .catch(function(err) {
          vm.loading = false;
          var message = "Unexpected error occurred.";
          if (err.status === 401) {
            message = "Email/password incorrect.";
          }

          vm.error = {
            type: "danger",
            msg: message
          };
        });
    }

    function onGoogleSigninSuccess(user) {
      var authResponse = user.getAuthResponse();
      var accessToken = authResponse.access_token;

      var req = {
        method: "POST",
        url: "/login/google"
      };

      if (accessToken) {
        req.data = { "access_token": accessToken };
      }

      vm.loading = true;
      $http(req)
        .then(function() {
          return $http({ method: "GET", url: "/api/users/me" });
        })
        .then(function(response) {
          vm.loading = false;
          session.setUser(response.data);
          $location.url("/home");
        })
        .catch(function(err) {
          vm.loading = false;
          console.log("Error logging in: ", err);
          if (err.status == 401) {
            session.destroy();
            auth2.signOut()
              .then(function() {
                console.log("signed out.");
              });
          }
        });
    }

    function onGoogleSigninFail(error) {
      console.log(error);
    }

    function register(form) {
      vm.loading = true;
      $http.post("/api/users/create", form)
        .then(function() {
          return basicAuth.login(form.email, form.password);
        })
        .then(function() {
          return $http.get("/api/users/me");
        })
        .then(function(response) {
          vm.loading = false;
          session.setUser(response.data);
        })
        .catch(function() {
          vm.loading = false;
          vm.error = {
            type: "danger",
            msg: "Unexpected error occurred."
          };
        });
    }
  }
})();
