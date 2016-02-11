angular.module('stoutful.controllers')
  .controller('RegisterController', function($scope, $http, basicAuth, session) {
    $scope.register = function() {
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
          session.setUser(response.data);
        })
        .catch(function() {
          $scope.loading = false;
          $scope.error = {
            type: 'danger',
            msg: 'Unexpected error occurred.'
          };
        });
    };

    $scope.dismiss = function() {
      $scope.vm.showRegister = false;
    };

    $scope.dismissAlert = function() {
      $scope.error = null;
    };
  });
