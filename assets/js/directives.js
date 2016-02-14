/* globals $ */
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
  })
  .directive('mdLoadingContainer', function() {
    return {
      restrict: 'E',
      link: function(scope, elem, attr) {
        var $container = $(elem);
        var progressBar = $container.find('md-progress-circular');
        progressBar.hide();
        if (attr.ngModel) {
          scope.$watch(attr.ngModel, function(newValue) {
            var children = progressBar.siblings();
            if (newValue) {
              progressBar.css('left', ($container.width() / 2) - (progressBar.width() / 2));
              progressBar.css('top', ($container.height() / 2) - (progressBar.height() / 2));
              progressBar.show();
              children.addClass('not-visible');
            } else {
              progressBar.hide();
              children.removeClass('not-visible');
            }
          });
        }
      }
    };
  });
