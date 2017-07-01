angular
  .module('app', ['ui.router', 'core.service', 'core.sdk', 'core.directive', 'ngAnimate', 'mgcrea.ngStrap', 'oitozero.ngSweetAlert', 'blockUI', 'angular-loading-bar', 'datatables', 'datatables.options', 'datatables.bootstrap', 'ui-notification'])
  .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
    });
