angular
  .module('core.sdk')
  .service('StockSDK',
    function ($log, $q, StockAPI) {
      this.makeDrug = function (drugObj) {
        var deferred = $q.defer();
        StockAPI.stockDrug().save(drugObj).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:makeDrug');
        return deferred.promise;
      };

      this.getDrugCategories = function () {
        var deferred = $q.defer();
        StockAPI.drugCategory().get().$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:getDrugCategories');
        return deferred.promise;
      };

      this.getDrugDosages = function () {
        var deferred = $q.defer();
        StockAPI.drugDosage().get().$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:getDrugDosages');
        return deferred.promise;
      };

      this.getDrugFrequencies = function () {
        var deferred = $q.defer();
        StockAPI.drugFrequency().get().$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:getDrugFrequencies');
        return deferred.promise;
      };
    });
