angular
  .module('core.sdk')
  .service('OrderSDK',
  function ($log, $q, OrderAPI) {

    this.placeOrder = function (orderObj) {
      var deferred = $q.defer();
      OrderAPI.order().save(orderObj).$promise.then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      $log.debug('OrderSDK:placeOrder');
      return deferred.promise;
    };

  });

