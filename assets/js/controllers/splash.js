angular.module('stoutful.controllers').
  controller('SplashController', function($scope, $http, $location, session) {
    $scope.loginPartial = 'partials/login.html';
    $scope.showLoginPartial = function() {
      $scope.showLogin = true;
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
          session.user = response.data;
          $location.url('/profile');
        })
        .catch(function(err) {
          if (err.status === 401) {
            session.destroy();
          }
        });

      // auth2.isSignedIn.listen(function(signedIn) {
      //   if (signedIn) {
      //     $http({ method: 'GET', url: '/api/users/me' })
      //       .then(function(response) {
      //         session.user = response.data;
      //         $location.url('/profile');
      //       })
      //       .catch(function(err) {
      //         console.log(err);
      //       });
      //   }
      // });
    });
  });
