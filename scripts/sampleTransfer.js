isolateTransferApp.controller('sampleTransfer', function ($scope, $location, $timeout, MetadataService, storeService, dataStoreService) {
    $scope.selectedOrgUnit = {
        id: "",
        name: "",
        code: ""
    }
    $scope.allOrgUnitValues = [];
    $scope.message = ""
    $scope.amrIds = [];
    $scope.checkDates = [];
    $scope.showModal = false;
    $scope.currentData = [];
    $scope.showToggle = function () {
        $scope.showModal = !$scope.showModal;
        if (!$scope.showModal) {
            data = $scope.currentData;
            if (data.length != 0) {
                storeService.set(data["0"])
                $location.path('/edit-transfer').search();
            }
        }
    }
    $scope.editTransfer = function (data,code) {
        data.disptachStatus.receivedDate = $scope.checkDates[data.BatchNo]
        if (data.disptachStatus.receivedDate != "" && data.disptachStatus.received != "Received") {
            data.disptachStatus.received = "Received"
            dataStoreService.get(code).then(function (response) {
                $scope.dataValue = response.map(child => {
                    if (child.BatchNo == data.BatchNo) {
                        child = data;
                    }
                    return child;
                })
                dataStoreService.updateInDataStore(code, $scope.dataValue).then(function (response) {
                    if (response.status == "200") {
                        $scope.message = "Received Date Added as " + data.disptachStatus.receivedDate;
                        $scope.currentData.push(data);
                        $scope.showToggle();
                    }
                })
            })
        } else if (data.disptachStatus.receivedDate == "") {
            $scope.currentData = [];
            $scope.message = "Please Fill The Received Date."
            $scope.showToggle();
        } else {
            storeService.set(data)
            $location.path('/edit-transfer').search();
        }
    }

    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedOrgUnit.id = selectedSelection["0"];
        loadOrgUnit();
    }, false);
    loadOrgUnit = function () {
        MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (orgUnit) {
            $timeout(function () {
                orgUnit.organisationUnits.forEach((orgUnitChildren,index) => {
                    
                    var currentOrgUnitCode = orgUnitChildren.code ? orgUnitChildren.code : "";
    
                    $scope.allOrgUnitValues[index] = [];
                    $scope.allOrgUnitValues[index]["OrgUnit"] = {
                        "id" : orgUnitChildren.id, 
                        "name" : orgUnitChildren.displayName, 
                        "code" : currentOrgUnitCode
                    }

                    if (currentOrgUnitCode) {
                        dataStoreService.get(currentOrgUnitCode).then(function (response) {
                            var allTeiDataValues = response;
                            if (allTeiDataValues != "No value contains in the selected feild") {
                                allTeiDataValues.forEach(child => {
                                    var id = [];
                                    var count = 0;
                                    $scope.amrIds[child.BatchNo] = [];
                                    $scope.checkDates[child.BatchNo] = child.disptachStatus.receivedDate;
                                    id[count] = []
                                    child.rows.selectedArray.forEach((data, index) => {
                                        if ((index + 1) % 6 == 0) {
                                            count++;
                                            id[count] = []
                                        }
                                        id[count].push(data.amrid);
                                    })
                                    var ar = id.map(ids => {
                                        return ids.join(",")
                                    })
                                    $scope.amrIds[child.BatchNo] = ar;
                                })
                            } else {
                                allTeiDataValues = ""
                            }
                            $scope.allOrgUnitValues[index]["allTeiDataValues"] = allTeiDataValues;
                        })
                    } else {
                        $scope.allOrgUnitValues[index]["allTeiDataValues"] = ""
                    }
                })
            })
        })
    }
});