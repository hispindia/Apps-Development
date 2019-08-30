isolateTransferApp.controller('sampleTransfer', function ($scope, $location, $timeout, MetadataService, storeService, dataStoreService) {
    $scope.selectedOrgUnit = {
        id: "",
        name: "",
        code: ""
    }
    $scope.message = "";
    $scope.amrIds = [];
    $scope.checkDates = [];
    $scope.showModal = false;
    $scope.currentData = [];
    $scope.programUidForDisplay = "";
    $scope.userUid = "";
    $scope.noRecordMsg = "No Record Found";
    $scope.displayProgramList = "NO";
    $scope.checkReturn = false;


    $scope.showToggle = function () {
        $scope.showModal = !$scope.showModal;
        if (!$scope.showModal && $scope.checkReturn) {
            data = $scope.currentData;
            if (data.length != 0) {
                $("#loader").show();
                $timeout(() => {
                    storeService.set(data["0"])
                    $location.path('/edit-transfer').search();
                }, 1000);
            }
        }
    };

    $scope.checkDate = function (passedDate, key) {
        var givenDate = new Date(passedDate);
        var date = new Date();
        if (givenDate > date) {
            $scope.checkDates[key] = ""
            $scope.message = "Please select valid date.";
            $scope.showToggle();
            return;
        }
    }


    initializingApps();

    $scope.editTransfer = function (data, code) {
        data.disptachStatus.receivedDate = $scope.checkDates[data.BatchNo]
        if (data.disptachStatus.receivedDate != "" && data.disptachStatus.received != "Received") {
            $("#loader").show();
            data.disptachStatus.received = "Received"
            dataStoreService.get(code).then(function (response) {
                $scope.dataValue = response.map(child => {
                    if (child.BatchNo == data.BatchNo) {
                        child = data;
                    }
                    return child;
                })
                dataStoreService.updateInDataStore(code, $scope.dataValue).then(function (response) {
                    $("#loader").hide();
                    if (response.status == "200") {
                        $scope.message = "Batch No - " + data.BatchNo + " Received on -  " + data.disptachStatus.receivedDate;
                        $scope.currentData.push(data);
                        $scope.checkReturn = true;
                        $scope.showToggle();
                    }
                })
            })
        } else if (data.disptachStatus.receivedDate == "") {
            $scope.currentData = [];
            $scope.message = "Please Fill The Received Date."
            $scope.showToggle();
        } else {
            $("#loader").show();
            $timeout(() => {
                storeService.set(data)
                $location.path('/edit-transfer').search();
            }, 1000)
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
                $scope.allOrgUnitValues = [];
                orgUnit.organisationUnits.forEach((orgUnitChildren, index) => {

                    var currentOrgUnitCode = orgUnitChildren.code ? orgUnitChildren.code : "";

                    $scope.allOrgUnitValues[index] = [];
                    $scope.allOrgUnitValues[index]["OrgUnit"] = {
                        "id": orgUnitChildren.id,
                        "name": orgUnitChildren.displayName,
                        "code": currentOrgUnitCode
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
                        $scope.allOrgUnitValues["allTeiDataValues"] = "";

                    }
                })
            })
        })
    }


    // initializing Apps
    function initializingApps(teiUid, programUid, eventUid, deUid, deValue) {

        $.ajax({
            async: false,
            type: "GET",
            url: '../../../api/me.json?fields=id,name&paging=false',
            success: function (meResponse) {

                if (meResponse.id != undefined) {
                    $scope.userUid = meResponse.id;

                    $.ajax({
                        async: false,
                        type: "GET",
                        url: '../../../api/programs.json?fields=id,name,userAccesses&paging=false',
                        success: function (programResponse) {

                            if (programResponse.programs != undefined && programResponse.programs.length != 0) {
                                for (var j = 0; j < programResponse.programs.length; j++) {

                                    if (programResponse.programs[j].userAccesses != undefined &&
                                        programResponse.programs[j].userAccesses.length != 0) {

                                        for (var k = 0; k < programResponse.programs[j].userAccesses.length; k++) {
                                            if (programResponse.programs[j].userAccesses[k].userUid === $scope.userUid) {

                                                $scope.programUidForDisplay = programResponse.programs[j].id;
                                                $scope.displayProgramList = "YES";
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        error: function (meResponse) {
                            console.log("Error in API:", meResponse);
                        }
                    });
                }
            },
            error: function (meResponse) {
                console.log("Error in API:", meResponse);
            }

        });

        console.log($scope.userUid + " -- " + $scope.programUidForDisplay);


    }


});