angular.module('stoutful.controllers').
  controller('LegacyLoginController', function($scope, $http, $window, session, basicAuth) {
    $scope.legacySignIn = function() {
      if ($scope.legacyForm.$invalid) return;

      $scope.loading = true;
      basicAuth.login($scope.email, $scope.password)
        .then(function() {
          return $http.get('/api/users/me');
        })
        .then(function(response) {
          $scope.loading = false;
          session.user = response.data;
          $scope.modalInstance.close();
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
