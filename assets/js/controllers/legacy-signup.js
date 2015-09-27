angular.module('stoutful.controllers').
  controller('LegacySignupController', function($scope, $http, $window, session, basicAuth) {
    $scope.legacySignUp = function() {
      var data = {
        first_name: $scope.firstName,
        last_name: $scope.lastName,
        email: $scope.email,
        password: $scope.password
      };

      $scope.loading = true;
      $http.post('/api/users/create', data)
        .then(function() {
          return basicAuth.login($scope.email, $scope.password);
        })
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
          $scope.error = {
            type: 'danger',
            msg: 'Unexpected error occurred.'
          };
        });
    };
  });
