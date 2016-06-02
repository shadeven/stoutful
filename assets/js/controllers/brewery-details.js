/* BreweryDetailsController */

(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("BreweryDetailsController", BreweryDetailsController);

  function BreweryDetailsController($scope, $routeParams, $http, rx, $mdDialog, session) {
    var breweryId = $routeParams.breweryId;
    $scope.showAlert = session.isLoggedIn();
    $scope.placeholder = "/images/placeholder.jpg";

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

    // Fetch brewery
    $http.get("/api/breweries/" + breweryId)
      .then(function(response) {
        $scope.brewery = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
})();
