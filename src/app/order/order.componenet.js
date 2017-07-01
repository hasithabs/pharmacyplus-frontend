/**
 * Created by Y4SHVINE on 5/7/2017.
 */

angular
    .module('app')
    .component('orderCom', {
        templateUrl: 'app/order/template/order.html',
        controller: function ($log, $q, OrderSDK, SweetAlert, moment) {
            console.log("gg1");
            var self = this;
            self.orderDate = moment(new Date()).format("DD/MM/YYYY");
            self.deliveryDate = moment(new Date()).add(7, 'days').format("DD/MM/YYYY");
            console.log(self.orderDate);
            self.isNewOrderProcessing = false;

            self.orderID = Date.now();
            self.orderLocation = "Team + Malabe";

            self.selectedItemName = String(9999);
            self.selectedSupplier = String(9999);
            self.orderNetPrice = 0;
            self.tableOder = [];
            self.itemNames = [];

            console.log(self.itemNames);

            //Suppliers Json
            self.suppliers = [
                {
                    "name": "Omak",
                    "id": 1,
                    "email": "yashvida.1007@gmail.com",
                    "goods": [
                        {
                            "id": 1,
                            "medName": "Pandol (Liquid 250ml)",
                            "itemPrice": 150
                        },
                        {
                            "id": 1,
                            "medName": "Pandol",
                            "itemPrice": 2
                        },
                        {
                            "id": 2,
                            "medName": "Piriton",
                            "itemPrice": 2.5
                        },
                        {
                            "id": 3,
                            "medName": "Aspirin",
                            "itemPrice": 5
                        },
                        {
                            "id": 4,
                            "medName": "Parasitamol",
                            "itemPrice": 1
                        }
                    ]
                },
                {
                    "name": "Fidenz",
                    "id": 2,
                    "email": "hasitha.bigwig@gmail.com",
                    "goods": [
                        {
                            "id": 10,
                            "medName": "Med 1",
                            "itemPrice": 150
                        },
                        {
                            "id": 11,
                            "medName": "Med 2",
                            "itemPrice": 2
                        },
                        {
                            "id": 12,
                            "medName": "Med 3",
                            "itemPrice": 2.5
                        },
                        {
                            "id": 13,
                            "medName": "Med 4",
                            "itemPrice": 5
                        },
                        {
                            "id": 14,
                            "medName": "Med 5",
                            "itemPrice": 1
                        }
                    ]
                },
                {
                    "name": "Virtusa",
                    "id": 3,
                    "email": "ravindu.jayasekara@my.sliit.lk",
                    "goods": [
                        {
                            "id": 5,
                            "medName": "Carbonic2",
                            "itemPrice": 22.5
                        },
                        {
                            "id": 6,
                            "medName": "Power Jesic",
                            "itemPrice": 250
                        },
                        {
                            "id": 7,
                            "medName": "Disprine (500mg)",
                            "itemPrice": 6
                        },
                        {
                            "id": 8,
                            "medName": "Disprine (250mg)",
                            "itemPrice": 4.5
                        },
                        {
                            "id": 9,
                            "medName": "Detol",
                            "itemPrice": 200
                        }
                    ]
                }
            ];

            //Adding Data to Table
            self.onItemAddClicked = function () {
                if (self.selectedItemName === String(9999) || self.squentity === null) {
                    SweetAlert.swal({
                        title: "Empty fields",
                        type: "error",
                        timer: 1000,
                        showConfirmButton: false
                    }, function () {
                        SweetAlert.close();
                    });
                    return;
                }
                var selectedItemTemp = angular.fromJson(self.selectedItemName);

                self.tableOder.push({
                    id: selectedItemTemp.id, mediName: selectedItemTemp.medName,
                    quentity: self.squentity, itemPrice: (selectedItemTemp.itemPrice * self.squentity)
                });
                self.orderNetPrice = self.orderNetPrice + (selectedItemTemp.itemPrice * self.squentity);
                resetMedTableData();
            };

            //Delete Table raw
            self.onDeleteClicked = function (id) {
                self.tableOder.splice(id, 1);
            }

            //Adding Order Data to API
            self.onPurchaseOrderClicked = function () {
                $log.log('orderForm')
                $log.log(self.orderForm)
                self.medToAPI = {
                    orderDate: self.orderDate,
                    orderId: self.orderID,
                    location: self.orderLocation,
                    isRecived: "false",
                    orderedItemDetails: self.tableOder,
                    netTotalPrice: self.orderNetPrice
                };
                $log.log("self.medToAPI");
                $log.log(self.medToAPI);

                if (self.orderForm.$valid && self.tableOder.length > 0) {
                    createOrder(self.medToAPI);
                    $log.log('Submited... api calling...');
                }
            };


            //Adding Order Data to API
            function createOrder(orderObj) {
                self.isNewOrderProcessing = true;
                var deferred = $q.defer();
                OrderSDK.placeOrder(orderObj).then(function (response) {
                    if (response.status === 201) {
                        SweetAlert.swal({
                            title: "Order Placed Successfully.",
                            type: "success",
                            timer: 2000,
                            showConfirmButton: false
                        }, function () {
                            SweetAlert.close();
                        });
                    }
                    $log.log(response);
                    deferred.resolve(response);
                    resetOrderFormData();
                    self.isNewOrderProcessing = false;
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
                    self.isNewOrderProcessing = false;
                });
                return deferred.promise;
            }



            //Reset Order Form
            function resetOrderFormData() {
                self.tableOder = [];
                self.itemNames = [];
                self.orderID = Date.now();
                self.selectedSupplier = String(9999);
                self.squentity = 0;
                resetMedTableData();
            }

            //Reset Table
            function resetMedTableData() {
                self.selectedItemName = String(9999);
                self.squentity = 0;
            }

            // //Send Email 
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'pharmacy.team.plus@gmail.com',
            //         pass: 'Pharmacy+123'
            //     }
            // });

            // var mailOptions = {
            //     from: 'pharmacy.team.plus@gmail.com',
            //     to: 'suppliers.email',
            //     subject: 'Pharmacy + Test',
            //     text: 'GGWP!'
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });

        }
    });

