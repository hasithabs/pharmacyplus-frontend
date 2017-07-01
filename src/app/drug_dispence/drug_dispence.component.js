angular
    .module('app')
    .component('drugDispenceCom', {
        templateUrl: 'app/drug_dispence/template/drug_dispence.html',
        controller: function ($scope,$http,SETTINGS,SweetAlert ) {

            $scope.prescriptionArray = [];

            //-------------------------------------getting PRESCRIPTION data ----------------------------------------------------

            $scope.prescriptionArray=[
                {
                    "prescriptionId":20,
                    "patientName":"asun",
                    "doctorName":"Madusanka",
                    "isIssued":"false",
                    "medDuration":[
                        {
                            "stock_id":1,
                            "name":"piriton",
                            "quentity" : "1",
                            "time" : "3 Times per Day",
                            "duration":"2 weeks"
                        },

                        {
                            "stock_id":3,
                            "name":"panadole",
                            "quentity" : "1",
                            "time" : "2 Times per Day",
                            "duration":"5 weeks"
                        }
                    ]

                },

                {
                    "prescriptionId":40,
                    "patientName":"hhhh",
                    "doctorName":"kkkkkk",
                    "isIssued":"false",
                    "medDuration":[
                        {
                            "stock_id":1,
                            "name":"panadole",
                            "quentity" : "1",
                            "time" : "3 Times per Day",
                            "duration":"5 weeks"
                        },

                        {
                            "stock_id":3,
                            "name":"panadole",
                            "quentity" : "1",
                            "time" : "1 Times per Day",
                            "duration":"5 weeks"
                        }
                    ]

                },
                {
                    "doctorName" : "Dr.Yashvida Jayasekara",
                    "prescriptionId" : 999,
                    "patientName" : "GGWP",
                    "isIssued" : "False",
                    "medDuration" : [
                        {
                            "duration" : "1 Week",
                            "quentity" : "1",
                            "time" : "1 Times per Day(Morning Only)",
                            "name" : "gg1"
                        },
                        {
                            "duration" : "2 Weeks",
                            "quentity" : "2",
                            "time" : "1 Times per Day(Night Only)",
                            "name" : "gg2"
                        },
                        {
                            "duration" : "2 Weeks",
                            "quentity" : "1",
                            "time" : "1 Times per Day",
                            "name" : "gg3"
                        },
                        {
                            "duration" : "2 Weeks",
                            "quentity" : "1",
                            "time" : "1 Times per Day",
                            "name" : "gg4"
                        }
                    ]
                }

            ];

            // $http.get(SETTINGS.SITE_URL+'/prescription/').then(function(result){
            //     console.log('prescription Data'+result.data.content);
            //     $scope.prescriptionArray=result.data.content;
            // });

            //------------------------------------------------------------------------------------------------------------------------------

            //-----------------------------------------------getting STOCK data--------------------------------------------------------------
            $scope.stockArray =[];

            $scope.stockArray =[
                {
                    prescriptionId:1,
                    category:'pain killers',
                    name:'panadol',
                    price:2,
                    reorderlevel:50,
                    type:"tablet"
                },
                {
                    prescriptionId:3,
                    category:'pain killers',
                    name:'piriton',
                    price:5,
                    reorderlevel:50,
                    type:"tablet"
                },

            ];

            // $http.get('http://localhost/stock/').then(function(result){
            //     console.log('stock Data'+result.data.content);
            //      $scope.stockArray=result.data.content;
            // });

            //-------------------------------------------------------------------------------------------------------------------------------

            //------------------------------------------------------get BATCH data ----------------------------------------------------------
            $scope.batchArray=[];

            $http.get(SETTINGS.SITE_URL+'/batches/').then(function(result){
                $scope.batchArray=result.data.content;
                console.log($scope.batchArray);
            });

            //-------------------------------------------------------------------------------------------------------------------------------




            //-----------------------------------------------issueDrug function -------------------------------------------------------------

            $scope.issueDrug=function (prescription) {

                $scope.msgArray=[];
                $scope.outputText ={};
                $scope.billVal=0;

                var drugs = prescription.medDuration;

                //get each drug
                for(var x=0; x<drugs.length;x++){

                    //Assign Variables

                    var drugBatchArray=[];
                    var requiredQuantity=0;
                    var type="";
                    var itemPrice=0;
                    var TotalPrice=0;
                    var reorderLevel=0;
                    var found= false;
                    var sortedArray=[];
                    var stockStatus=false;

                    //find the stock data according to the prescriptionId
                    for(var i=0;i<$scope.stockArray.length;i++){

                        //check weather the given drug is available in the stock table
                        if($scope.stockArray[i].prescriptionId==drugs[x].stock_id){

                            found=true;
                            type=$scope.stockArray[i].type;
                            itemPrice=$scope.stockArray[i].price;
                            reorderLevel=$scope.stockArray[i].reorderlevel;

                        }
                    }


                    //check weather the drug is available in the stock table
                    if(found){


                        //get the type of the medicine in order to------------- calculate the quantity-------------

                        if(type=="tablet" || type=="capsule"){  //----------------********************* TYPE of the tablet should be correct according to stock *********-----------//

                            var dayValue = parseInt(drugs[x].time.split(" ")[0]);
                            var weeks = parseInt(drugs[x].duration.split(" ")[0]);
                            var quantity = parseInt(drugs[x].quentity);


                            //calculate quantity
                            requiredQuantity=dayValue*weeks*7*quantity;
                        }
                        else {
                            var quantity = parseInt(drugs[x].quentity);
                            requiredQuantity=1*quantity;
                        }

                        //calculate  total price
                        TotalPrice = requiredQuantity*itemPrice;



                        //get all batches that are available from the drug

                        drugBatchArray=[];
                        for(var j=0;j<$scope.batchArray.length;j++){

                            if($scope.batchArray[j].stock_Id==drugs[x].stock_id) {

                                drugBatchArray.push($scope.batchArray[j]);

                            }

                        }

                        //check weather batches are available for the drug
                        if(drugBatchArray.length>0){

                            //------------------***************SORT ARRAY IN ASCENDING ORDER according to the expired date*****************-----------------
                            sortedArray = drugBatchArray.sort(function(a, b) {
                                return a.issue_no - b.issue_no;
                            });



                            //reduce the batches according to the ascending order of expired date

                            var totalQuantity=0;
                            var CurrentrequriedQuntity=requiredQuantity;

                            for(var h=0;h<sortedArray.length;h++){

                                //get summation of quantities of array
                                totalQuantity = totalQuantity + sortedArray[h].quantity;


                                //check weather the requested quantity is enough to do issue drug
                                if((totalQuantity-reorderLevel)>=requiredQuantity){

                                    console.log('partial batches should be deleted');
                                    //delete batches that are *****empty******--------that mean no remaining medDuration in batch--------------
                                    for(var y=0;y<h;y++){
                                        $http.delete('http://localhost:9000/batches/'+sortedArray[y]._id).then(function (result) {
                                            // console.log('batch deleted');
                                        });
                                    }

                                    var remainingBatchQuantity = sortedArray[h].quantity- CurrentrequriedQuntity;
                                    //update the remaining quantity


                                    $http.put(SETTINGS.SITE_URL+'/batches/'+sortedArray[h]._id,{"quantity":remainingBatchQuantity}).then(function (result) {

                                    });


                                    //set stock operation is completed
                                    stockStatus=true;


                                }
                                else {

                                    CurrentrequriedQuntity = requiredQuantity - sortedArray[h].quantity;
                                }

                            }

                        }
                        else {
                           // alert('batches are not available for the '+drugs[x].name);
                            SweetAlert.swal({
                                title: 'batches are not available for the '+drugs[x].name,
                                type: "error",
                                timer: 2000,
                                showConfirmButton: false
                            }, function () {
                                SweetAlert.close();
                            });
                        }

                    }
                    else{
                       // alert(drugs[x].name+' Can not find in the Stock!!!');

                        SweetAlert.swal({
                            title: drugs[x].name+' Can not find in the Stock!!!',
                            type: "error",
                            timer: 2000,
                            showConfirmButton: false
                        }, function () {
                            SweetAlert.close();
                        });
                    }

                    //if drug limit is not enough
                    if(stockStatus==false){
                        // alert('not enough medDuration to give!!!');

                        $scope.billVal =  $scope.billVal+0;

                        $scope.outputText={
                            "drugName":drugs[x].name,
                            "price":"Out Of Stock",

                        };

                        $scope.msgArray.push($scope.outputText);

                    }
                    else if(stockStatus==true){
                        //alert('Successful');

                        $scope.billVal =  $scope.billVal+TotalPrice;

                        $scope.outputText={
                            "drugName":drugs[x].name,
                            "price":(TotalPrice*100 / 100).toFixed(2)
                        };
                        $scope.msgArray.push($scope.outputText);
                    }


                }

                //add two decimal places
                $scope.billVal=( $scope.billVal*100 / 100).toFixed(2)

                //=========================================update the status of the prescription==========================================
                prescription.isIssued="true";

                // $http.put(SETTINGS.SITE_URL+'/prescription/'+prescription._id,{"isIssued":"true"}).then(function (result) {
                //     console.log(result);
                // })


            }

            //-------------------------------------------------------------------------------------------------------------------------------




        }
    });

