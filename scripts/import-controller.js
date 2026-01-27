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
        // for add option Group

        /*
        $scope.loading = true;

        MetadataService.getOrgUnitGrpMembers().then(function (orgUnitGroupMembers) {

            $timeout(function () {
                $scope.orgUnits = [
                    { id: 'pWtzmP5XVRC', name: 'ALL' }
                ].concat(orgUnitGroupMembers || []);

                $scope.selectedOrgUnit = $scope.orgUnits[0];
                $scope.loading = false;
            });

        });
        */

        $scope.loading = true;

        MetadataService.getOrgUnitGrpMembers().then(function (orgUnitGroupMembers) {

            $timeout(function () {
                $scope.orgUnits = orgUnitGroupMembers || [];
                $scope.orgUnits.unshift({
                    id: 'pWtzmP5XVRC',
                    name: 'ALL'
                });

                $scope.selectedOrgUnit = $scope.orgUnits[0];
                $scope.loading = false;
            });
        });


        function postDataValueSet() {
            /*
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
            */

            //http://202.166.205.218/hmisdemo/api/dataValueSets.json?orgUnitGroup=pWtzmP5XVRC&dataSet=ULiKMH5cPL4&period=208209
            $scope.selectedPeriod = $('#importPeriod option:selected').text();
            var orgUnitGroup = "pWtzmP5XVRC";
            var dataset = "ULiKMH5cPL4";
            var isoMonthlyPeriod = $scope.selectedPeriod;
            var dataValueSetUrl = "";

            if( $scope.selectedOrgUnit.name === 'ALL'){
                dataValueSetUrl = '../../dataValueSets.json?orgUnitGroup=' + $scope.selectedOrgUnit.id + "&dataSet=" +dataset +"&period=" + isoMonthlyPeriod+ "";
            }
            else{
                dataValueSetUrl = '../../dataValueSets.json?orgUnit=' + $scope.selectedOrgUnit.id + "&dataSet=" +dataset +"&period=" + isoMonthlyPeriod+ "";
            }
            //alert( " dataValueSetUrl --" + dataValueSetUrl )
            $.ajax({
                type: "GET",
                async: false,
                url: dataValueSetUrl,
                //url: '../../dataValueSets.json?orgUnitGroup=' + orgUnitGroup + "&dataSet=" +dataset +"&period=" + isoMonthlyPeriod+ "",
                success: function (dataValueSetsResponse) {
                   let dataValues = dataValueSetsResponse.dataValues;

                    //$scope.logs[0] = "DataValueSet Import Start"
                    let dataValueSet = {};
                    dataValueSet.dataValues = dataValues;
                    console.log( " final dataValues length : " + dataValues.length + " final dataValueSet length : " + dataValueSet.dataValues.length);
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
                        //async: false,
                        dataType: "json",
                        contentType: "application/json",
                        data: dataJSON,
                        url: '../../dataValueSets',
                        success: function (response) {

                            let impCount = response.response.importCount.imported;
                            let upCount = response.response.importCount.updated;
                            let igCount = response.response.importCount.ignored;

                            $timeout(function () {
                                $scope.loading = false;
                                $scope.dataValueSetComplete =
                                    "DataValueSet Import Completed with Import: " +
                                    impCount + ", Update: " + upCount + ", Ignore: " + igCount;
                            });
                        },
                        error: function (response) {
                            $timeout(function () {
                                $scope.loading = false;
                                $scope.dataValueSetConflicts =
                                    JSON.stringify(response.responseJSON.response.conflicts, null, 2);
                            });
                        }
                    });

                    //$('#loader').attr('style', 'display:none !important');
                },
                error: function (optionGroupResponse) {
                    console.log(  " -- Error!: " +  JSON.stringify( optionGroupResponse ) );
                },
                warning: function (optionGroupResponse) {
                    console.log(  " -- Error!: " +  JSON.stringify( optionGroupResponse ) );
                }
            });

        }

        $scope.getSet = function () {
            var selectedPeriod = $('#importPeriod option:selected').val();
            if (!$scope.selectedOrgUnit || !$scope.selectedOrgUnit.id) return;
            //alert($scope.selectedOrgUnit.id + "--" + $scope.selectedOrgUnit.name)
            if (selectedPeriod === "-1") {
                alert('Please Choose a Period!');
                return;
            }

            $scope.loading = true;
            $scope.dataValueSetStart = "";
            $scope.dataValueSetComplete = "";
            $scope.dataValueSetConflicts = "";

            postDataValueSet();
        };

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