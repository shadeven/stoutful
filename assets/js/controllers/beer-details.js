angular.module('stoutful.controllers').
  controller('BeerDetailsController', function($scope, $routeParams, $http, rx, session, $mdDialog) {
    var beerId = $routeParams.beerId;
    $scope.isLoggedIn = $scope.showAlert = session.isLoggedIn();
    $scope.likeCounter = 0;
    $scope.checkInCounter = 0;
    $scope.disableLikeBtn = false;
    $scope.placeholder = '/images/placeholder.jpg';

    $scope.dismissToolbarAlert = function() {
      $scope.showAlert = false;
    }

    $scope.actionVerbForActivityType = function(type) {
      if (type === 'like') {
        return 'liked';
      }

      if (type === 'check_in') {
        return 'checked into';
      }

      return null;
    };

    $scope.formattedTimestamp = function(timestamp) {
      var date = moment(timestamp);
      var format;
      if (date.year() == moment().year()) {
        format = 'MMMM Do';
      } else {
        format = 'MMMM Do YYYY';
      }
      return date.format(format);
    };

    $scope.editBeer = function(event) {
      $mdDialog.show({
        templateUrl: "partials/edit-beer.html",
        controller: 'EditBeerCtrl',
        openFrom: event.srcElement,
        locals: {
          beer: $scope.beer
        }
      });
    };

    $scope.onLikeClicked = function() {
      createActivity('like');
    };

    $scope.onCheckInClicked = function() {
      createActivity('check_in');
    };

    $scope.closeAlert = function() {
      $scope.showAlert = false;
    };

    function createActivity(type) {
      var body = {"beer_id": $scope.beer.id, "type": type};
      $http.post("/api/users/activity", body)
        .then(function(response) {
          if (type == 'like') {
            $scope.likeCounter += 1;
            $scope.disableLikeBtn = true;
          } else if (type == 'check_in') {
            $scope.checkInCounter += 1;
          }
          $scope.activities.unshift(response.data);
        });
    }

    // Main

    // Watch for session user change (i.e. when user logs out)
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      $scope.isLoggedIn = $scope.showAlert = session.isLoggedIn();
    });

    // Fetch beer
    $http.get('/api/beers/' + beerId)
      .then(function(response) {
        $scope.beer = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    // Fetch beer activity
    var config = {
      params: {
        'beer_id': beerId
      }
    };

    $http.get('/api/activities', config)
      .then(function(response) {
        $scope.activities = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    // Fetch like acitivity by beer and user.
    var criteria = {
      params: {
        'beer_id': beerId,
        'user_id': session.user.id,
        'type': 'like'
      }
    };

    $http.get('/api/activities', criteria)
      .then(function(response) {
        $scope.disableLikeBtn = response.data.length > 0;
      })
      .catch(function(err) {
        console.log(err);
      });

    $http.get("/api/beers/" + $routeParams.beerId + "/stats")
      .then(function(response) {
        $scope.likeCounter = response.data.like_count;
        $scope.checkInCounter = response.data.check_in_count;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
