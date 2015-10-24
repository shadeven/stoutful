angular.module('stoutful.controllers')
  .controller('PatchDetailsController', function($scope, $routeParams, patchCache, $http, $location, $modal, session) {
    var patchId = $routeParams.patchId;
    $scope.user = session.user;
    if ($scope.user) {
      $scope.canAcceptChanges = $scope.user.role === 'publisher';
    } else {
      $scope.canAcceptChanges = false;
    }

    $scope.original = {};
    $scope.patched = {};
    $scope.model = patchCache.findById(patchId);
    $scope.form = {
      fields: {
        original: [],
        patch: [],
        excludes: ['id', 'created_at', 'updated_at', 'brewery_id', 'cat_id', 'style_id']
      },
      options: {
        formState: {
          readOnly: true
        }
      }
    };

    $scope.onAcceptChanges = function() {
      $scope.submitting = true;
      $http.delete('/api/patches/' + patchId)
        .then(function() {
          $scope.submitting = false;

          // Redirect back to patches listing
          $location.url('/patches');
        })
        .catch(function(err) {
          $scope.submitting = false;
          console.log(err);
        });
    };

    // Main

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      if ($scope.user) {
        $scope.canAcceptChanges = $scope.user.role === 'publisher';
      } else {
        $scope.canAcceptChanges = false;
      }
    });

    if (!$scope.model) {
      $http.get('/api/patches/' + patchId)
        .then(function(response) {
          $scope.model = response.data;
          loadPatchModel();
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      loadPatchModel();
    }

    // Helper methods

    function addFormlyFields(model, array) {
      var keys = _.filter(_.keys(model), function(key) {
        return _.indexOf($scope.form.fields.excludes, key) == -1;
      });

      _.each(keys.sort(), function(key) {
        array.push(buildFormlyField(model, key));
      });
    }

    function buildFormlyField(model, key) {
      var type = 'input';
      var templateOptions = {
        label: S(key).humanize().s,
        removed: _.indexOf(_.keys($scope.model.changes), key) != -1 && $scope.model.changes[key] != model[key],
        added: _.indexOf(_.keys($scope.model.changes), key) != -1 && $scope.model.changes[key] === model[key]
      };

      if (key === 'brewery') {
        type = 'brewery-input';
      }

      if (key === 'category') {
        type = 'category-input';
      }

      if (key === 'style') {
        type = 'style-input';
      }

      if (key === 'image_url') {
        type = 'image';
        templateOptions.label = 'Image';
      }

      if (key === 'description') {
        type = 'textarea';
      }

      return {
        type: type,
        key: key,
        templateOptions: templateOptions
      };
    }

    function loadPatchModel() {
      $http.get($scope.model.modelUrl)
        .then(function(response) {
          $scope.original = response.data;
          addFormlyFields($scope.original, $scope.form.fields.original);

          // Construct "patched" model
          var outer = _.omit($scope.original, _.keys($scope.model.changes));
          $scope.patched = _.extend({}, $scope.model.changes, outer);
          addFormlyFields($scope.patched, $scope.form.fields.patch);
        })
        .catch(function(err) {
          console.log('Error loading model: ',err);
        });
    }
  });
