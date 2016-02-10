angular.module('stoutful.controllers').
  controller('SplashController', function($http, $location, session) {
    var vm = this;
    vm.loginPartial = 'partials/login.html';
    vm.registerPartial = 'partials/register.html';

    vm.showLoginPartial = function() {
      vm.showLogin = true;
    };

    vm.showRegisterPartial = function() {
      vm.showRegister = true;
    };

    vm.logInWithGoogle = function() {
      var auth2 = gapi.auth2.getAuthInstance();
      var onSuccess = function(googleUser) {
        var authResponse = googleUser.getAuthResponse();
        var accessToken = authResponse.access_token;

        var req = {
          method: 'POST',
          url: '/login/google'
        };

        if (accessToken) {
          req.data = { 'access_token': accessToken };
        }

        vm.loading = true;
        $http(req)
          .then(function() {
            return $http({ method: 'GET', url: '/api/users/me' });
          })
          .then(function(response) {
            vm.loading = false;
            session.setUser(response.data);
            $location.url('/profile');
          })
          .catch(function(err) {
            vm.loading = false;
            console.log('Error logging in: ', err);
            if (err.status == 401) {
              session.destroy();
              auth2.signOut()
                .then(function() {
                  console.log('signed out.');
                });
            }
          });
      };

      var onError = function(err) {
        console.log(err);
      };

      auth2.signIn().then(onSuccess, onError);
    };

    // Main

    gapi.load('auth2', function() {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      gapi.auth2.init({
        client_id: '1068487601849-a0ep88imse3bn202daabmndcni4abhgl.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/plus.login email'
      });

      $http({ method: 'GET', url: '/api/users/me' })
        .then(function(response) {
          session.setUser(response.data);
          $location.url('/home');
        })
        .catch(function(err) {
          if (err.status === 401) {
            session.destroy();
          }
        });
    });
  });
