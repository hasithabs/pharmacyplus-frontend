angular
    .module('app')
    .component('batchHandleCom', {
        templateUrl: 'app/batch_handle/template/batch_handle.html',
        controller: function ($scope,$http,SETTINGS,SweetAlert) {

            //set batchNo

            $scope.genarateRandomNumber=function(){

                $scope.batchNo=Date.now();

            }

            $scope.drugArray=[];
            $http.get(SETTINGS.SITE_URL+'/stock/').then(function(result){

                console.log(result.data.content);
                 $scope.drugArray=result.data.content;

            });


            //drug category
            $scope.quantity="";

            // $scope.drugArray =[
            //     {
            //         prescriptionId:1,
            //         category:{"prescriptionId":1,"name":"pain killers"},
            //         name:'Penadol'
            //     },
            //     {
            //         prescriptionId:2,
            //         category:{"prescriptionId":1,"name":"pain killers"},
            //         name:'piriton'
            //     },
            //     {
            //         prescriptionId:3,
            //         category:{"prescriptionId":1,"name":"hart killers"},
            //         name:'aspine'
            //     }
            //
            // ];

            //creating unique elemets for categoryArray
            $scope.CategoryArray = [];
            $scope.uniqueCategory=[];
            for(var i=0;i<$scope.drugArray.length;i++){
                $scope.CategoryArray.push($scope.drugArray[i].category.name); //--------*******drugCategory Used*****---------//
            }

            $scope.uniqueCategory = $scope.CategoryArray.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });
            //----------------------------------------------

            $scope.makeDrugName=function (category) {
                $scope.DrugNameArray=[];

                for(var i=0;i<$scope.drugArray.length;i++)
                {
                    if($scope.drugArray[i].category.name == category){            //--------*******drugCategory Used*****---------//
                        $scope.DrugNameArray.push($scope.drugArray[i].name); //--------*******drugName Used*****---------//

                    }
                }
            }


            //count function
            $scope.calculateQuantity=function (values) {

                if(values.countOne!=null&&values.countTwo!=null&&values.countThree!=null&&values.countOne!=""&&values.countTwo!=null&&values.countThree!=null){

                    if(values.countOne>0&&values.countTwo>0&&values.countThree>0){
                        $scope.cal = values.countOne*values.countTwo*values.countThree;


                        if(values.content=='Liquid'){
                            $scope.quantity=$scope.cal+' ml';

                        }else if(values.content=='Tablet'){
                            $scope.quantity=$scope.cal+' tablets';

                        }
                    }
                    else{
                        //alert('Enter Correct Values To Do The Calculation.');
                        SweetAlert.swal({
                            title: "Enter Correct Values To Do The Calculation.",
                            type: "error",
                            timer: 2000,
                            showConfirmButton: false
                        }, function () {
                            SweetAlert.close();
                        });
                    }

                }
                else {
                    //alert('Enter Correct Values To Do The Calculation.');
                    SweetAlert.swal({
                        title: "Enter Correct Values To Do The Calculation.",
                        type: "error",
                        timer: 2000,
                        showConfirmButton: false
                    }, function () {
                        SweetAlert.close();
                    });
                }
            }

            //=============addBatch============================

            $scope.tempobj = {};
            $scope.stockid =0;
            $scope.addBatch=function(drugData,quantity,batchNo){

                //getting StockId from array
                for(var i=0;i< $scope.drugArray.length;i++){
                    if( $scope.drugArray[i].category.name==drugData.category && $scope.drugArray[i].name==drugData.name) { //--------*******drugCategory and name Used*****---------//
                        $scope.stockid=$scope.drugArray[i].prescriptionId;  //--------*******stock_id Used*****---------//
                        console.log($scope.stockid);
                    }
                }

                var mDate = new Date(drugData.manufactureDate);
                var eDate = new Date(drugData.expiredDate);


                var Manufacture = mDate.getFullYear() + "-" + (mDate.getMonth() + 1) + "-" + mDate.getDate();
                var expired = eDate.getFullYear() + "-" + (eDate.getMonth() + 1) + "-" + eDate.getDate();

                if( (new Date(expired).getTime() > new Date(Manufacture).getTime()))
                {
                    if(quantity!=""){

                        $scope.tempobj={

                            "stock_Id":$scope.stockid,
                            "batch_Id":batchNo,
                            "drug_category":drugData.category,
                            "drug_name":drugData.name,
                            "quantity":parseInt(quantity.split(" ")[0]),
                            "manufacture_date":new Date(Manufacture),
                            "expired_date":new Date(expired),
                            "issue_no":Number(new Date(expired))
                        };

                        $http.post(SETTINGS.SITE_URL+'/batches/',$scope.tempobj).then(function(result){

                          //  alert('Batch Successfully Added To Database');

                            SweetAlert.swal({
                                title: "Batch Successfully Saved.",
                                type: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }, function () {
                                SweetAlert.close();
                            });

                            //reset the pase to default values
                            $scope.drug={};
                            $scope.quantity="";
                            $scope.batchNo="";
                        });

                    }
                    else{
                        //alert('Calculate quantity.');
                        SweetAlert.swal({
                            title: "Calculate quantity.",
                            type: "error",
                            timer: 2000,
                            showConfirmButton: false
                        }, function () {
                            SweetAlert.close();
                        });
                    }

                }
                else{
                   // alert('Manufacture date should be lesser than expier date');

                    SweetAlert.swal({
                        title: "Manufacture date should be lesser than expire date",
                        type: "error",
                        timer: 2000,
                        showConfirmButton: false
                    }, function () {
                        SweetAlert.close();
                    });

                }
            }



        }
    });

