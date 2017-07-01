angular
  .module('app')
  .component('stockEditCom', {
    templateUrl: 'app/stock/template/stock-edit.html',
    controller: function ($log, $state, $stateParams, $q, $timeout, StockSDK, SweetAlert) {
      var self = this;
      self.drugId = Number($stateParams.id);

      $log.log(self.stockEditForm);

      self.drugEdit = [];
      self.drugEdit.selectedDrugCategory = '9999';

      $timeout(function () {
        for (var i = angular.element('.form-body select').length - 1; i >= 0; i--) {
          angular.element('.form-body select')[i].focus();
        }

        for (var k = angular.element('.form-body input').length - 1; k >= 0; k--) {
          angular.element('.form-body input')[k].focus();
        }
        angular.element('body')[0].scrollTop = 0;
      }, 200);

      self.drugCategories = [];
      // self.drugDosages = [];
      // self.drugFrequencies = [];

      // Process
      self.isEditDrugProcessing = false;

      /**
       * Get Drug Categories
      */
      function getDrugCategories() {
        var deferred = $q.defer();
        StockSDK.getDrugCategories().then(function (response) {
          self.drugCategories = response.content;
          $log.log("*********self.drugCategories********");
          $log.log(self.drugCategories);
          deferred.resolve(response);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrugCategories();

      /**
       * Get Drug Dosage
      */
      // function getDrugDosage() {
      //   var deferred = $q.defer();
      //   StockSDK.getDrugDosages().then(function (response) {
      //     self.drugDosages = response.content;
      //     $log.log("*********self.drugDosages********");
      //     $log.log(self.drugDosages);
      //     deferred.resolve(response);
      //   }, function (error) {
      //     $log.debug(error);
      //     deferred.reject(error);
      //   });

      //   return deferred.promise;
      // }
      // getDrugDosage();

      /**
       * Get Drug Frequency
      */
      // function getDrugFrequency() {
      //   var deferred = $q.defer();
      //   StockSDK.getDrugFrequencies().then(function (response) {
      //     self.drugFrequencies = response.content;
      //     $log.log("*********self.drugFrequencies********");
      //     $log.log(self.drugFrequencies);
      //     deferred.resolve(response);
      //   }, function (error) {
      //     $log.debug(error);
      //     deferred.reject(error);
      //   });

      //   return deferred.promise;
      // }
      // getDrugFrequency();

      /**
       * Get Selected Drug
      */
      function getDrug() {
        var deferred = $q.defer();
        StockSDK.getDrugs(self.drugId).then(function (response) {
          self.drugData = response.content;
          $log.log("*********self.drugData********");
          $log.log(self.drugData);
          deferred.resolve(response);

          self.drugEdit.selectedDrugCategory = String(self.drugData.category.id);
          self.drugEdit.drugName = self.drugData.name;
          self.drugEdit.drugType = self.drugData.type;
          self.drugEdit.drugPrice = self.drugData.price;
          self.drugEdit.drugRemarks = self.drugData.remarks;
          self.drugEdit.drugDangerLevel = self.drugData.dangerlevel;
          self.drugEdit.drugReorderLevel = self.drugData.reorderlevel;
          self.drugEdit.drugWeight = self.drugData.weight;
          // self.drugEdit.selectedDosage = String(self.drugData.dosage.id);
          // self.drugEdit.selectedFrequency = String(self.drugData.frequency.id);
          $log.log(self.drugEdit);
        }, function (error) {
          $log.debug(error);
          deferred.reject(error);
        });

        return deferred.promise;
      }
      getDrug();

      /**
       * Drug Submit Event
      */
      self.stockSubmitBtnClicked = false;
      function onEditDrugSubmit() {
        self.stockSubmitBtnClicked = true;

        $log.log("self.drugEdit");
        $log.log(self.drugEdit);

        $log.log("self.stockEditForm");
        $log.log(self.stockEditForm);

        self.drugItemDB = {
          id: self.drugId,
          category: Number(self.drugEdit.selectedDrugCategory),
          name: self.drugEdit.drugName,
          type: self.drugEdit.drugType,
          price: self.drugEdit.drugPrice,
          dangerlevel: Number(self.drugEdit.drugDangerLevel),
          reorderlevel: Number(self.drugEdit.drugReorderLevel),
          weight: self.drugEdit.drugWeight
          // dosage: Number(self.drugEdit.selectedDosage),
          // frequency: Number(self.drugEdit.selectedFrequency)
        };

        if (self.drugEdit.drugRemarks !== null || self.drugEdit.drugRemarks !== "") {
          self.drugItemDB.remarks = self.drugEdit.drugRemarks;
        }

        $log.log(self.drugItemDB);
        if (self.stockEditForm.$valid && self.drugEdit.selectedDrugCategory !== '9999') {
          $log.log("Edit Drug updated called");

          editDrug(self.drugItemDB);
        }
      }


      /**
       * Edit Drug API
       *
       * @param      {object}  editDrugObj  The edit drug object
       * @return     {object}  promise
       */
      function editDrug(editDrugObj) {
        self.isEditDrugProcessing = true;
        var deferred = $q.defer();
        StockSDK.updateDrug(self.drugId, editDrugObj).then(function (response) {
          if (response.status === 200) {
            SweetAlert.swal({
              title: "Drug updated successfully.",
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }, function () {
              SweetAlert.close();
            });
          }
          $log.log(response);
          deferred.resolve(response);
          self.isEditDrugProcessing = false;
          $state.go('app.stock.list');
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
          self.isEditDrugProcessing = false;
        });
        return deferred.promise;
      }

      /**
       * Public methods
      */
      self.onEditDrugSubmit = onEditDrugSubmit;
    }
  });
