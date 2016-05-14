angular.module('stoutful.controllers').
  controller('BeerDetailsController', function($scope, $routeParams, $http, rx, session, beerRepository, $mdDialog, $mdToast) {
    $scope.isLoggedIn = $scope.showAlert = session.isLoggedIn();
    $scope.likeCounter = 0;
    $scope.checkInCounter = 0;
    $scope.placeholder = '/images/placeholder.jpg';

    beerRepository.getBeer($http, $routeParams.beerId)
      .then(function(response) {
        $scope.beer = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    beerRepository.getBeerActivity($http, $routeParams.beerId)
      .then(function(response) {
        $scope.activities = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });

    $scope.disableLikeBtn = false;
    beerRepository.getUserBeerActivity($http, $routeParams.beerId, session.user.id, 'like')
      .then(function(response) {
        $scope.disableLikeBtn = response.data.length > 0;
      })
      .catch(function(err) {
        console.log(err);
      });

    beerRepository.getBeerStats($http, $routeParams.beerId)
      .then(function(response) {
        $scope.likeCounter = response.data.like_count;
        $scope.checkInCounter = response.data.check_in_count;
      })
      .catch(function(err) {
        console.log(err);
      });

    $scope.dismissToolbarAlert = function() {
      $scope.showAlert = false;
    };

    $scope.closeAlert = function() {
      $scope.showAlert = false;
    };

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
        controllerAs: "vm",
        openFrom: event.srcElement,
        locals: {
          beer: $scope.beer
        }
      });
    };

    $scope.onLikeClicked = function() {
      var toast = $mdToast.simple()
        .textContent("You liked this beer.")
        .action('Undo')
        .position('top right')
        .hideDelay('3000');
      $mdToast.show(toast)
        .then(function(response) {
          if (response == 'ok') {
            $mdToast.hide();
          } else {
            beerRepository.createBeerActivity($http, $routeParams.beerId, 'like')
              .then(function(response) {
                $scope.likeCounter += 1;
                $scope.disableLikeBtn = true;
                $scope.activities.unshift(response.data);
              })
              .catch(function(err) {
                console.log(err);
              });
          }
      });
    };

    $scope.onCheckInClicked = function() {
      var toast = $mdToast.simple()
        .textContent("You checked into this beer.")
        .action('Undo')
        .position('top right')
        .hideDelay('3000');

      $mdToast.show(toast)
        .then(function(response) {
          if (response == 'ok') {
            $mdToast.hide();
          } else {
            beerRepository.createBeerActivity($http, $routeParams.beerId, 'check_in')
              .then(function(response) {
                $scope.checkInCounter += 1;
                $scope.activities.unshift(response.data);
              })
              .catch(function(err) {
                console.log(err);
              });
          }
        });
    };

    // Watch for session user change (i.e. when user logs out)
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      $scope.isLoggedIn = $scope.showAlert = session.isLoggedIn();
    });
  });
