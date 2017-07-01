angular
  .module('core.service')
  .factory('StockAPI',
    function ($resource, SETTINGS) {
      // Public API
      var services = {
        stockDrug: stockDrug,
        drugCategory: drugCategory,
        drugDosage: drugDosage,
        drugFrequency: drugFrequency,
        batch: batch
      };

      function stockDrug() {
        var url = SETTINGS.SITE_URL + '/stock/:id';
        return $resource(url, {did: '@id'}, {
          get: {
            method: 'GET',
            isArray: false,
            cancellable: true
          },
          save: {
            method: 'POST',
            isArray: false,
            cancellable: true
          },
          update: {
            method: 'PUT',
            isArray: false,
            cancellable: true
          },
          delete: {
            method: 'DELETE',
            isArray: false,
            cancellable: true
          }
        });
      }

      function drugCategory() {
        var url = SETTINGS.SITE_URL + '/drugcategory/:id';
        return $resource(url, {id: '@id'}, {
          get: {
            method: 'GET',
            isArray: false,
            cancellable: true
          },
          save: {
            method: 'POST',
            isArray: false,
            cancellable: true
          },
          delete: {
            method: 'DELETE',
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

      function batch() {
        var url = SETTINGS.SITE_URL + '/batches';
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
