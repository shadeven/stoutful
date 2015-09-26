angular.module('stoutful.controllers').
  controller('LegacyLoginController', function($scope, $http, $window, session, $base64) {
    $scope.legacySignIn = function() {
      if ($scope.legacyForm.$invalid) return;

      var req = {
        method: 'POST',
        url: '/login/basic',
        headers: {
          'Authorization': 'Basic ' + $base64.encode($scope.email + ':' + $scope.password)
        }
      };

      $scope.loading = true;
      $http(req)
        .then(function(response) {
          $scope.loading = false;
          console.log(response);
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
