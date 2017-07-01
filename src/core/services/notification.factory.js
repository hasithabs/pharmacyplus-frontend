angular
  .module('core.service')
  .factory('NotificationCenter', function ($rootScope, $log, $q, NotificationSDK, Notification) {
    var service = {
      getNewNotificationsRealtime: getNewNotificationsRealtime
    };


    $rootScope.newNotification = [];
    var tempNewNotification = [];
    var nCount = 0;
    function getNewNotificationsRealtime() {
      var deferred = $q.defer();
      NotificationSDK.getNewNotifications().then(function (response) {
        $log.log(response);
        $rootScope.newNotification = response.content;
        if (nCount === 0) {
          angular.copy($rootScope.newNotification, tempNewNotification);
          if (tempNewNotification.length > 0) {
            Notification.success('You have unread notification(s)');
          }
          nCount++;
        }
        for (var c = 0; c < $rootScope.newNotification.length; c++) {
          if (angular.isDefined(tempNewNotification[c]) && $rootScope.newNotification[c].id === tempNewNotification[c].id) {
            continue;
          }
          Notification.success('You have unread notification(s)');
        }
        deferred.resolve(response);
      }, function (error) {
        $log.debug(error);
        deferred.reject(error);
      });

      return deferred.promise;
    }

    return service;
  });
