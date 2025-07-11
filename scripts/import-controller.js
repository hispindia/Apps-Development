/**
 * updated by mithilesh on 2020-05-18.
 */
excelImport
    .controller('importController', function ($rootScope, $http,$timeout,
                                              $scope,MetadataService
    ) {

        $scope.orgUnitMap = [];
        $scope.dataElementMap = [];
        $scope.logs = [];
        function parseCSV(file) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    data = results
                    console.log('here is data', data);
                }
            })
        }

        function parseExcel(file) {

            MetadataService.loadOrgUnits().then(function (responseOrgUnitMap) {
                //$timeout(function () {
                    $scope.orgUnitMap = responseOrgUnitMap;
                    MetadataService.loadDataElements().then(function (responseDataElementMap) {
                        //$timeout(function () {
                            $scope.dataElementMap = responseDataElementMap;
                        //},2000);
                    });

                //},2000);
            });

            var reader = new FileReader()
            reader.readAsBinaryString(file)
            reader.onload = function (e) {
                var data = e.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                })
                workbook.SheetNames.forEach(function (sheetName) {

                    //if( sheetName === 'dataValueSetIPPF' ){
                        $('#dataValueSetOutPut').attr('style', 'display:none !important');
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        let objectKeys = Object.keys(XL_row_object["0"]);
                        //console.log("objectKeys : " + objectKeys );
                        //let importCount = 1;
                        //let str = '2022-01-01';
                        //let res = str.replace(/-/g, "");
                        //res = 20220101

                        $scope.selectedPeriod = $('#importPeriod option:selected').text();
                        let dataValues = [];
                        $scope.logs = [];
                        //$scope.logs[0]["head"] = [];
                        //$scope.logs[1]["head"] = [];
                        //$scope.logs[2]["head"] = [];
                        //$scope.logs[1]["body"] = [];
                        //$scope.logs[2]["tail"] = [];
                        //XL_row_object.forEach(row => {
                        for(let row = 5; row < XL_row_object.length; row++) {
                            let dataElementRow = 0;
                            let orgUnitRow = 0;
                            for (let i = 0; i < objectKeys.length-1; i++) {
                                let dataElementColumn = i+1;
                                let dataValue = {};
                                if (XL_row_object[row][objectKeys[i]] !== undefined && XL_row_object[row][objectKeys[i]] !== "") {
                                    dataValue.dataElement = $scope.dataElementMap[objectKeys[i]];
                                    dataValue.categoryOptionCombo = 'HllvX50cXC0';
                                    dataValue.period = $scope.selectedPeriod;
                                    dataValue.orgUnit = $scope.orgUnitMap[XL_row_object[row][undefined]];
                                    dataValue.value = XL_row_object[row][objectKeys[i]];
                                    dataValues.push(dataValue);
                                }
                            }
                        }

                        //$scope.logs[0] = "DataValueSet Import Start"
                        let dataValueSet = {};
                        dataValueSet.dataValues = dataValues;
                        console.log( " final dataValues length : " + dataValues.length + " final dataValueSet length : " + dataValueSet.length);
                        //console.log(" final dataValueSet : " + JSON.stringify(dataValueSet) );
                        let dataJSON = JSON.stringify(dataValueSet);

                        $timeout(function () {
                            $scope.dataValueSetStart = "dataValueSet Import start for dataValues.length " + dataValues.length;
                            //$scope.dataValueSetConflicts = "Conflicts/ Error : " ;
                        });

                        //$scope.logs[1] = "dataValueSet Import for " + dataValues.length;
                        $('#dataValueSetOutPut').attr('style', 'display:block !important');
                        $.ajax({
                            type: "POST",
                            async: false,
                            dataType: "json",
                            contentType: "application/json",
                            data: dataJSON,
                            url: '../../dataValueSets',

                            success: function (response) {
                                //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );

                                console.log("response : " + response);
                                console.log("conflicts : " + response.conflicts);

                                let impCount = response.response.importCount.imported;
                                let upCount = response.response.importCount.updated;
                                let igCount = response.response.importCount.ignored;
                                let conflictsDetails   = response.response.conflicts;

                                console.log(  "impCount - " + impCount + " upCount - " + upCount + " igCount - " + igCount + " conflictsDetails - " + conflictsDetails  );
                                $scope.dataValueSetComplete = "dataValueSet Import Completed with " + "Import Count - " + impCount + " Update Count - " + upCount + " Ignore Count - " + igCount;
                                $('#dataValueSetOutPut').attr('style', 'display:block !important');
                                //$scope.logs[2] = "dataValueSet Import Complete for '" + "impCount - " + impCount + " upCount - " + upCount + " igCount - " + igCount + " conflictsDetails - " + conflictsDetails;
                            },
                            error: function (response) {
                                console.log("error : " + JSON.stringify(response.responseJSON.response.conflicts) );
                                console.log("error : " + JSON.stringify(response.responseJSON.response.conflicts, null,2) );
                                //console.log("error : " + JSON.parse(response.responseJSON.response.conflicts) );

                                //$scope.logs[2] = "error : " + response.responseJSON.message;
                                $scope.dataValueSetConflicts = "Conflicts/ Error : " + JSON.stringify(response.responseJSON.response.conflicts, null, 2);
                                $('#dataValueSetOutPut').attr('style', 'display:block !important');
                            },
                            warning: function (response) {
                                console.log("warning : " + response.responseJSON.conflicts );
                                $scope.dataValueSetConflicts = "Conflicts/ Error : " + JSON.stringify(response.responseJSON.response.conflicts, null, 2);
                                $('#dataValueSetOutPut').attr('style', 'display:block !important');
                                //$scope.logs[0]["body"] = "error : " + response.responseJSON.message;
                            }
                        });

                        $('#loader').attr('style', 'display:none !important');

                    //}

                    // Here is your object

                    //    console.log('here is data', data);
                })
            }
        }
        $scope.getSet = function () {
            var file = document.getElementById('upload').files[0];
            var selectedPeriod = $('#importPeriod option:selected').val();
            if (selectedPeriod === "-1") {
                alert('Please Choose a Period!')
                return
            }
            if (!file) {
                alert('Please Choose a File!')
                return
            }

            switch (file.type) {
                case 'text/csv':
                    $('#loader').attr('style', 'display:block !important');

                    parseCSV(file)
                    $('#dataValueSetOutPut').attr('style', 'display:block !important');
                    break
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                case 'application/vnd.ms-excel':
                    $('#loader').attr('style', 'display:block !important');

                    parseExcel(file)
                    $('#dataValueSetOutPut').attr('style', 'display:block !important');
                    break
                default:
                    $('#loader').attr('style', 'display:block !important');

                    alert('Unsupported Format')
                    break
            }

        }
    })

/*
age calculation on current date and date of birth
    let age_dob = teiAttributeValues["DfXY7WHFzyc"]; // date format - '2023-01-01'
    console.log(age_dob, sex,  organismDataValue);

    let dateDiff_ms = Date.now() - new Date(age_dob).getTime();
    let age_diff = new Date(dateDiff_ms);

    let calculatedAge = Math.abs(age_diff.getUTCFullYear() - 1970);

    function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

console.log(calculate_age(new Date(1982, 11, 4)));

console.log(calculate_age(new Date(1962, 1, 1)));

    let dateDiff_ms = new Date(sampleDate).getTime() - new Date(age_dob).getTime();
    let age_diff = new Date(dateDiff_ms);

    let calculatedAge = Math.abs(age_diff.getUTCFullYear() - 1970);
 */