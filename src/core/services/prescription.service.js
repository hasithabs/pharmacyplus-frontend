angular
  .module('core.service')
  .factory('PrescriptionAPI',
  function ($resource, SETTINGS) {
    var services = {
      prescription: prescription,
      prescriptionTimes: prescriptionTimes,
      prescriptionDurations: prescriptionDurations
    };

    function prescription() {
      var url = SETTINGS.SITE_URL + '/prescription';
      return $resource(url, {}, {
        save: {
          method: 'POST',
          isArray: false,
          cancellable: true
        }
      });
    }

    function prescriptionTimes() {
      var url = SETTINGS.SITE_URL + '/prescriptiontimes';
      return $resource(url, {}, {
        get: {
          method: 'GET',
          isArray: false,
          cancellable: true
        }
      });
    }

    function prescriptionDurations() {
      var url = SETTINGS.SITE_URL + '/prescriptiondurations';
      return $resource(url, {}, {
        get: {
          method: 'GET',
          isArray: false,
          cancellable: true
        }
      });
    }
    return services;
  });
