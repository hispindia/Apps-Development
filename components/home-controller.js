/* global excelUpload, angular */

//Home controller
ExportCSVApp.controller('homeController',
    function ($rootScope,
        $scope,
        $http,
        $sanitize,
        $sce,
        $timeout,
        OrgUnitService,
        PeriodService) {

        $scope.orgUnitGroups = {};


		/* **************************************************************************************
		 **** RETRIEVING ROOT JSON AND NEEDED DATA ***********************************************
		 ************************************************************************************* **/
        $scope.dateOptions = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];
        var count1 = 0;



        //org unit group
        /*
        api/organisationUnitGroupSets.json?fields=id,name,code,organisationUnitGroups[id,name,attributeValues[attribute[id,name,code],value]]&paging=false
        for (var w = 0; w < data.programs.length; w++) {
            if (data.programs[w].attributeValues.length != 0) {
                for (var w1 = 0; w1 < data.programs[w].attributeValues.length; w1++) {
                    if (data.programs[w].attributeValues[w1].attribute.code == 'Report_program' && data.programs[w].attributeValues[w1].value == "true") {

                        prgNm = data.programs[w].name;
                        prgId = data.programs[w].id;
                        programName.push({ "name": prgNm, "id": prgId });
                    }
                }
            }
        }
        */
        //api/organisationUnitGroupSets.json?fields=id,name,code,organisationUnitGroups[id,name,code]&paging=false

        $scope.orgUnitGroups = [];
        $.get('../../organisationUnitGroupSets.json?fields=id,displayName,code,organisationUnitGroups[id,displayName,code]&paging=false', function (ougGrpSet) {
            var orgGroups = [];
            var orgUnitGroupId;
            var orgUnitGroupName;
            var orgUnitGroupCode;

            for (var i = 0; i < ougGrpSet.organisationUnitGroupSets.length; i++) {
                if( ougGrpSet.organisationUnitGroupSets[i].code === 'ExcelExportGroupSet'){
                    for (var j = 0; j < ougGrpSet.organisationUnitGroupSets[i].organisationUnitGroups.length; j++) {
                        orgUnitGroupId = ougGrpSet.organisationUnitGroupSets[i].organisationUnitGroups[j].id;
                        orgUnitGroupName = ougGrpSet.organisationUnitGroupSets[i].organisationUnitGroups[j].displayName;
                        orgUnitGroupCode = ougGrpSet.organisationUnitGroupSets[i].organisationUnitGroups[j].code;
                        orgGroups.push(["all", "ALL", "ALL"]);
                        orgGroups.push([orgUnitGroupId, orgUnitGroupName, orgUnitGroupCode]);
                        //$scope.csvExportAllOrgUnitGroups.push([orgUnitGroupId, orgUnitGroupName, orgUnitGroupCode]);
                    }
                }
            }

            var uniques = new Array();
            var itemsFound = {};
            for (var i = 0, l = orgGroups.length; i < l; i++) {
                var stringified = JSON.stringify(orgGroups[i]);
                if (itemsFound[stringified]) { continue; }
                uniques.push(orgGroups[i]);
                itemsFound[stringified] = true;
            }
            var i;
            var n = uniques.length;
            var tmp = new Array();
            for (i = 0; i < n; i++) {
                tmp.push({
                    id: uniques[i][0],
                    displayName: uniques[i][1],
                    code: uniques[i][2]
                });
            }
            var mObj = new Object;
            mObj.uniques = tmp;

            $scope.orgUnitGroups = mObj.uniques;

        }).fail(function (jqXHR, textStatus, errorThrown) {

        });

        console.log( "All CSV EXPORT Group - " + $scope.orgUnitGroups );
        /***************************************************************************************
		 **** RETRIEVING DATA FROM SELECTION ***********************************************
		 ************************************************************************************* **/

        for (var i = 1; i < $scope.orgUnitGroups.length; i++) {
            console.log( "All CSV EXPORT Group - " + $scope.orgUnitGroups[i].id + " -- " + $scope.orgUnitGroups[i].code + " -- " + $scope.orgUnitGroups[i].displayName );
        }

        // Get JSON data
        $http.get('data.json').then(function (response) {

            var jsonData = response.data;
            $scope.jsonObj = jsonData.headers;


        });

        // Get date 
        $scope.today = new Date();
        var dd = $scope.today.getDate();
        var mm = $scope.today.getMonth() + 1; //January is 0!
        var yyyy = $scope.today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        $scope.today = yyyy + "-" + mm + "-" + dd;

        // Get user

        $.get('../../me.json?paging=false', function (user) {

            $scope.userName = user.userCredentials.username;

        })

        var dataArray = [];
        var countNumber = 0;


        // Get data from selection

        $scope.controllerData = {};

        $scope.submit = function () {

            document.getElementById("loader").style.display = "block";

            if ($scope.controllerData.orgUnitGroup === undefined) {
                alert("Please select Organisation Unit Group");
                window.location.assign('#home.html');
            }
            if ($scope.controllerData.period === undefined) {
                alert("Please select Period");
                window.location.assign('#home.html');
            }
            else {
                $scope.orgGroupId = $scope.controllerData.orgUnitGroup.id;
                $scope.orgGroupDisplayName = $scope.controllerData.orgUnitGroup.displayName;
                $scope.periodId = $scope.controllerData.period;
                $scope.orgGroupCode = $scope.controllerData.orgUnitGroup.code;

                /*
                if ($scope.orgGroupId == "FrKiTIjDUxU") // Associated clinincs
                {

                    $scope.code = "AS205-0000";
                }

                if ($scope.orgGroupId == "oPJQbzZ20Ff") // Mobile clinincs
                {

                    $scope.code = "OU205-0000";
                }

                if ($scope.orgGroupId == "VnGNfO08w38") // Static clinincs
                {

                    $scope.code = "CL205-0000";
                }

                if ($scope.orgGroupId == "GhuHmwRnPBs") // CBD clinincs
                {

                    $scope.code = "CB205-0000";
                }
                */

                if ( $scope.orgGroupId === "all" &&  $scope.orgGroupDisplayName === "ALL" && $scope.orgGroupCode === "ALL" ) {

                    var orgUnitGroupsArray = [];
                    for (var i = 0; i < $scope.orgUnitGroups.length; i++) {
                        if( $scope.orgUnitGroups[i].id !== 'all'){
                            $scope.addJsonData( $scope.orgUnitGroups[i].id, $scope.periodId, $scope.orgUnitGroups[i].code);
                        }
                    }
                    /*
                    var orgUnitGroupsArray = [
                        { code: 'AS205-0000', orgId: 'FrKiTIjDUxU', period: $scope.periodId },
                        { code: 'OU205-0000', orgId: 'oPJQbzZ20Ff', period: $scope.periodId },
                        { code: 'CL205-0000', orgId: 'VnGNfO08w38', period: $scope.periodId },
                        { code: 'CB205-0000', orgId: 'GhuHmwRnPBs', period: $scope.periodId }
                    ];

                    for (var i = 0; i < orgUnitGroupsArray.length; i++) {
                        $scope.addJsonData(orgUnitGroupsArray[i].orgId, orgUnitGroupsArray[i].period, orgUnitGroupsArray[i].code);
                    }
                    */
                }
                else {
                    $scope.addJsonData($scope.orgGroupId, $scope.periodId, $scope.orgGroupCode);
                }
            }
        };

        // Get data from JSON

        $scope.addJsonData = function (orgGroup, period, code) {
            var jsonObj1 = $scope.jsonObj;
            countNumber = jsonObj1.length;

            var catId = '';

            for (var i = 0; i < jsonObj1.length; i++) {
                var dataelementCode = jsonObj1[i].dataelementCode;
                var indicator = jsonObj1[i].indicator;
                var categoryoptioncombo = jsonObj1[i].categoryoptioncombo;
                var attributeoptioncombo = jsonObj1[i].attributeoptioncombo;
                var og = orgGroup;
                var pe = period;
                var ce = code;

                if (categoryoptioncombo == "mYU1cpPLbA3") {
                    catId = "KqmIk38scuj"; // <25 years
                }
                if (categoryoptioncombo == "BpkvMcVXQgy") {
                    catId = "wzqerAiRUfl"; // >25 years
                }
                if (categoryoptioncombo == "X66r2y4EuwS") {
                    //catId = "wzqerAiRUfl,KqmIk38scuj"; // >25 years
                    catId = "";// for default sum of <25 years and >25 years
                }
                function reqListener() {
                    this.responseText;

                    var response = JSON.parse(this.responseText);
                    var resUrl = this.responseURL;
                    var value = 0;
					if( response.httpStatus != 'Conflict' && response.httpStatusCode != 409 && response.rows.length > 0 )
					{
						for (var i = 0; i < response.rows.length; i++) {
                        value += parseInt(response.rows[i][3]);
						}
					}
                    var resUrlList = resUrl.split('&');

                    var deCode = (resUrlList[5].split(':', 2))[1];
                    var orgCode = (resUrlList[6].split(':', 2))[1];
                    var coc = (resUrlList[7].split(':', 2))[1];

                    var dataObj = { "dataelement": deCode, "period": period, "orgunit": orgCode, "categoryoptioncombo": coc, "attributeoptioncombo": attributeoptioncombo, "value": value, "storedby": $scope.userName, "lastupdated": $scope.today, "comment": "false", "followup": "" };

                    dataArray.push(dataObj);

                    if ($scope.orgGroupId == "all") {
                        if (dataArray.length == countNumber * 4) {
                            Json2CSV(dataArray);

                        }
                    }
                    else {
                        if (dataArray.length == countNumber) {
                            Json2CSV(dataArray);

                        }
                    }
                }

                var oReq = new XMLHttpRequest();
                oReq.addEventListener("load", reqListener);
                oReq.onreadystatechange = function () {
                    if (oReq.readyState == 4 && oReq.status == 200) {

                    }
                }
                oReq.open("GET", "../../analytics.json?dimension=ID3CGIXZNp9:" + catId + ";&dimension=dx:" + indicator + ";&dimension=ou:OU_GROUP-" + og + "&filter=pe:" + pe + "&displayProperty=NAME&deCode:" + dataelementCode + "&orgCode:" + ce + "&coc:" + categoryoptioncombo);
                oReq.send();


                /*$.when(
                     $.getJSON("../../analytics.json?dimension=ID3CGIXZNp9:" + catId + ";&dimension=dx:" + indicator + ";&dimension=ou:OU_GROUP-" + og + "&filter=pe:" + pe + "&displayProperty=NAME&deCode:"+dataelementCode+"&orgCode"+ce+"&coc:"+categoryoptioncombo, {
                         format: "json"
                     
                     })
                 ).then(function (response) {
                     var value = 0;
                     for (var i = 0; i < response.rows.length; i++) {
                         value += parseInt(response.rows[i][3]);
                     }
 
                     var dataObj = { "dataelement": dataelementCode, "period": period, "orgunit": ce, "categoryoptioncombo": categoryoptioncombo, "attributeoptioncombo": attributeoptioncombo, "value": value, "storedby": $scope.userName, "lastupdated": $scope.today, "comment": "false", "followup": "" };
 
                     dataArray.push(dataObj);
 
 
                 }).done(function () {
                     if ($scope.orgGroupId == "all") {
                         if (dataArray.length == countNumber * 4) {
                             Json2CSV(dataArray);
 
                         }
                     }
                     else {
                         if (dataArray.length == countNumber) {
                             Json2CSV(dataArray);
 
                         }
                     }
 
                 })*/

            }

        }


        function Json2CSV(objArray) {
            var
                getKeys = function (obj) {
                    var keys = [];
                    for (var key in obj) {
                        keys.push(key);
                    }
                    return keys.join();
                }, array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
                , str = ''
                ;

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            str = getKeys(objArray[0]) + '\r\n' + str;

            var a = document.createElement('a');
            var blob = new Blob([str], { 'type': 'application\/octet-stream' });
            a.href = window.URL.createObjectURL(blob);
            a.download = 'result.csv';
            a.click();
            window.location.assign('#home.html');
            return true;

        }

    })
