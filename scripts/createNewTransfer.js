isolateTransferApp.controller("createNewTransfer", function ($scope, $location, $timeout, MetadataService, dataStoreService) {
    //$scope.allPrograms = [];
    $scope.selectedProgram = '';
    $scope.selectedStartDate = "";
    $scope.selectedEndDate = "";
    $scope.selectedContinerLeft = [];
    $scope.selectedContinerRight = [];
    $scope.selectedOrgUnit = {
        id: "",
        name: "",
        code: ""
    }
    $scope.teiDataValue = {
        availableArray: [],
        selectedArray: []
    }
    $scope.showPopup = false;
    $scope.checkReturn = false;

    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.allPrograms = [];
        $scope.selectedOrgUnit.id = selectedSelection["0"];

        $("#loader").show();
        loadOrgUnit();
        //alert( $scope.selectedOrgUnit.id );
        // lod programs based on selected orgUnit
        //$timeout(function () {
        var orgParam = "var=orgUid:" + $scope.selectedOrgUnit.id;
        MetadataService.getSQLView("YqMvHMg8RKU", orgParam).then(function (responsePrograms) {
            if (responsePrograms.listGrid.rows.length > 0) {
                for (var j = 0; j < responsePrograms.listGrid.rows.length; j++) {
                    $scope.allPrograms.push({
                        id: responsePrograms.listGrid.rows[j][0],
                        displayName: responsePrograms.listGrid.rows[j][1]
                    });
                }
            }
        });
        //}, )

    }, false);

    loadOrgUnit = function () {
        MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (orgUnit) {
            $timeout(function () {
                $scope.selectedOrgUnit.name = orgUnit.name;
                $scope.selectedOrgUnit.code = orgUnit.code;
                $("#loader").hide();
            });
        });
    };

    /*
    MetadataService.getAllPrograms().then(function (program) {
        $scope.allPrograms = program.programs;
    });
    */

    console.log($scope.allPrograms);
    $scope.cancelTeiDataValue = function () {
        $location.path('/').search();
    };

    $scope.checkDate = function (passedDate, scope) {
        var givenDate = new Date(passedDate);
        var date = new Date();
        if (givenDate > date) {
            $scope[scope] = ""
            $scope.message = "Please select a valid date.";
            $scope.switch();
            return;
        }
    }

    $scope.submitTeiDataValue = function () {
        if (!$scope.selectedProgram.id || !$scope.selectedOrgUnit.id || !$scope.selectedStartDate || !$scope.selectedEndDate) {
            $scope.message = "Please Select all Fields!";
            $scope.switch();
            return;
        }
        if ($scope.selectedStartDate > $scope.selectedEndDate) {
            $scope.message = "OOPS! Dates not Selected correctly";
            $scope.switch();
            return;

        }

        $("#loader").show();
        var params = "var=program:" + $scope.selectedProgram.id + "&var=orgUid:" + $scope.selectedOrgUnit.id + "&var=startdate:" + $scope.selectedStartDate + "&var=enddate:" + $scope.selectedEndDate;

        MetadataService.getSQLView("EFanvAXeCoj", params).then(function (response) {
            var dataKey = [];
            //clearing out previous data if available
            $scope.teiDataValue.availableArray.length = 0;
            $scope.teiDataValue.selectedArray.length = 0;

            //Assigning Object for "$scope.dataValue" where key is the "heaser" and value is the "rows" of the response
            for (let header of response.listGrid.headers) {
                dataKey.push(header.name);
            }

            for (let rows of response.listGrid.rows) {
                let obj = {};
                for (let i = 0; i < rows.length; i++) {
                    obj[dataKey[i]] = rows[i];
                }
                $scope.teiDataValue.availableArray.push(obj);
                
            }
        })
        $timeout(function () {
            if ($scope.teiDataValue.availableArray.length == 0) {
                $("#loader").hide();
                $scope.message = "No data to display!";
                $scope.switch();
                return;
            }
            $("#loader").hide();
            $("#content").show();

        }, 1000)
    }

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

    $scope.switch = function () {
        $scope.showPopup = !$scope.showPopup;
        if (!$scope.showPopup && $scope.checkReturn) {
            $location.path('/').search();
        }
    }

    $scope.createTeiDataValue = function () {
        if ($scope.teiDataValue.selectedArray == 0) {
            $scope.message = "please select atleast one id";
            $scope.switch();
            return;
        }
        if (!$scope.selectedOrgUnit.code) {
            $scope.message = "Code doesn't exist";
            $scope.switch();
            return;
        }
        $("#loader").show();
        var batchNo = $scope.selectedOrgUnit.code + "" + Math.floor(Math.random() * 100000);
        var date = new Date();
        var month = date.getMonth() + 1;
        month = month >= 10 ? month : "0" + month;
        var year = date.getFullYear();
        var day = date.getDate();
        var createDate = year + "-" + month + "-" + day;
        var dataPush = {};
        dataPush[$scope.selectedOrgUnit.code] = [{
            key: $scope.selectedOrgUnit.id,
            BatchNo: batchNo,
            startDate: $scope.selectedStartDate,
            endDate: $scope.selectedEndDate,
            status: "CREATE",
            program: $scope.selectedProgram,
            rows: $scope.teiDataValue,
            createdDate: createDate,
            dispatchDate: "",
            disptachStatus: {
                received: "Not Received",
                receivedDate: ""
            }
        }]
        dataStoreService.saveInDataStore($scope.selectedOrgUnit.code, dataPush).then(function (response) {
            $("#loader").hide();
            if (response.status == "200" || response.status == "201") {
                $scope.message = "Batch No. " + batchNo + " created.";
                $scope.checkReturn = true;
                $scope.switch();
            } else {
                $scope.message = "Something is wrong!";
                $scope.checkReturn = true;
                $scope.switch();
            }
        });


    }

})