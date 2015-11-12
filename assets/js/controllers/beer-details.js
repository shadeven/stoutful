angular.module('stoutful.controllers').
  controller('BeerDetailsController', function($scope, $routeParams, $http, rx, $modal, session) {
    var beerId = $routeParams.beerId;
    $scope.showAlert = session.isLoggedIn();
    $scope.likeCounter = 0;
    $scope.checkInCounter = 0;
    $scope.placeholder = '/images/placeholder.jpg';

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

    $scope.editBeer = function() {
      $modal.open({
        templateUrl: 'partials/edit-beer.html',
        controller: 'EditBeerCtrl',
        windowClass: 'beer-details',
        resolve: {
          beer: function() {
            return $scope.beer;
          }
        }
      });
    };

    // Main

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      $scope.showAlert = session.isLoggedIn();
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
        _.each($scope.activities, updateCounters);
      })
      .catch(function(err) {
        console.log(err);
      });

    function updateCounters(activity) {
      if ('like' === activity.type) {
        $scope.likeCounter++;
      }

      if ('check_in' === activity.type) {
        $scope.checkInCounter++;
      }
    }

  });
