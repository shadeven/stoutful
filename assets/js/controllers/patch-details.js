angular.module('stoutful.controllers')
  .controller('PatchDetailsController', function($scope, $routeParams, patchCache, $http, $location, session) {
    var vm = this;
    var patchId = $routeParams.patchId;
    vm.user = session.user;
    if (vm.user) {
      vm.canAcceptChanges = vm.user.role === 'publisher';
    } else {
      vm.canAcceptChanges = false;
    }

    vm.original = {};
    vm.patched = {};
    vm.model = patchCache.findById(patchId);
    vm.form = {
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

    vm.onAcceptChanges = function() {
      vm.submitting = true;
      $http.delete('/api/patches/' + patchId)
        .then(function() {
          vm.submitting = false;

          // Redirect back to patches listing
          $location.url('/patches');
        })
        .catch(function(err) {
          vm.submitting = false;
          console.log(err);
        });
    };

    // Main

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      vm.user = session.user;
      if (vm.user) {
        vm.canAcceptChanges = vm.user.role === 'publisher';
      } else {
        vm.canAcceptChanges = false;
      }
    });

    if (!vm.model) {
      $http.get('/api/patches/' + patchId)
        .then(function(response) {
          vm.model = response.data;
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
        return _.indexOf(vm.form.fields.excludes, key) == -1;
      });

      _.each(keys.sort(), function(key) {
        array.push(buildFormlyField(model, key));
      });
    }

    function buildFormlyField(model, key) {
      var type = 'input';
      var classes = [];
      if (_.indexOf(_.keys(vm.model.changes), key) != -1 && vm.model.changes[key] != model[key]) {
        classes.push("bg-danger");
      }
      if (_.indexOf(_.keys(vm.model.changes), key) != -1 && vm.model.changes[key] === model[key]) {
        classes.push("bg-success");
      }
      var templateOptions = {
        label: S(key).humanize().s,
        classes: classes.join(" ")
      };

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
        templateOptions: templateOptions,
        formatters: [function(viewVal, modelVal) {
          if (typeof modelVal === "object" && modelVal.name) {
            return modelVal.name;
          }
          return viewVal;
        }]
      };
    }

    function loadPatchModel() {
      $http.get(vm.model.modelUrl)
        .then(function(response) {
          vm.original = response.data;
          addFormlyFields(vm.original, vm.form.fields.original);

          // Construct "patched" model
          var outer = _.omit(vm.original, _.keys(vm.model.changes));
          vm.patched = _.extend({}, vm.model.changes, outer);
          addFormlyFields(vm.patched, vm.form.fields.patch);
        })
        .catch(function(err) {
          console.log('Error loading model: ',err);
        });
    }
  });
