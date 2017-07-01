angular
  .module('core.sdk')
  .service('PrescriptionSDK',
  function ($log, $q, PrescriptionAPI) {

    this.makePrescription = function (prescriptionObj) {
      var deferred = $q.defer();
      PrescriptionAPI.prescription().save(prescriptionObj).$promise.then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      $log.debug('PrescriptionSDK:makePrescription');
      return deferred.promise;
    };

    this.getPrescriptionTimes = function () {
      var deferred = $q.defer();
      PrescriptionAPI.prescriptionTimes().get().$promise.then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      $log.debug('PrescriptionSDK:getPrescriptionTimes');
      return deferred.promise;
    };

    this.getPrescriptionDurations = function () {
      var deferred = $q.defer();
      PrescriptionAPI.prescriptionDurations().get().$promise.then(function (response) {
        deferred.resolve(response);
      }, function (error) {
        deferred.reject(error);
      });
      $log.debug('PrescriptionSDK:getPrescriptionDurations');
      return deferred.promise;
    };
  });

