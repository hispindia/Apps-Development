

isolateTransferApp.controller('sampleTransfer', function ($scope, $location, $timeout, MetadataService, storeService, dataStoreService) {
    $scope.selectedOrgUnit = {
        id: "",
        name: "",
        code: ""
    }
    $scope.storePrintValues = [];
    $scope.allTeiDataValues = [];
    $scope.amrIds = [];
    $scope.datesamrIds = [];
    $scope.selectedEventUID = {};
    $scope.showModal = false;

    $scope.editTransfer = function (data) {
        if (data.disptachStatus.receivedDate != "" && data.disptachStatus.received != "Received") {
            data.disptachStatus.received = "Received"
            dataStoreService.get($scope.selectedOrgUnit.code).then(function (response) {
                $scope.dataValue = response.map(child => {
                    if (child.BatchNo == data.BatchNo) {
                        child = data;
                    }
                    return child;
                })
                dataStoreService.updateInDataStore($scope.selectedOrgUnit.code, $scope.dataValue).then(function(response) {    
                    if(response.status == "200") {
                        storeService.set(data)
                        $location.path('/edit-transfer').search();
                    }
                })
            })
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
                $scope.selectedOrgUnit.name = orgUnit.name;
                $scope.selectedOrgUnit.code = orgUnit.code;

                dataStoreService.get($scope.selectedOrgUnit.code).then(function (response) {
                    $scope.allTeiDataValues = response;
                    $scope.allTeiDataValues.forEach(child => {
                        var id = [];
                        var count = 0;
                        $scope.amrIds[child.BatchNo] = [];
                        $scope.datesamrIds[child.BatchNo] = ""
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
                })
            })
        })
    }
});