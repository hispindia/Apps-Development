isolateTransferApp.controller('editTransfer', function ($scope, $location, $timeout, storeService, MetadataService, dataStoreService) {

    $scope.data = storeService.get();
    $scope.selectedProgram = $scope.data.program.displayName;
    $scope.Ids = [];
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

    $scope.teiDataValue = {
        availableArray: $scope.data.rows.availableArray,
        selectedArray: $scope.data.rows.selectedArray
    }
    MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (orgUnit) {
        $timeout(function () {
            $scope.selectedOrgUnit.name = orgUnit.name;
            $scope.selectedOrgUnit.code = orgUnit.code;
        })
    })

    $scope.cancelTeiDataValue = function () {
        $location.path('/').search();
    };
    
    $scope.makeIds = function(rows, cols) {
        for(var i = 0; i < rows.length; i++) {
            for(var j = 0; j < cols.length; j++) {
                $scope.Ids[rows[i]][cols[j]] = "";
            }
        }
    }
    //makeIds(teiDataValue.selectedArray,);

})