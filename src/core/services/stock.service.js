angular
  .module('core.service')
  .factory('StockAPI',
    function ($resource, SETTINGS) {
      // Public API
      var services = {
        stockDrug: stockDrug,
        drugCategory: drugCategory,
        drugDosage: drugDosage,
        drugFrequency: drugFrequency
      };

      function stockDrug() {
        var url = SETTINGS.SITE_URL + '/stock';
        return $resource(url, {}, {
          save: {
            method: 'POST',
            isArray: false,
            cancellable: true
          }
        });
      }

      function drugCategory() {
        var url = SETTINGS.SITE_URL + '/drugcategory';
        return $resource(url, {}, {
          get: {
            method: 'GET',
            isArray: false,
            cancellable: true
          }
        });
      }

      function drugDosage() {
        var url = SETTINGS.SITE_URL + '/drugdosage';
        return $resource(url, {}, {
          get: {
            method: 'GET',
            isArray: false,
            cancellable: true
          }
        });
      }

      function drugFrequency() {
        var url = SETTINGS.SITE_URL + '/drugfrequency';
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