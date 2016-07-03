angular.module('stoutful.controllers').
  controller('BreweryDetailsController', function($scope, $routeParams, $http, $mdDialog, rx, breweryRepository, session) {
    $scope.showAlert = session.isLoggedIn();
    $scope.placeholder = '/images/placeholder.jpg';
    breweryRepository.getBrewery($http, $routeParams.breweryId)
      .then(function(response) {
        $scope.brewery = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    $scope.dismissToolbarAlert = function() {
      $scope.showAlert = false;
    };

    $scope.editBrewery = function(event) {
      $mdDialog.show({
        templateUrl: "partials/edit-brewery.html",
        controller: "EditBreweryCtrl",
        controllerAs: "vm",
        openFrom: event.srcElement,
        locals: {
          brewery: $scope.brewery
        }
      });
    };

    $scope.closeAlert = function() {
      $scope.showAlert = false;
    };

    // Main

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      $scope.showAlert = session.isLoggedIn();
    });
  });
