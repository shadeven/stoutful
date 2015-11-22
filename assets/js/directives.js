angular.module('stoutful.directives', []).
  directive('ngBackgroundImage', function() {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, elem, attr) {
        if (attr.ngModel) {
          scope.$watch(attr.ngModel, function(newValue) {
            if (!newValue) return;
            elem.css('background-image', 'url(\'' + newValue + '\')');
          });
        }

        if (attr.ngBackgroundImage) {
          elem.css('background-image', 'url(\'' + attr.ngBackgroundImage + '\')');
          attr.$set('ngBackgroundImage', null);
        } 
      }
    };
  })
  .directive('empty', function() {
    return {
      restrict: 'E',
      scope: {
        title: '=',
        message: '='
      },
      templateUrl: 'partials/empty.html'
    };
  });
