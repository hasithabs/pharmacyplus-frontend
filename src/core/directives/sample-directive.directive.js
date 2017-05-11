angular
  .module('core.directive')
  .directive('sampleDirective',
    function () {
      return {
        restrict: 'E',
        templateUrl: 'core/directives/templates/sample-directive.html',
        controllerAs: 'sampleDirectiveCtrl',
        controller: function () {
          // var self = this;
        }
      };
    });
