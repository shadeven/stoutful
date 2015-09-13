angular.module('stoutful.directives', []).
  directive('ngBackgroundImage', function() {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, elem, attr) {
        elem.css('background-image', 'url(\'' + attr.ngBackgroundImage + '\')');
        attr.$set('ngBackgroundImage', null);
      }
    };
  });
