angular.module('stoutful.controllers')
  .controller('PatchDetailsController', function($scope, $routeParams, patchCache, $http, $location) {
    var patchId = $routeParams.patchId;

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

    function addFormlyFields(model, array) {
      var keys = _.filter(_.keys(model), function(key) {
        return _.indexOf($scope.form.fields.excludes, key) == -1;
      });

      _.each(keys.sort(), function(key) {
        array.push(buildFormlyField(model, key));
      });
    }

    function buildFormlyField(model, key) {
      var type = 'patch-input';
      var label = S(key).humanize().s;

      if (key === 'image_url') {
        type = 'input-image';
        label = 'Image';
      }

      return {
        type: type,
        key: key,
        templateOptions: {
          label: label,
          removed: _.indexOf(_.keys($scope.model.changes), key) != -1 && $scope.model.changes[key] != model[key],
          added: _.indexOf(_.keys($scope.model.changes), key) != -1 && $scope.model.changes[key] === model[key],
          render: function(key, model) {
            if (key === 'brewery' || key === 'category' || key === 'style') {
              return model[key].name;
            }
            return model[key];
          }
        }
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
