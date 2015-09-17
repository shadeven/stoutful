angular.module('stoutful.controllers', ['ui.bootstrap', 'ngFileUpload', 'oc.lazyLoad', 'ngCookies', 'stoutful.directives', 'ladda']).
  controller('NavBarController', function($scope, $modal, $http, session) {
    var auth2;
    gapi.load('auth2', function() {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '1068487601849-a0ep88imse3bn202daabmndcni4abhgl.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/plus.login email'
      });

      $http({ method: 'GET', url: '/api/users/me' })
        .then(function(response) {
          $scope.user = response.data;
          $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      if ($scope.user) {
        $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
      }
    });

    $scope.openLogin = function() {
      $modal.open({
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      });
    };

    $scope.logout = function() {
      $http({method: 'GET', url: '/logout'}).
        then(function() {
          return auth2.signOut();
        }).
        then(function() {
          $scope.user = undefined;
          $scope.userName = undefined;
        }).
        catch(function(err) {
          console.log('Error logging out: ', err);
        });
    };
  }).
  controller('SearchController', function($scope, $modal, $http) {
    $scope.searchQuery = { query: '' };
    $scope.beers = [];

    $scope.isValid = function() {
      return $scope.searchQuery.query.length > 0;
    };

    $scope.performSearch = function(event) {
      var value = event.target.value;
      $http.get('/api/beers/search?query=' + value)
        .then(function (data) {
          $scope.beers = data.data;
        })
        .catch(function (err) {
          console.log('Err = ', err);
        });
    };

    $scope.open = function (beer) {
      $modal.open({
        templateUrl: 'partials/edit-beer.html',
        controller: 'EditBeerCtrl',
        windowClass: 'beer-details',
        resolve: {
          beer: function() {
            return beer;
          }
        }
      });
    };
  }).
  controller('EditBeerCtrl', function ($scope, $modalInstance, $http, Upload, beer, session) {
    $scope.beer = beer;
    $scope.image = $scope.beer.image_url;
    $scope.selectedBrewery = beer.brewery;
    $scope.loading = false;
    $scope.isLoggedIn = session.user !== undefined;

    // Although Angular handles 2-way data binding for us, below is for recording which
    // attributes were changed so when it comes time to PUT, we only PUT the attributes
    // that were changed instead of all attributes.
    var watchAttributes = ['name', 'abv', 'ibu', 'description', 'brewery'];
    var changedAttributes = {};
    watchAttributes.forEach(function(attribute) {
      $scope.$watch(function() { return $scope.beer[attribute]; }, function(newValue, oldValue) {
        if (_.isEqual(newValue, oldValue) || !newValue) return; // Invalid states, ignore

        console.log(attribute + ' has been changed.');
        if (attribute === 'brewery') {
          changedAttributes.brewery_id = newValue.id;
        } else {
          changedAttributes[attribute] = newValue;
        }
      });
    });

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.save = function() {
      if (!$scope.editForm.$valid) return;

      var req = {
        url: '/api/beers/' + beer.id,
        method: 'PUT',
        fields: changedAttributes
      };

      if ($scope.image) {
        req.file = $scope.image;
      }

      $scope.loading = true;
      Upload.upload(req)
      .success(function() {
        $scope.loading = false;
        $modalInstance.close();
      })
      .error(function(err) {
        console.log('Err = ', err);
      });
    };

    $scope.searchBrewery = function(value) {
      return $http.get('/api/breweries/search?query=' + value)
        .then(function(response) {
          return response.data;
        });
    };

    // We use a custom onSelect function because the "model" ends up being the name
    // and not the actual model.
    $scope.onSelect = function($item) {
      $scope.beer.brewery = $item;
    };
  }).
  controller('LoginController', function($scope, $modalInstance, $http, $ocLazyLoad, $window, session) {
    var auth2 = gapi.auth2.getAuthInstance();

    $scope.signIn = function() {
      auth2.signIn().then($scope.onSuccess, $scope.onFailure);
    };

    $scope.onSuccess = function(googleUser) {
      var authResponse = googleUser.getAuthResponse();
      var accessToken = authResponse.access_token;

      var req = {
        method: 'POST',
        url: '/login/google'
      };

      if (accessToken) {
        req.data = {'access_token': accessToken};
      }

      $http(req)
        .then(function() {
          // Fetch user data
          return $http({ method: 'GET', url: '/api/users/me' });
        })
        .then(function(response) {
          session.user = response.data;
          $modalInstance.close();
        })
        .catch(function(err) {
          console.log('Error logging in: ', err);
          if (err.status == 401) {
            auth2.getAuthInstance().signOut()
              .then(function() {
                console.log('signed out.');
              });
          }
        });
    };

    $scope.onFailure = function(err) {
      console.log(err);
    };
  }).
  controller('ProfileController', function($scope, session) {
    $scope.user = session.user;
    console.log('user = ', session.user);
  });
