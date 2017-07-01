angular
  .module('core.service')
  .factory('NotificationAPI',
    function ($resource, SETTINGS) {
      // Public API
      var services = {
        notificationData: notificationData,
        notificationSeen: notificationSeen,
        notificationUnseen: notificationUnseen
      };

      function notificationData() {
        var url = SETTINGS.SITE_URL + '/notification/:id';
        return $resource(url, {nid: '@id'}, {
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

      function notificationSeen() {
        var url = SETTINGS.SITE_URL + '/notification/seen/:id';
        return $resource(url, {nid: '@id'}, {
          update: {
            method: 'PUT',
            isArray: false,
            cancellable: true
          }
        });
      }

      function notificationUnseen() {
        var url = SETTINGS.SITE_URL + '/notification/unseen';
        return $resource(url, {nid: '@id'}, {
          get: {
            method: 'GET',
            isArray: false,
            cancellable: true
          }
        });
      }

      return services;
    });
