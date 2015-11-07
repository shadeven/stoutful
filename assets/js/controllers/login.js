angular.module('stoutful.controllers')
  .controller('LoginController', function($scope, $http, $location, session, basicAuth) {
    $scope.logIn = function() {
      if ($scope.loginForm.$invalid) return;

      $scope.loading = true; // Initiate loading animation
      basicAuth.login($scope.email, $scope.password)
        .then(function() {
          return $http.get('/api/users/me');
        })
        .then(function(response) {
          $scope.loading = false;
          session.setUser(response.data);
          $location.url('/profile');
        })
        .catch(function(err) {
          $scope.loading = false;
          var message = "Unexpected error occurred.";
          if (err.status === 401) {
            message = "Email/password incorrect.";
          }
          $scope.error = {
            type: 'danger',
            msg: message
          };
        });
    };

    $scope.logInWithGoogle = function() {
      var onSuccess = function(googleUser) {
        var authResponse = googleUser.getAuthResponse();
        var accessToken = authResponse.access_token;

        var req = {
          method: 'POST',
          url: '/login/google'
        };

        if (accessToken) {
          req.data = {'access_token': accessToken};
        }

        $scope.loading = true;
        $http(req)
          .then(function() {
            return $http({ method: 'GET', url: '/api/users/me' });
          })
          .then(function(response) {
            $scope.loading = false;
            session.setUser(response.data);
            $location.url('/profile');
          })
          .catch(function(err) {
            $scope.loading = false;
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

    var auth2 = gapi.auth2.getAuthInstance();
  });
