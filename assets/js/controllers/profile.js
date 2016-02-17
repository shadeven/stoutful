(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("ProfileController", ProfileController);

  function ProfileController($scope, $http, session) {

    $scope.user = session.user;
    $scope.actionVerbForActivityType = actionVerbForActivityType;
    $scope.stats = {};

    loadUserActivities();
    loadUserStats();
    watchForSessionChange();

    ////////////////////////////////////////////////////////////////////////////

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
