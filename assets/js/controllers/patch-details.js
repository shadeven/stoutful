angular.module('stoutful.controllers')
  .controller('PatchDetailsController', function($scope, $routeParams, patchCache, $http) {
    var patchId = $routeParams.patchId;

    $scope.original = {};
    $scope.patched = {};
    $scope.model = patchCache.findById(patchId);
    $scope.form = {
      fields: {
        original: [],
        patch: [],
        excludes: ['id', 'created_at', 'updated_at']
      },
      options: {
        formState: {
          readOnly: true
        }
      }
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

      _.each(keys, function(key) {
        array.push(buildFormlyField(key));
      });
    }

    function buildFormlyField(key) {
      return {
        type: 'patch-input',
        key: key,
        templateOptions: {
          label: key,
          diff: _.indexOf(_.keys($scope.model.changes), key) != -1
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
