var app = angular.module('stoutful', ['ngRoute', 'stoutful.controllers', 'stoutful.directives', 'stoutful.services']);

app.config(function ($controllerProvider, $httpProvider, $routeProvider) {
  /* Configure routes */

  $routeProvider.when('/', {
    templateUrl: 'partials/search.html',
    controller: 'SearchController'
  })
  .when('/profile', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  })
  .when('/beer/:beerId', {
    templateUrl: 'partials/beer-details.html',
    controller: 'BeerDetailsController'
  })
  .when('/brewery/:breweryId', {
    templateUrl: 'partials/brewery-details.html',
    controller: 'BreweryDetailsController'
  })
  .when('/patches', {
    templateUrl: 'partials/patch.html',
    controller: 'PatchController'
  });
});
