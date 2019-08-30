isolateTransferApp.controller('editTransfer', function ($scope, $location, $timeout, storeService, MetadataService, dataStoreService) {

    $scope.data = storeService.get();
    if(!$scope.data.BatchNo) {
        $location.path('/').search();
    }
    $scope.selectedProgram = $scope.data.program.displayName;
    $scope.selectedDispatchDate = ""
    $scope.selectedOrgUnit = {
        id: $scope.data.key,
        name: "",
        code: ""
    }

    $scope.showPopup = false;
    $scope.checkReturn = false;

    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedOrgUnit.id = selectedSelection["0"];
        loadOrgUnit();
    }, false);

    $scope.selectedStartDate = $scope.data.startDate;
    $scope.selectedEndDate = $scope.data.endDate;
    $scope.teiDataValue = {
        availableArray: $scope.data.rows.availableArray,
        selectedArray: $scope.data.rows.selectedArray
    }
    $scope.dataValues = [];
    MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (orgUnit) {
        $timeout(function () {
            $scope.selectedOrgUnit.name = orgUnit.name;
            $scope.selectedOrgUnit.code = orgUnit.code;
        })
    })

    $scope.shiftRight = function () {
        $scope.teiDataValue.selectedArray.push($scope.selectedContinerLeft[0]);
        $scope.teiDataValue.availableArray = $scope.teiDataValue.availableArray.filter(id => $scope.selectedContinerLeft[0].amrid !== id.amrid)
    }
    $scope.shiftLeft = function () {
        $scope.teiDataValue.availableArray.push($scope.selectedContinerRight[0]);
        $scope.teiDataValue.selectedArray = $scope.teiDataValue.selectedArray.filter(id => $scope.selectedContinerRight[0].amrid !== id.amrid)
    }

    $scope.buttonLeft = function () {
        $scope.selectedContinerRight.forEach(child => {
            $scope.teiDataValue.availableArray.push(child);
            $scope.teiDataValue.selectedArray = $scope.teiDataValue.selectedArray.filter(id => child.amrid !== id.amrid)
        })
    }
    $scope.buttonRight = function () {
        $scope.selectedContinerLeft.forEach(child => {
            $scope.teiDataValue.selectedArray.push(child);
            $scope.teiDataValue.availableArray = $scope.teiDataValue.availableArray.filter(id => child.amrid !== id.amrid)
        })
    }
    $scope.buttonBoth = function () {
        if ($scope.teiDataValue.availableArray.length != 0) {
            $scope.teiDataValue.selectedArray.push(...$scope.teiDataValue.availableArray);
            $scope.teiDataValue.availableArray.length = 0;
        } else {
            $scope.teiDataValue.availableArray.push(...$scope.teiDataValue.selectedArray);
            $scope.teiDataValue.selectedArray.length = 0;
        }
    }

    $scope.checkDate = function(passedDate, scope) {
        var givenDate = new Date(passedDate);
        var date = new Date();
        if(givenDate > date) {
            $scope[scope] = ""
            $scope.message = "Please select a valid date.";
            $scope.switch();
            return;
        }
    }

    $scope.cancelTeiDataValue = function () {
        $location.path('/').search();
    };
    $scope.switch = function () {
        $scope.showPopup = !$scope.showPopup;
        if (!$scope.showPopup && $scope.checkReturn) {
            $location.path('/').search();
        }
    }
    $scope.transferTeiDataValue = function () {
        if ($scope.teiDataValue.selectedArray == 0) {
            $scope.message = "please select atleast one id.";
            $scope.switch();
            return;
        }
        if(!$scope.selectedDispatchDate) {
            $scope.message = "please select the Dispatch Date.";
            $scope.switch();
            return;
        }
        $("#loader").show();
        dataStoreService.get($scope.selectedOrgUnit.code).then(function (response) {
            var temp = [];
            var changedElementIndex = "";
            $scope.dataValue = response.map((data, index) => {
                if (data.BatchNo == $scope.data.BatchNo) {
                    changedElementIndex = index;
                    data.status = "DISPATCH";
                    data.rows = $scope.teiDataValue;
                    data.dispatchDate = $scope.selectedDispatchDate;
                    data.rows.availableArray = [];
                }
                return data;
            })
            temp =  $scope.dataValue[changedElementIndex];
            $scope.dataValue.splice(changedElementIndex,1);
            $scope.dataValue.unshift(temp);
            
            dataStoreService.updateInDataStore($scope.selectedOrgUnit.code, $scope.dataValue).then(function (response) {
                $("#loader").hide();
                if (response.status == "200") {
                    $scope.message = "Batch No. " + $scope.data.BatchNo + " dispatched."
                    $scope.checkReturn = true;
                    $scope.switch();
                } else {
                    $scope.message = "Something is wrong!";
                    $scope.checkReturn = true;
                    $scope.switch();
                }
            })
        })
    }
})