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

      $http(req)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(err) {
          console.log(err);
        });
    };
  });
