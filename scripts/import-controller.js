/**
 * Created by harsh on 6/5/16.
 */


excelImport.controller('importController', function ($rootScope,
    $scope,
    $timeout,
    $window,
    MetadataService) {
    // MetadataService.getRootOrgUnit().then(function (orgUnits) {
    //     ROOT_OU_UID = orgUnits[0].id;
    // })
    $scope.xlsxFile = undefined;
    $scope.requestStats = {
        requestCount: 0,
        successCount: 0,
        errorCount: 0
    };
$scope.selectedOrgUnit = {
        id: "",
        name: ""
 }
$scope.payLoad={
    orgUnit: "",
    period: ""
}
 $scope.years= []
 $("#firstTable").hide()
 $("#secondTable").hide()

selection.load(); 
$scope.TrackerPanel = function(){
    $location.path('/tracker-data-import').search();
}; 
$scope.AggregatedPanel = function(){
    $location.path('/aggregated-data-import').search();
}; 
$scope.GoBack = function(){
    $window.history.back();
}      
selection.setListenerFunction(function () {
    var selectedSelection = selection.getSelected();
    $scope.selectedOrgUnit.id = selectedSelection["0"];
    MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (ouRes) {
        $timeout(function () {
            $scope.selectedOrgUnit.name = ouRes.organisationUnits["0"].displayName;
            $scope.payLoad.orgUnit = ouRes.organisationUnits["0"].id;

        })
    });
    
    }, false);
    var date = new Date()
    for(let year=date.getFullYear(); year>2010; year--){
        $scope.years.push(year)
    }
    $scope.getPeriod = function(){
        $scope.payLoad.period = $("#period").val();  
    }
    function parseCSV(file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                data = results;
                var headers = assembleHeaderInfo(data.meta.fields);
                var headersMapGrpByDomain = prepareMapGroupedById(headers, "domain");

                $timeout(function () {
                    $("#firstTable").show()
                    $("#secondTable").show()
                    $scope.initialSummary = prepareListFromMap(headersMapGrpByDomain);
                    $scope.importSummary = {};
                    $scope.importSummaryMap = [];
                    importHandler($scope.initialSummary, data.data, notificationCallBack);
                })
            }
        });
    }

    function parseExcel(file) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = function (e) {
            var data = e.target.result;
            var wb = XLSX.read(data, { type: 'binary' });

            var data_sheet = XLSX.utils.sheet_to_json(wb.Sheets[DATA_SHEETNAME]);
            var metadata_sheet = XLSX.utils.sheet_to_json(wb.Sheets[METADATA_SHEETNAME]);

            if (metadata_sheet.length != 0) {
                var headers = assembleHeaderInfo(prepareKeyList(metadata_sheet[0], true));
            } else {
                var headers = assembleHeaderInfo(prepareKeyList(data_sheet[0]));

            }

            var headersMapGrpByDomain = prepareMapGroupedById(headers, "domain");
            $timeout(function () {
                $scope.initialSummary = prepareListFromMap(headersMapGrpByDomain);
                $scope.importSummary = {};
                $scope.importSummaryMap = [];
                importHandler($scope.initialSummary, data_sheet, notificationCallBack);
            })
        }

        function prepareKeyList(data, isMappingSeparate) {
            var list = [];
            for (key in data) {
                if (isMappingSeparate) {
                    list.push({ key: key, data: data[key] });
                } else {
                    list.push({ key: key, data: key });
                }
            }
            return list;
        }
    }
    $scope.getSet = function () {

        var file = document.getElementById('fileInput').files[0];

        if (!file) {
            alert("Error Cannot find the file!");
            return;
        }

        switch (file.type) {
            case "text/csv": parseCSV(file);
                break
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                parseExcel(file);
                break
            case "application/vnd.ms-excel":
                parseExcel(file);
                break
            default: alert("Unsupported Format");
                break
        }
    }

    function notificationCallBack(response) {
        var importStat = response.importStat;

        var summaryItem = {};
        summaryItem.domain = importStat.domain;
        summaryItem.metadata = (importStat.metadata);
        console.log(response.status);
        var conflicts = getConflicts(response);
        var reference = findReference(response);
        summaryItem.reference = reference;
        summaryItem.conflicts = conflicts;

        if (response.status == "OK") {
            summaryItem.httpResponse = response;
            $scope.requestStats.successCount = $scope.requestStats.successCount + 1;
        } else {
            if (response.responseText) {
                if (isJson(response.responseText)) {
                    summaryItem.httpResponse = JSON.parse(response.responseText);
                    $scope.requestStats.errorCount = $scope.requestStats.errorCount + 1;
                }
            }
        }


        summaryItem.status = findStatus(response);
        summaryItem.row = importStat.index;

        /* case for datavalue sets */
        if (response.dataSetComplete) {
            if (response.conflicts) {
                summaryItem.status = "Conflict";
                $scope.requestStats.errorCount = $scope.requestStats.errorCount + 1;
            } else {
                summaryItem.httpResponse = response;
                $scope.requestStats.successCount = $scope.requestStats.successCount + 1;
            }

        }

        if (!$scope.importSummary[importStat.index]) {
            $scope.importSummary[importStat.index] = [];
            // $scope.importSummaryMap[importStat.index] = $scope.importSummary[importStat.index];
            $scope.importSummary[importStat.index].push(summaryItem);
        } else {
            $scope.importSummary[importStat.index].push(summaryItem);
        }

        $timeout(function () {

            $scope.requestStats.requestCount = $scope.requestStats.requestCount + 1;
        })
    }

});
