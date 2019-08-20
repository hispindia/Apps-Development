
isolateTransferApp.directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});


isolateTransferApp.controller("createNewTransfer", function($scope, $location, $timeout, MetadataService, dataStoreService) {
    $scope.allPrograms = '';
    $scope.selectedProgram = '';
    $scope.selectedOrgUnit = {
        id:"",
        name: "",
        code: ""
    }
    $scope.selectedStartDate = "";
    $scope.selectedEndDate = "";
    $scope.teiDataValue = {
        availableArray : [],
        selectedArray: []
    }
    $scope.selectedContinerLeft = [];
    $scope.selectedContinerRight = [];
    $scope.checkList=  true;

    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedOrgUnit.id = selectedSelection["0"];
        loadOrgUnit();
    }, false);
    loadOrgUnit = function () {
        MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function(orgUnit) {
           $timeout(function() {
            $scope.selectedOrgUnit.name = orgUnit.name;
            $scope.selectedOrgUnit.code  = orgUnit.code;
           }) 
        })
    }
    
    MetadataService.getAllPrograms().then(function(program) {
        $scope.allPrograms = program.programs;
    })

    $scope.cancelTeiDataValue = function() {
        $location.path('/').search();
    }

 
    $scope.submitTeiDataValue = function() {
       if(!$scope.selectedProgram.id || !$scope.selectedOrgUnit.id || !$scope.selectedStartDate || !$scope.selectedEndDate) {
           alert("Please Select all Fields!");
           return;
       }
       if($scope.selectedStartDate > $scope.selectedEndDate) {
           alert("OOPS! Dates not Selected correctly");
           return;
       }
        var params = "var=program:" + $scope.selectedProgram.id + "&var=startdate:"+$scope.selectedStartDate+"&var=enddate:"+$scope.selectedEndDate;

        MetadataService.getSQLView("EFanvAXeCoj",params).then(function(response) {
            var dataKey = [];
            //clearing out previous data if available
            $scope.teiDataValue.availableArray.length = 0;
            $scope.teiDataValue.selectedArray.length = 0;

            //Assigning Object for "$scope.dataValue" where key is the "heaser" and value is the "rows" of the response
            for(let header of response.listGrid.headers) {
                dataKey.push(header.name);
            }

            for(let rows of response.listGrid.rows) {
                let obj = {};
                for(let i = 0; i < rows.length; i++) {
                    obj[dataKey[i]] = rows[i];
                }
                $scope.teiDataValue.availableArray.push(obj);
            }
        })
        $timeout(function() {
            if($scope.teiDataValue.availableArray.length == 0) {
                alert("No data to display!");
                return;
            }
            
            $("#content").show();

        },1000)
    }

    $scope.shiftRight = function() {
            $scope.teiDataValue.selectedArray.push($scope.selectedContinerLeft[0]);
            $scope.teiDataValue.availableArray = $scope.teiDataValue.availableArray.filter(id => $scope.selectedContinerLeft[0].amrid !== id.amrid)
        
    }
    $scope.shiftLeft = function() {
            $scope.teiDataValue.availableArray.push($scope.selectedContinerRight[0]);
            $scope.teiDataValue.selectedArray = $scope.teiDataValue.selectedArray.filter(id => $scope.selectedContinerRight[0].amrid !== id.amrid)
      
    }

    $scope.buttonLeft = function() {
        $scope.selectedContinerRight.forEach(child => {
            $scope.teiDataValue.availableArray.push(child);
            $scope.teiDataValue.selectedArray = $scope.teiDataValue.selectedArray.filter(id => child.amrid !== id.amrid)
        })
    }
    $scope.buttonRight = function() {
        $scope.selectedContinerLeft.forEach(child => {
            $scope.teiDataValue.selectedArray.push(child);
            $scope.teiDataValue.availableArray = $scope.teiDataValue.availableArray.filter(id => child.amrid !== id.amrid)
        })
    }
    $scope.buttonBoth = function() {
        if($scope.teiDataValue.availableArray.length != 0) {
            
                $scope.teiDataValue.selectedArray.push(...$scope.teiDataValue.availableArray);
                $scope.teiDataValue.availableArray.length = 0;
          
        } else {
                $scope.teiDataValue.availableArray.push(...$scope.teiDataValue.selectedArray);
                $scope.teiDataValue.selectedArray.length = 0;
           
        }
    }

    $scope.createTeiDataValue = function() {
        if($scope.teiDataValue.selectedArray == 0) {
            alert("please select atleast one id");
            return;
        }
            var batchNo =  $scope.selectedOrgUnit.code + "" + Math.floor(Math.random()*100000);
            var date = new Date();
            var month = date.getMonth() + 1;
            month = month>=10 ? month :"0"+ month;
            var year = date.getFullYear();
            var day = date.getDate();
            var createDate = year + "-" + month + "-" + day;
            var dataPush = {};
            dataPush[$scope.selectedOrgUnit.code] = [{
                key: $scope.selectedOrgUnit.id,
                BatchNo:batchNo,           
                startDate: $scope.selectedStartDate,
                endDate: $scope.selectedEndDate,
                status: "CREATE",
                program: $scope.selectedProgram,
                rows: $scope.teiDataValue,
                createdDate: createDate,
                dispatchDate:"",
                disptachStatus: {
                    received : "Not Received",
                    receivedDate: ""
                }
            }]
            dataStoreService.saveInDataStore($scope.selectedOrgUnit.code, dataPush).then( function(response, status) {
                
                return;
            })
        

    }

})