isolateTransferApp.controller('editTransfer', function ($scope, $location, $timeout, storeService, MetadataService, dataStoreService) {

    $scope.data = storeService.get();
    $scope.selectedProgram = $scope.data.program.displayName;
    $scope.selectedOrgUnit = {
        id: $scope.data.key,
        name: "",
        code: ""
    }

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

    $scope.cancelTeiDataValue = function () {
        $location.path('/').search();
    };
    $scope.transferTeiDataValue = function () {
        var date = new Date();
        var month = date.getMonth() + 1;
        month = month >= 10 ? month : "0" + month;
        var year = date.getFullYear();
        var day = date.getDate();
        var dispatchDate = year + "-" + month + "-" + day;

        dataStoreService.get($scope.selectedOrgUnit.code).then(function (response) {
            $scope.dataValue = response.map(data => {
                if (data.BatchNo == $scope.data.BatchNo) {
                    data.status = "DISPATCH",
                        data.rows = $scope.teiDataValue,
                        data.dispatchDate = dispatchDate
                }
                return data;
            })
            dataStoreService.updateInDataStore($scope.selectedOrgUnit.code, $scope.dataValue).Then(function () {

            })
        })
    }
})