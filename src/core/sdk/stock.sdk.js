angular
  .module('core.sdk')
  .service('StockSDK',
    function ($log, $q, StockAPI) {
      this.getDrugs = function (drugId) {
        var deferred = $q.defer();
        StockAPI.stockDrug().get({id: drugId}).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:getDrugs');
        return deferred.promise;
      };

      this.makeDrug = function (drugObj) {
        var deferred = $q.defer();
        StockAPI.stockDrug().save({}, drugObj).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:makeDrug');
        return deferred.promise;
      };

      this.updateDrug = function (drugId, drugObj) {
        var deferred = $q.defer();
        StockAPI.stockDrug().update({id: drugId}, drugObj).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:updateDrug');
        return deferred.promise;
      };

      this.deleteDrug = function (drugId) {
        var deferred = $q.defer();
        StockAPI.stockDrug().delete({id: drugId}).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:deleteDrug');
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

      this.makeDrugCategory = function (categoryObj) {
        var deferred = $q.defer();
        StockAPI.drugCategory().save({}, categoryObj).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:makeDrugCategory');
        return deferred.promise;
      };

      this.deleteDrugCategory = function (categoryId) {
        var deferred = $q.defer();
        StockAPI.drugCategory().delete({id: categoryId}).$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:deleteDrugCategory');
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

      this.getBatches = function () {
        var deferred = $q.defer();
        StockAPI.batch().get().$promise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          deferred.reject(error);
        });
        $log.debug('StockSDK:getBatches');
        return deferred.promise;
      };
    });
