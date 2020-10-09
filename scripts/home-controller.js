
excelImport.controller('aggregatedataimportController', function ($rootScope,
    $scope,
    $timeout,
    $window,
    MetadataService) {
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
$scope.selectedPayLoad={
    orgUnit: "",
    period: ""
}
 $scope.years= []
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
            $scope.selectedPayLoad.orgUnit = ouRes.organisationUnits["0"].id;

        })
    });
    
    }, false);
    var date = new Date()
    for(let year=date.getFullYear(); year>2010; year--){
        $scope.years.push(year)
    }
    $scope.getPeriod = function(){
          
    }
      function parseCSV(file){
         Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                data = results;
                var headers = assembleHeaderInfo(data.meta.fields);
                var headersMapGrpByDomain = prepareMapGroupedById(headers,"domain");
                $timeout(function(){
                    $scope.initialSummary = prepareListFromMap(headersMapGrpByDomain);
                    $scope.importSummary = {};
                    $scope.importSummaryMap = [];
                    importHandler($scope.initialSummary,data.data,notificationCallBack);
                })
            }
        });
    }
    function parseExcel(file) { 
        var reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = function (e) {
            var data = e.target.result
            var workbook = XLSX.read(data, { type: 'binary'})
              workbook.SheetNames.forEach(function(sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);              
                for ( let object of JSON.parse(json_object)){
                    var measlesCasesDataElements =[];
                    var rubellaCasesDataElements = [];
                    var yearlyDataElements = []
                    var object3 = {};
                    var payLoad = [];
                    for( let property in object ){
                        var  object1 = {};
                        var object2 = {};
                        var object4 = {};
                        if(property == "Coverage 1st dose (%)") {
                            object4["Coverage 1st dose (%)"] = object[property]
                            yearlyDataElements.push(object4)
                        }
                        if(property == "Coverage 2nd dose (%)") {
                            object4["Coverage 2nd dose (%)"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "Population") {
                            object4["Population"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "Qualitative assessment of most recent SIA") {
                            object4["Qualitative assessment of most recent SIA"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "SIA - % sub-national units >95% coverage") {
                            object4["SIA - % sub-national units >95% coverage"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "SIA - Age (range) of target group") {
                            object4["SIA - Age (range) of target group"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "SIA - Coverage achieved (%)") {
                            object4["SIA - Coverage achieved (%)"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "SIA - Start and end date") {
                            object4["SIA - Start and end date"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "SIA - Supplementary immunization activities with measles/rubella vaccine?" ) {
                            object4["SIA - Supplementary immunization activities with measles/rubella vaccine?"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "SIA - Target population size") {
                            object4["SIA - Target population size"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property =="SIA - Vaccine" ) {
                            object4["SIA - Vaccine"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property =="Sub-national level" ) {
                            object4["Sub-national level"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "Vaccine target population") {
                            object4["Vaccine target population"] = object[property]
                            yearlyDataElements.push(object4)
                        } 
                        if(property == "Jan") {
                            object1.Jan = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Feb") {
                            object1.Feb = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Mar") {
                            object1.Mar = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "April") {
                            object1.April = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "May") {
                            object1.May = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "June") {
                            object1.Jane = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "July") {
                            object1.July = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Aug") {
                            object1.Aug = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Sept") {
                            object1.Sept = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Oct") {
                            object1.Oct = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Nov") {
                            object1.Nov = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "Dec") {
                            object1.Dec = object[property]
                            rubellaCasesDataElements.push(object1)
                        } 
                        if(property == "jan") {
                            object2.jan = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "feb") {
                            object2.jeb = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "mar") {
                            object2.mar = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "april") {
                            object2.april = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "may") {
                            object2.may = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "june") {
                            object2.june = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "july") {
                            object2.july = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "aug") {
                            object2.aug = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "sept") {
                            object2.sept = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "oct") {
                            object2.oct = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "nov") {
                            object2.nov = object[property]
                            measlesCasesDataElements.push(object2)
                        } 
                        if(property == "dec") {
                            object2.dec = object[property]
                            measlesCasesDataElements.push(object2)
                        }  
                    }
                    object3.orgUnit =  $scope.selectedPayLoad.orgUnit
                    object3.period =  $scope.selectedPayLoad.period
                    object3.rubellaCasesDataElements =rubellaCasesDataElements
                    object3.measlesCasesDataElements = measlesCasesDataElements
                    object3.yearlyDataElements = yearlyDataElements
                    payLoad.push(object3)
                    MetadataService.postExcelData(payLoad).then(function (res) {
                        $timeout(function () {
                          console.log('here is excel data responese', res)
                        })
                    });
                }
              })
        }
      
    }
    $scope.getSet = function () {
        $scope.selectedPayLoad.period = $("#period").val();
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
