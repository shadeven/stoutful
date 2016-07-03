/* ProfileController */

(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("ProfileController", ProfileController);

  function ProfileController($scope, $http, session, toolbar, $mdMedia, $mdSidenav) {

    $scope.user = session.user;
    $scope.actionVerbForActivityType = actionVerbForActivityType;
    $scope.stats = {};
    $scope.sideNavShouldLockOpen = $mdMedia("gt-sm");

    toolbar.events.onIconClicked = function() {
      $mdSidenav("left").toggle();
    };

    loadUserActivities();
    loadUserStats();
    watchForSessionChange();
    watchForMediaQueryChange();

    ////////////////////////////////////////////////////////////////////////////

    function watchForMediaQueryChange() {
      var target = function() {
        return $mdMedia("gt-sm");
      };

      var listener = function(greaterThanMedium) {
        $scope.sideNavShouldLockOpen = greaterThanMedium;
        toolbar.icon = greaterThanMedium ? null : "menu";
      };
      $scope.$watch(target, listener);
    }

    function watchForSessionChange() {
      var target = function() {
        return session.user;
      };
      var listener = function() {
        $scope.user = session.user;
        if ($scope.user) {
          loadUserActivities();
        }
      };
      $scope.$watch(target, listener);
    }

    function actionVerbForActivityType(type) {
      if (type === "like") {
        return "Liked";
      }

      if (type === "check_in") {
        return "Checked into";
      }

      return null;
    }

    function loadUserStats() {
      if (!$scope.user) return;

      $http.get("/api/user/stats")
        .then(function(response) {
          $scope.stats = response.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function loadUserActivities() {
      if (!$scope.user) return;

      // Fetch user activities
      $http.get("/api/activities", { params: { "user_id": $scope.user.id } })
        .then(function(response) {
          $scope.activities = response.data;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
})();
