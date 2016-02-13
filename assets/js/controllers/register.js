angular.module('stoutful.controllers')
  .controller('RegisterController', function($scope, $http, basicAuth, session) {
    $scope.formHolder = {};
    $scope.register = function() {
      var data = {
        first_name: $scope.formHolder.firstName,
        last_name: $scope.formHolder.lastName,
        email: $scope.formHolder.email,
        password: $scope.formHolder.password
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
