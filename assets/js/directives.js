angular.module('stoutful.directives', []).
  directive('ngBackgroundImage', function() {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, elem, attr) {
        if (attr.ngModel) {
          scope.$watch(attr.ngModel, function(newValue) {
            elem.css('background-image', 'url(\'' + newValue + '\')');
          });
        }
        elem.css('background-image', 'url(\'' + attr.ngBackgroundImage + '\')');
        attr.$set('ngBackgroundImage', null);
      }
    };
  });
