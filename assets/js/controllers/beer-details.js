angular.module('stoutful.controllers').
  controller('BeerDetailsController', function($scope, $routeParams, $http, rx) {
    var beerId = $routeParams.beerId;

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
    rx.Observable.fromPromise($http.get('/api/activities', config))
      .flatMap(function(response) {
        return rx.Observable.from(response.data)
          .flatMap(function(activity) {
            var userId = activity.user_id;
            return populateUser(userId, activity);
          });
      })
      .toArray()
      .subscribe(function(activities) {
        $scope.activities = activities;
      });

    function populateUser(userId, activity) {
      var getUser = rx.Observable.fromPromise($http.get('/api/users/' + userId));
      return rx.Observable.zip(rx.Observable.just(activity), getUser, function(activity, user) {
        activity.user = user.data;
        return activity;
      });
    }
  });
