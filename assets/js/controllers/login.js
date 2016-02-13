angular
  .module('stoutful.controllers')
  .controller('LoginController', LoginController);

function LoginController($scope, $http, $location, session, basicAuth) {

  $scope.formHolder = {};
  $scope.login = logIn;
  $scope.dismissAlert = dismissAlert;
  $scope.dismissLogin = dismissLogin;

  ////////////////////////////////////////////////////////////////////////////

  function logIn() {
    $scope.loading = true; // Initiate loading animation
    basicAuth.login($scope.formHolder.email, $scope.formHolder.password)
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
        var message = 'Unexpected error occurred.';
        if (err.status === 401) {
          message = 'Email/password incorrect.';
        }

        $scope.error = {
          type: 'danger',
          msg: message
        };
      });
  }

  function dismissAlert() {
    $scope.error = null;
  }

  function dismissLogin() {
    $scope.vm.showLogin = false;
  }
}
