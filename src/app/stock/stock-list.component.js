angular
  .module('app')
  .component('stockListCom', {
    templateUrl: 'app/stock/template/stock-list.html',
    controller: function ($log, $state, $q, $timeout, StockSDK, NotificationSDK, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, DTDefaultOptions, blockUI, SweetAlert) {
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
          getNotifications();
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrugs();

      /**
       * Get Notification
      */
      function getNotifications() {
        var deferred = $q.defer();
        NotificationSDK.getNotifications().then(function (response) {
          self.notifications = response.content;
          $log.log("*********self.notifications********");
          $log.log(self.notifications);

          for (var k = 0; k < self.notifications.length; k++) {
            for (var l = 0; l < self.drugs.length; l++) {
              self.drugs[l].seen = false;
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
      $timeout(getNotifications(), 10000);

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
