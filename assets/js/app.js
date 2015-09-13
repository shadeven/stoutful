var app = angular.module('stoutful', ['ngRoute', 'stoutful.controllers', 'stoutful.directives']);

app.config(function ($controllerProvider, $httpProvider, $routeProvider) {
  /* Configure routes */

  $routeProvider.when('/', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  }).
  when('/search', {
    templateUrl: 'partials/search.html',
    controller: 'SearchController'
  });
});
