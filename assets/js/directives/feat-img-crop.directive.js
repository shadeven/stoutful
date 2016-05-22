/* Featured image crop */

(function() {
  "use strict";

  angular.module("stoutful.directives")
    .directive("featImgCrop", featImgCrop);

  function featImgCrop() {
    return {
      restrict: "E",
      scope: {
        resultImage: "=",
        image: "="
      },
      template: "<img-crop image='image' " +
        "aspect-ratio='2.2' " +
        "result-image-size='{w: 1024, h: 465}' " +
        "result-image='resultImage' " +
        "area-type='rectangle'></img-crop>"
    }
  }
})();
