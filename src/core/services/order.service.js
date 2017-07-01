angular
  .module('core.service')
  .factory('OrderAPI',
  function ($resource, SETTINGS) {
    var services = {
      order:order
    };

    function order() {
      var url = SETTINGS.SITE_URL + '/orders';
      return $resource(url, {}, {
        save: {
          method: 'POST',
          isArray: false,
          cancellable: true
        }
      });
    }
    return services;
  });
