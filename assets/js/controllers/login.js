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
  });
