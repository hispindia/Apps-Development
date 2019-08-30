isolateTransferApp.controller('sampleSentForQualityCheck', function ($scope, $location, $timeout, MetadataService, dataStoreService) {
    $scope.selectedOrgUnit = {
        id: "",
        name: "",
        code: ""
    }
    $scope.storePrintValues = [];
    $scope.allTeiDataValues = [];
    $scope.amrIds = [];
    $scope.selectedEventUID = {};
    $scope.showModal = false;
    $scope.dispatchnewSample = function () {
        $location.path('/').search();
    }
    $scope.sampleSentForQualityCheck = function () {
        $location.path('/sample-sent-for-quality-check').search();
    }
    $scope.showToggle = function (data) {
        var optionValue = [];
        $scope.showTypes = [];
        $scope.storePrintValues = data;
        if (data == undefined) {

            $scope.showModal = !$scope.showModal;
        }
        if (data != undefined) {
            $("#loader").show();
            data.rows.selectedArray.forEach(child => {
                $scope.selectedEventUID[child["amrid"]] = child["eventuid"]
            })

            $scope.storePrintValues["totalSelectedArray"] = data.rows.selectedArray.length;
            MetadataService.getSQLView("p4HF5bVuL6x", "").then(function (data) {
                data.listGrid.rows.forEach(child => {
                    if (child[1] == null) child[1] = ""
                    optionValue[child[0]] = [];
                    optionValue[child[0]][child[1]] = child[2];
                })
            }).then(function () {
                for (let key in $scope.selectedEventUID) {
                    var params = "var=eventID:" + $scope.selectedEventUID[key];
                    MetadataService.getSQLView("Qxf3P0JENJT", params).then(function (data) {
                        data.listGrid.rows.forEach(child => {
                            if ($scope.showTypes[child[0]] == undefined) $scope.showTypes[child[0]] = [];
                            if (child[1] == "Organism") $scope.showTypes[child[0]]["Organism"] = optionValue[child["2"]][child["3"]]
                            if (child[1] == "Sample type") $scope.showTypes[child[0]]["Sample Type"] = optionValue[child["2"]][child["3"]]
                        })
                    })
                }
                $timeout(function () {
                    $("#loader").hide();
                    $scope.showModal = !$scope.showModal;
                }, 1000)
            })
        }
    }
    $scope.printAMR = function printContent(el) {
        var printcontent = document.getElementById(el).innerHTML;
        document.body.innerHTML = printcontent;
        window.print();
        location.reload();
    }
    selection.load();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedOrgUnit.id = selectedSelection["0"];
        loadOrgUnit();
    }, false);
    loadOrgUnit = function () {
        $("#loader").show();
        MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (orgUnit) {
            $timeout(function () {
                $scope.selectedOrgUnit.name = orgUnit.name;
                $scope.selectedOrgUnit.code = orgUnit.code;

                dataStoreService.get($scope.selectedOrgUnit.code).then(function (response) {
                    $scope.allTeiDataValues = response;

                    if ($scope.allTeiDataValues != "No value contains in the selected feild") {
                        $scope.allTeiDataValues.forEach(child => {
                            var id = [];
                            var count = 0;
                            $scope.amrIds[child.BatchNo] = [];
                            id[count] = []
                            child.rows.selectedArray.forEach((data, index) => {
                                id[count].push(data.amrid);
                                if ((index + 1) % 5 == 0) {
                                    count++;
                                    id[count] = []
                                }
                            })
                            var ar = id.map(ids => {
                                return ids.join(",")
                            })
                            $scope.amrIds[child.BatchNo] = ar;
                        })

                    } else {
                        $scope.allTeiDataValues = ""

                    }

                    $("#loader").hide();
                })
            })
        })
    }
});