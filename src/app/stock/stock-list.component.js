angular
  .module('app')
  .component('stockListCom', {
    templateUrl: 'app/stock/template/stock-list.html',
    controller: function ($rootScope, $log, $state, $q, $interval, StockSDK, NotificationSDK, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, DTDefaultOptions, blockUI, SweetAlert, Notification) {
      var self = this;
      self.drugs = [];

      angular.element('.dropdown-menu > .hold-on-click').on('click', function(e) {
            // angular.element('.dropdown-menu').addClass('');;
        });

      /**
       * Get Drugs
      */
      function getDrugs() {
        var deferred = $q.defer();
        StockSDK.getDrugs().then(function (response) {
          self.drugs = response.content;
          $log.log("*********self.drugs********");
          $log.log(self.drugs);
          for (var t = 0; t < self.drugs.length; t++) {
            self.drugs[t].seen = false;
            self.drugs[t].qty = 0;
          }

          getPreviousNotifications();
          getStockBatches();
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrugs();

      /**
       * Get Drugs
      */
      function getStockBatches() {
        var deferred = $q.defer();
        StockSDK.getBatches().then(function (response) {
          self.batches = response.content;
          $log.log("*********self.batches********");
          $log.log(self.batches);

          for (var b = 0; b < self.batches.length; b++) {
            for (var a = 0; a < self.drugs.length; a++) {
              if (self.drugs[a].id === self.batches[b].stock_Id) {
                console.log("gdgdgd");
                self.drugs[a].qty += self.batches[b].quantity;
              }
            }
          }
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }

      /**
       * Gets the previous notifications.
       *
       * @return     {object}  The previous notifications.
       */
      function getPreviousNotifications() {
        var deferred = $q.defer();
        NotificationSDK.getPreNotifications().then(function (response) {
          self.notifications = response.content;
          $log.log("*********self.notifications********");
          $log.log(self.notifications);

          for (var k = 0; k < self.notifications.length; k++) {
            for (var l = 0; l < self.drugs.length; l++) {
              if (self.notifications[k].stock.id === self.drugs[l].id) {
                self.drugs[l].seen = true;
              }
            }
          }
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }

      /**
       * Gets the new notifications.
       *
       * @return     {object}  The new notifications.
       */
      self.tempNewNotification = [];
      var nCount = 0;
      function getNewNotificationsRealtime() {
        var deferred = $q.defer();
        NotificationSDK.getNewNotifications().then(function (response) {
          $log.log(response);
          $rootScope.newNotification = response.content;
          if (nCount === 0) {
            angular.copy($rootScope.newNotification, self.tempNewNotification);
            if (self.tempNewNotification.length > 0) {
              Notification.success('You have unread notification(s)');
            }
            nCount++;
          }
          console.log("$rootScope.newNotification");
          console.log($rootScope.newNotification);
          console.log("self.tempNewNotification");
          console.log(self.tempNewNotification);
          for (var c = 0; c < $rootScope.newNotification.length; c++) {
            if (angular.isDefined(self.tempNewNotification[c]) && $rootScope.newNotification[c].id === self.tempNewNotification[c].id) {
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
      // $interval(getNewNotificationsRealtime, 5000);

      self.language = {
        // "sEmptyTable": "Ingen tilgængelige data (prøv en anden søgning)",
        // "sInfo": "Viser _START_ til _END_ af _TOTAL_ rækker",
        // "sInfoEmpty": "Viser 0 til 0 af 0 rækker",
        // "sInfoFiltered": "(filtreret ud af _MAX_ rækker ialt)",
        // "sInfoPostFix": "",
        // "sInfoThousands": ",",
        sLengthMenu: "Show _MENU_",
        // "sLoadingRecords": "Henter data...",
        // "sProcessing": "Processing...",
        // sSearch: "Seatc:",
        // "sZeroRecords": "Ingen rækker matchede filter",
        oPaginate:
        {
        // "sFirst": "Første",
        // "sLast": "Sidste",
          sNext: ">",
          sPrevious: "<"
        }
        // "oAria": {
        // "sSortAscending": ": activate to sort column ascending",
        // "sSortDescending": ": activate to sort column descending"
        // }
      };

      self.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('responsive', true)
        .withOption('scrollX', '100%')
        .withLanguage(self.language)
        .withBootstrap();

      self.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        // DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(self.drugs.length - 1).notSortable(),
        DTColumnDefBuilder.newColumnDef(5).notSortable()
      ];


      /**
       * Delete Dug Item
       *
       * @param      {int}  id      The identifier
       */
      function toDelete(id) {
        SweetAlert.swal(
          {
            title: "Are you sure?",
            text: "Your will not be able to recover this drug data!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false
          },
          function (isConfirm) {
            if (isConfirm) {
              StockSDK.deleteDrug(id).then(function (response) {
                self.deletetemp = response;
                $log.log(self.deletetemp);
                getDrugs();
                SweetAlert.swal("Deleted!", "Your drug data has been deleted.", "success");
              }, function (error) {
                SweetAlert.swal("Oops!", "Something went wrong. Please try again later", "error");
                $log.error(error);
              });
            } else {
              SweetAlert.swal("Cancelled", "Your drug data is safe :)", "error");
            }
          });
      }

      /**
       * Edit Drug Item
       *
       * @param      {string}  id      The identifier
       */
      function toEdit(id) {
        $log.log("id : " + id);
        $state.go('app.stock.edit', {id: id});
      }

      function toNotify(drugObj) {
        $log.log(drugObj);
        var deferred = $q.defer();
        var notificationObj = {
          name: "Low quantity detected - " + drugObj.name
        }
        NotificationSDK.makeNotification({name: ("Low quantity detected - " + drugObj.name), stock: drugObj.id}).then(function (response) {
          if (response.status === 201) {
            SweetAlert.swal({
              title: "Nice!",
              text: "Notification sent successfully.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }, function () {
              SweetAlert.close();
            });
          }
          for (var n = 0; n < self.drugs.length; n++) {
            if (self.drugs[n].id === response.content.stock.id) {
              self.drugs[n].seen = true;
            }
          }
          nCount = 0;
          $log.log(response);
          deferred.resolve(response);
        }, function (error) {
          $log.error(error);
          SweetAlert.swal({
            title: "Oops! Something went wrong. Please try again.",
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }, function () {
            SweetAlert.close();
          });
          deferred.reject(error);
        });
        return deferred.promise;
      }

      /**
       * Public methods
      */
      self.toDelete = toDelete;
      self.toEdit = toEdit;
      self.toNotify = toNotify;
    }
  });
