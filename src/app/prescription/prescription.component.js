/**
 * Created by Y4SHVINE on 5/7/2017.
 */

angular
    .module('app')
    .component('prescriptionCom', {
        templateUrl: 'app/prescription/template/prescription.html',
        controller: function ($log, $q, PrescriptionSDK, SweetAlert, StockSDK) {
            console.log("gg1");
            var self = this;
            self.isNewPrescriptionProcessing = false;
            self.medset = [];
            self.medset.docname = "Dr.Yashvida Jayasekara";
            self.medset.PID = Date.now();
            self.selectedTime = String(9999);
            self.selectedQuentity = String(9999);
            self.selectedDuration = String(9999);
            self.selectedMedicine = String(9999);
            self.tableMed = [];

            self.prescriptionTime = [];
            self.prescriptionDuration = [];
            self.prescriptionMedicine = [];


            //Adding Data to Table
            self.onItemAddClicked = function () {
                if (self.selectedMedicine === String(9999) || self.selectedDuration === String(9999) || self.selectedTime === String(9999) ||
                    self.selectedQuentity === String(9999)) {
                    SweetAlert.swal({
                        title: "Invalid fields",
                        type: "error",
                        timer: 1000,
                        showConfirmButton: false
                    }, function () {
                        SweetAlert.close();
                    });
                    return;
                }
                var selectedMedicineTemp = angular.fromJson(self.selectedMedicine);
                self.tableMed.push({
                    name: selectedMedicineTemp.name, time: self.selectedTime,
                    quentity: self.selectedQuentity, duration: self.selectedDuration, stock_id: selectedMedicineTemp.id
                });
                resetMedTableData();
            };

            //Delete Table raw
            self.onDeleteClicked = function (id) {
                self.tableMed.splice(id, 1);
            }

            //Adding Prescription Data to API
            self.onSubmitClicked = function () {
                $log.log('medForm')
                $log.log(self.medForm)
                self.medFormDB = {
                    doctorName: self.medset.docname,
                    prescriptionId: self.medset.PID,
                    patientName: self.medset.patientName,
                    isIssued: "false",
                    medDuration: self.tableMed,
                };
                $log.log("self.medFormDB");
                $log.log(self.medFormDB);

                if (self.medForm.$valid && self.tableMed.length > 0) {
                    createPrescription(self.medFormDB);
                    $log.log('Submited... api calling...');
                }
            };


            //Get Prescription Times
            function getPresTimes() {
                var deferred = $q.defer();
                PrescriptionSDK.getPrescriptionTimes().then(function (response) {
                    self.prescriptionTime = response.content;
                    $log.log("*********self.prescriptionTime********");
                    $log.log(self.prescriptionTime);
                    deferred.resolve(response);
                }, function (error) {
                    $log.debug(error);
                    deferred.reject(error);
                });

                return deferred.promise;
            }
            getPresTimes();


            //Get Prescription Durations
            function getPresDurations() {
                var deferred = $q.defer();
                PrescriptionSDK.getPrescriptionDurations().then(function (response) {
                    self.prescriptionDuration = response.content;
                    $log.log("*********self.prescriptionDuration********");
                    $log.log(self.prescriptionDuration);
                    deferred.resolve(response);
                }, function (error) {
                    $log.debug(error);
                    deferred.reject(error);
                });

                return deferred.promise;
            }
            getPresDurations();

            //Get Prescription Medicine
            function getDrugs() {
                var deferred = $q.defer();
                StockSDK.getDrugs().then(function (response) {
                    self.prescriptionMedicine = response.content;
                    $log.log("*********self.prescriptionMedicine********");
                    $log.log(self.prescriptionMedicine);
                    deferred.resolve(response);
                }, function (error) {
                    $log.debug(error);
                    deferred.reject(error);
                });

                return deferred.promise;
            }
            getDrugs();

            //Adding Prescription Data to API
            function createPrescription(prescriptionObj) {
                self.isNewPrescriptionProcessing = true;
                var deferred = $q.defer();
                PrescriptionSDK.makePrescription(prescriptionObj).then(function (response) {
                    if (response.status === 201) {
                        SweetAlert.swal({
                            title: "Prescription created successfully.",
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                        }, function () {
                            SweetAlert.close();
                        });
                    }
                    $log.log(response);
                    deferred.resolve(response);
                    resetPrescriptionFormData();
                    self.isNewPrescriptionProcessing = false;
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
                    self.isNewPrescriptionProcessing = false;
                });
                return deferred.promise;
            }



            //Reset Prescription
            function resetPrescriptionFormData() {
                self.medFormDB = [];
                self.tableMed = [];
                self.medset = [];
                self.medset.PID = Date.now();
                self.medset.duration = String(9999);
                self.medset.docname = "Dr.Yashvida Jayasekara";
                self.selectedTime = String(9999);
                self.selectedQuentity = String(9999);
                self.selectedDuration = String(9999);
                self.selectedMedicine = String(9999);
            }

            //Reset Table
            function resetMedTableData() {
                self.selectedTime = String(9999);
                self.selectedQuentity = String(9999);
                self.selectedDuration = String(9999);
                self.selectedMedicine = String(9999);
            }

        }
    });

