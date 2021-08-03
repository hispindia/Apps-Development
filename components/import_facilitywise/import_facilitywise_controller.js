/* global excelUpload, angular */

$.ajaxSetup({
    async: false
});
var favorites = [];
var length1;
var length2;
var length3;
var count = 0;

//Controller for excel importing
excelUpload.controller('ImportFacilitywiseController',
    function ($rootScope,
        $scope,
        $timeout,
        $route,
        $filter,
        $http,
        ExcelMappingService,
        ValidationRuleService,
        CurrentSelection,
        ExcelReaderService,
        MetaDataFactory,
        orderByFilter,
        OrgUnitService,
        DialogService) {

		
        $scope.orgUnitGroups = {};
        $scope.orgUnitChildrens = {};
        $scope.childrenDataValues = [];
        $scope.dataSets = {};
        $scope.templates = {};
        $scope.history = {};
        $scope.financilaPeriodList = [];
        var dataSetSourceList = [];

        var cdsr = { completeDataSetRegistrations: [] };

        $scope.engAddress = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        $scope.confirmedUploads = [];
        $scope.authority = '';

        /*
        function orgUnitHasBeenSelected( orgUnitIds )
        {
            $scope.selectedOrgUnit = orgUnitIds;
        }
        selection.setListenerFunction( orgUnitHasBeenSelected );
         */

	/* **************************************************************************************
		**** RETRIEVING USER CREDIENTIAL DATA ***********************************************
		************************************************************************************* **/
		
	    //AURTORITY
    
		  $http({
		     method: 'GET',
		     url: '../../../api/me.json?fields=userCredentials[userRoles[authorities]]&paging=false',
		     headers: {'X-Parse-Application-Id':'XXXXXXXXXXXXX', 'X-Parse-REST-API-Key':'YYYYYYYYYYYYY'}
		  })
		    .then(function successCallback(response) {
		        $scope.userCredentials = response.data;
		        
		        angular.forEach($scope.userCredentials, function (value, key) {
		        
		          angular.forEach(value.userRoles, function (value1, key){
		        	
		        	angular.forEach(value1.authorities, function (value2, key){
		        	
			        	if (value2 == 'ALL') 
			            {
			               $scope.authority = 'ALL';
			               
			            }	
		        	});
		        	
		          });
		            
		            
		        });
		        
		        console.log(response.data);
		    }, function errorCallback(response) {
		        alert("Error connecting to API");
		    }); 

		/* **************************************************************************************
		 **** RETRIEVING ROOT JSON AND NEEDED DATA ***********************************************
		 ************************************************************************************* **/
        $scope.showStyle = function() {
            var style = {};
            if($scope.authority==="ALL") {
                style.width = '250px'; style.margin_top = '10px'; style.margin_bottom = '20px'; style.box_shadow = '0 0 3px #ccc'; style.height = '30px'; style.font_size = '13px'; style.padding_top = '5px';
            }
            else if($scope.authority != "ALL") {
                style.display = "none";
            }
            return style;
        }
        //templates
        $("#templateProgress").html("Retrieving all the saved templates...");
        ExcelMappingService.get('Excel-import-app-templates').then(function (tem) {
            if (!jQuery.isEmptyObject(tem))
                $scope.templates = tem;
            else
                $scope.templates = { templates: [] };

            console.log($scope.templates);

            //templates
            $("#templateProgress").html("Retrieving all the organisation units mapping data...");
            ExcelMappingService.get('Excel-import-app-orgunit-mapping').then(function (oum) {

                //history
                $("#templateProgress").html("Retrieving all the import history...");
                ExcelMappingService.get('Excel-import-app-history').then(function (his) {
                    $scope.history = jQuery.isEmptyObject(his) ? JSON.parse('{"history" : []}') : his;
                    //console.log(his);

                    //org unit group
                    $("#templateProgress").html("Fetching organisation unit groups...");
                    $.get('../../../api/organisationUnitGroups.json?fields=id,displayName,attributeValues[value,attribute[id,name,code]]&paging=false', function (orgGroup) {
                        console.log(orgGroup);
                        let orgUnitGrps =[];
                        for(let j=0;j<orgGroup.organisationUnitGroups.length;j++){
                            let val=orgGroup.organisationUnitGroups[j].attributeValues.length;
                            for (let i=0;i<val;i++){
                                let val1=orgGroup.organisationUnitGroups[j].attributeValues[i].attribute.code;
                                if( orgGroup.organisationUnitGroups[j].attributeValues.length !== 0){
                                    if (orgGroup.organisationUnitGroups[j].attributeValues[i].attribute.code === 'Excel_Import_OrgUnitGrp_Filter' && orgGroup.organisationUnitGroups[j].attributeValues[i].value === "true")
                                    {
                                        orgUnitGrps.push(orgGroup.organisationUnitGroups[j]);
                                    }
                                }
                            }
                        }

                        //$scope.orgUnitGroups = orgGroup.organisationUnitGroups;
                        $scope.orgUnitGroups = orgUnitGrps;

                        //datasets whith attributevalues="Excel_Import_DataSet_Filter"
                         $("#templateProgress").html("Fetching all the data sets...");
                         var datets =[];
			            $.get('../../../api/dataSets.json?fields=id,name,attributeValues[value,attribute[id,name,code]]&paging=false', function(ds){
				            for(var j=0;j<ds.dataSets.length;j++){
				                var val=ds.dataSets[j].attributeValues.length;
                                for (var i=0;i<val;i++)
								{  var val1=ds.dataSets[j].attributeValues[i].attribute.code;
									if( ds.dataSets[j].attributeValues.length!==0)
									{
									if (ds.dataSets[j].attributeValues[i].attribute.code === 'Excel_Import_DataSet_Filter' && ds.dataSets[j].attributeValues[i].value === "true")
									{
										datets.push(ds.dataSets[j]);
										
                                    }
                                }
							}
						}
                        var test=datets;
                        $scope.dataSets = datets;

                        //dataelements
                        $("#templateProgress").html("Fetching all the data elements...");
                        $.get('../../../api/dataElements.json?fields=id,name,shortName,categoryCombo[categoryOptionCombos[id,name]]&paging=false', function (ds) {
                            console.log(ds);
                            $scope.dataElements = ds.dataElements;
                            $scope.generateEnglishAddresses();
                            $scope.startBuilding();
                            $("#loader").hide();

                        }).
                        fail(function (jqXHR, textStatus, errorThrown) {
                            $("#templateProgress").html("Failed to fetch data elements ( " + errorThrown + " )");
                        });
                    }).
                    fail(function (jqXHR, textStatus, errorThrown) {
                        $("#templateProgress").html("Failed to fetch data sets ( " + errorThrown + " )");
                    });

                    }).
                    fail(function (jqXHR, textStatus, errorThrown) {
                        $("#templateProgress").html("Failed to fetch organisation unit groups ( " + errorThrown + " )");
                    });
                });
            });
        });
        //**************************************************************************************************************

        //building UIs
        $scope.startBuilding = function () {
            $("#templateProgress").html("Making things ready...");
            $.each($scope.dataSets, function (i, d) {
                //$("#imDataSetId").append("<option value='"+ d.id +"' > " + d.name +" </option>");
                $("#imDataSetId").append("<option value='" + d.id + "' > " + d.name + " </option>");
            });

            $.each($scope.orgUnitGroups, function (i, o) {
                $("#imOrgUnitGrp").append("<option value='" + o.id + "' > " + o.displayName + " </option>");
            });
        };

        //**************************************************************************************************************

        $scope.generatePeriods = function () {

            if ($("#imDataSetId").val() != "") {
                var url = "../../../api/dataSets/" + $("#imDataSetId").val() + ".json?fields=periodType,organisationUnits[id,name]&paging=false";
                $.get(url, function (d) {
                    $scope.dataSetOrganisationUnits = d.organisationUnits;

                    for (var i = 0; i < $scope.dataSetOrganisationUnits.length; i++) {
                        dataSetSourceList.push($scope.dataSetOrganisationUnits[i].id);
                    }
                    //printing periods ------------------
                    var periodType = d.periodType;
                    var today = new Date();
                    var stDate = "01/01/" + "2014";
                    var endDate = "01/01/" + (today.getFullYear() + 1);

                    var periods = "";

                    if (periodType == "Daily")
                        periods = daily(stDate, endDate);
                    else if (periodType == "Weekly")
                        periods = weekly(stDate, endDate);
                    else if (periodType == "Monthly")
                        periods = monthly(stDate, endDate);
                    else if (periodType == "Yearly")
                        periods = yearly(stDate, endDate);
                    else if (periodType == "Quarterly")
                        periods = quartly(stDate, endDate);
                    else if (periodType == "FinancialApril")
                        periods = financialApril(stDate, endDate);

                    $("#importPeriod").html("");
                    periods.split(";").forEach(function (p) {
                        var ps = periodType == 'Monthly' ? $scope.monthString(p) : p;
                        var h = "<option value='" + p + "'>" + ps + "</option>";
                        $("#importPeriod").append(h);
                    });

                    //prining templates ---------------------
                    var noTemplatesFound = true;
                    $('#importTemp').html("");
                    $scope.templates.templates.forEach(function (te) {
                        if (te.dataSet == $("#imDataSetId").val() && (te.orgUnitGroup == $("#imOrgUnitGrp").val() || $("#imOrgUnitGrp").val() == "all")) {
                            noTemplatesFound = false;
                            $('#importTemp').append($('<option>', {
                                value: te.id,
                                text: te.name
                            }));
                        }
                    });

                    if (noTemplatesFound) {
                        $('#importTemp').append($('<option>', {
                            value: -1,
                            text: "No templates found. Add one."
                        }));

                        $("#templatesDiv").removeClass("disabled");
                        $("#templatesDiv").addClass("disabled");
                    }
                    else {
                        $("#templatesDiv").removeClass("disabled");
                    }
                });

            }
        };

        $scope.filterOrgUnits = function () {
            var orgUnitGroupID = $("#imOrgUnitGrp").val();
            var parentUnitID = $scope.selectedOrgUnit.id;
            var url = "../../../api/organisationUnits.json?paging=false&fields=id,name&filter=parent.id:eq:" + parentUnitID + "&filter=organisationUnitGroups.id:eq:" + orgUnitGroupID + "";
            $.get(url, function (ous) {
                $scope.filteredOrgUnits = [];
                $scope.filteredOrgUnitIncludesSelected = ous.organisationUnits;
                $scope.filteredOrgUnitIncludesSelected.push($scope.selectedOrgUnit);
                if ($scope.filteredOrgUnitIncludesSelected.length) {
                    var htmlString = '<tr><td colspan="2" align="center"> Browse Files</td></tr>';
                    $.each($scope.filteredOrgUnitIncludesSelected, function (i, ou) {
                        //var importID = "orgUnit-"+i+"-file" ;
                        if( dataSetSourceList.indexOf( ou.id ) !== -1 ){
                            var importID = ou.id;
                            $scope.filteredOrgUnits.push(ou);
                            htmlString += '<tr> <td>' + ou.name + '</td> <td align="right"><input class="" style="width:75px;font-size:12px" id="' + ou.id + '" type="file" accept=".xls,.xlsx"/></td> </tr>';
                        }
                        /*
                        var importID = ou.id;
                        htmlString += '<tr> <td>' + ou.name + '</td> <td align="right"><input class="" style="width:75px;font-size:12px" id="' + ou.id + '" type="file" accept=".xls,.xlsx"/></td> </tr>';
                         */
                    });
                    //console.log("String : " + htmlString);
                    $("#confirmedUploadsContent").html(htmlString);
                    $("#confirmedUploadsDiv").attr("style", "width:300px;display:inline-block;float:right;max-height:500px;overflow-y:auto;padding:30px 10px 30px 10px");
                    $.each($scope.filteredOrgUnits, function (i, ou) {
                        var elementID = ou.id;
                        var fileID = document.getElementById(elementID);
                        fileID.addEventListener('change', function (e) {
                            handleInputFile(e, ou);
                            $("#loader").fadeOut();
                        }, false);
                    });
                } else {
                    var htmlString = '<tr><td colspan="2" align="center"> No OrgUnits found</td></tr>';
                    $("#confirmedUploadsContent").html(htmlString);
                }
                $("#confirmedUploadsDiv").attr("style", "width:300px;display:inline-block;float:right;height:540px;overflow-y:auto;padding:30px 10px 30px 10px");
                $("#confirmedUploadsDiv").removeClass("disabled");
                $("#form1").addClass("disabled");
                $("#templatesContentDiv").addClass("disabled");
                $("#nextBtn").hide();
                $("#imb").show();
                $("#cancelBtn").removeClass("disabled");
                $("#loader").fadeOut();
            });
        };

        $scope.monthString = function (pst) {
            var month = pst.substring(4, 6);
            var ms = "";

            if (month == "01")
                ms = "Jan";
            else if (month == "02")
                ms = "Feb";
            else if (month == "03")
                ms = "Mar";
            else if (month == "04")
                ms = "Apr";
            else if (month == "05")
                ms = "May";
            else if (month == "06")
                ms = "Jun";
            else if (month == "07")
                ms = "Jul";
            else if (month == "08")
                ms = "Aug";
            else if (month == "09")
                ms = "Sep";
            else if (month == "10")
                ms = "Oct";
            else if (month == "11")
                ms = "Nov";
            else if (month == "12")
                ms = "Dec";

            return ms + " " + pst.substring(0, 4);
        };

        //*****************************************************************************************

        // VALIDATIONS
        $scope.validatedMessage = [];
        $scope.isEverythingOK = true;

        $scope.validateAll = function (orgUnit, index) {
            
            var dataCells = [];
                $("#templateProgress").html("Validating sheet : " + orgUnit.name);

            if (orgUnit.result) {
                // extract all cell addresses and it's values
                /* *** */				
                orgUnit.result.forEach(function (r) {
                    var cell = {};
                    cell.address = r.split("=")[0];

                    if (r.split("=").length > 1)
                        cell.value = r.split("=")[1].slice(1).trim(); //There is an additional char in the value

                    dataCells.push(cell);
                    //confirmedUploads[item].dataCells = dataCells;
                    orgUnit.dataCells = dataCells;
                  
                    $scope.confirmedUploads.orgUnits[index] = orgUnit;
                });
            } else {
                $scope.isEverythingOK = false;
                $scope.validatedMessage.push("Something wrong with " + orgUnit.name + " excel sheet.");
            }

			/* *** */
            var selectedTemp = $scope.getTemplate($scope.confirmedUploads.TempVal);

            if (selectedTemp != "") {

                $.each(selectedTemp.DEMappings, function (i, dem) {

                    $("#templateProgress").html(orgUnit.name + " -> orgValidating data elements mapping - " + (i + 1) + " of " + selectedTemp.DEMappings.length);

                    if (!$scope.isDEAvailable(dem.metadata))
                        $scope.isEverythingOK = false;
                });

            }
        };

        $scope.viewConflicts = function () {
            var htmlString = "";

            htmlString += "<ol>";

            $.each($scope.validatedMessage, function (i, m) {
                htmlString += "<li>" + m + "</li>";
            });

            htmlString += "</ol>";

            $("#confBdy").html(htmlString);
            $("#conflictModal").modal('show');
        };

        // to check if a data element is available while validating
        $scope.isDEAvailable = function (de) {
            var deId = de.split("-")[0];
            var coc = de.split("-").length > 1 ? de.split("-")[1] : "";

            var isDeFound = false;
            var isCocFound = false;

            $.each($scope.dataElements, function (i, d) {
                if (d.id == deId) {
                    isDeFound = true;

                    $.each(d.categoryCombo.categoryOptionCombos, function (i, c) {
                        if (c.id == coc) {
                            isCocFound = true;
                            return false;
                        }
                    });
                    return false;
                }
            });
            console.log(" de : " + isDeFound + " coc : " + isCocFound);

            if (!isDeFound) {
                $scope.validatedMessage.push("Data element " + deId + " is not found");
                return false;
            } else {
                if (!isCocFound) {
                    $scope.validatedMessage.push("COC " + coc + " of data element " + deId + " is not found");
                    return false;
                } else
                    return true;
            }
        };
        // IMPORT FUNCTION
        //****************************************************************************************************************
        //****************************************************************************************************************

        $scope.h = {};
        $scope.importData = function (orgUnit, index, callbackfunct) {
            $.when(
                $.getJSON("../../../api/organisationUnits/" + orgUnit.id + ".json?fields=comment", {
                    format: "json"
                })
             
            ).always(function (data5) {
                let facilityType = "";
                if (data5.comment !== "" && data5.comment !== undefined) {
                    facilityType = data5.comment;
                    facilityType = facilityType.substring(facilityType.indexOf(":") + 1).trim();
                }
                console.log(facilityType);
                let selectedTemp = $scope.getTemplate($scope.confirmedUploads.TempVal);
                let dataValues = [];
            $("#loader").fadeIn();
            $("#templateProgress").html(orgUnit.name + " -> preparing data values to import");

            if (selectedTemp !== "") {


                // MOU - MDE
                if (selectedTemp.typeId === "1") {
                    console.log("yes it is mou - mde");
                    if (selectedTemp.columnMetaData === "o") {
                        for (let x = 0; x < selectedTemp.DEMappings.length; x++) {
                            let rowNum = selectedTemp.DEMappings[x].rowNumber;
                            for (let y = selectedTemp.columnStart.cn; y <= selectedTemp.columnEnd.cn; y++) {
                                var dataValue = {};
                                dataValue.period = $("#importPeriod").val();
                                dataValue.dataElement = selectedTemp.DEMappings[x].metadata.split("-")[0];
                                dataValue.categoryOptionCombo = selectedTemp.DEMappings[x].metadata.split("-")[1];
                                let ouLabel = $scope.getImportData(selectedTemp.columnStart.rn, y);
                                dataValue.orgUnit = $scope.getOrgUnitByLabel(ouLabel);
                                dataValue.value = $scope.getImportData(rowNum, y);
                                if ($("#importEmpty").val() === 2)
                                    dataValue.value = dataValue.value === "" ? "omit" : dataValue.value;
                                else
                                    dataValue.value = dataValue.value === "" ? 0 : dataValue.value;
                                if (dataValue.orgUnit !== "" && dataValue.value !== "omit") {
                                    dataValues.push(dataValue);
                                }
                            }
                        }
                    }
                    else {
                        for (let x = 0; x < selectedTemp.DEMappings.length; x++) {
                            let colNum = selectedTemp.DEMappings[x].colNumber;
                            for (let y = selectedTemp.rowStart.rn; y <= selectedTemp.rowEnd.rn; y++) {
                                var dataValue = {};
                                dataValue.period = $("#importPeriod").val();
                                dataValue.dataElement = selectedTemp.DEMappings[x].metadata.split("-")[0];
                                dataValue.categoryOptionCombo = selectedTemp.DEMappings[x].metadata.split("-")[1];
                                let ouLabel = $scope.getImportData(y, selectedTemp.rowStart.cn);
                                dataValue.orgUnit = $scope.getOrgUnitByLabel(ouLabel);
                                dataValue.value = $scope.getImportData(y, colNum);
                                if ($("#importEmpty").val() === 1)
                                    dataValue.value = dataValue.value === "" ? "omit" : dataValue.value;
                                else
                                    dataValue.value = dataValue.value === "" ? 0 : dataValue.value;
                                if (dataValue.orgUnit !== "" && dataValue.value !== "omit")
                                    dataValues.push(dataValue);
                            }
                        }
                    }
                }

                // SOU - MDE
                if (selectedTemp.typeId === "2") {
                    $scope.dp = [];
                    for (var x = 0; x < selectedTemp.DEMappings.length; x++) {
                        var cellAddress = selectedTemp.DEMappings[x].cellAddress;
                        var dataValue = {};
                        var orgName;

                        dataValue.period = $scope.confirmedUploads.periodVal;
                        dataValue.dataElement = selectedTemp.DEMappings[x].metadata.split("-")[0];
                        dataValue.categoryOptionCombo = selectedTemp.DEMappings[x].metadata.split("-")[1];
                        dataValue.orgUnit = orgUnit.id;
                        orgName = orgUnit.name;

                        //dataValue.categoryOptionCombo = selectedTemp.DEMappings[x].metadata.split("-")[1];
                        //dataValue.orgUnit = orgUnit.id;

                        dataValue.value = $scope.getImportDataByAddress(cellAddress, orgUnit);

                        if (dataValue.orgUnit !== "" && dataValue.value !== "") {
                            dataValues.push(dataValue);
                        }

                        //$scope.childrenDataValues.push( dataValue );
                        $scope.childrenDataValues = dataValues;
                        /************************************* FOR SC ************************************************************/
                        /*

                        */
                        /********************************************************** FOR DH **************************************************/
                        /*

                        */

                        /********************************************************** FOR CHC **************************************************/
                        /*

                        */

                        /******************************************** FOR PHC ********************************************************/
                        /*

                        */
                         /*

                        */
                    }
                    /*
                     */
                }
            }

            ///////////////////////////////////////////////////////////////////////
            console.log("dataValues : " + JSON.stringify(dataValues));

            $("#templateProgress").html(orgUnit.name + " -> Importing data.. Please wait.. This may take several minutes..");
             var dataValueSet = {};
            dataValueSet.dataValues = dataValues;


                //making ready to import data
                $.get("../../../api/system/info", function (data) {

                    $scope.h.time = data.serverDate.split("T")[0] + " (" + data.serverDate.split("T")[1].split(".")[0] + ")";
                    //					$scope.h.orgUnitGroup = $scope.confirmedUploads.orgUnitGrpName;
                    $scope.h.orgUnits[index] = orgUnit.name;
                    if ($scope.validatedMessage.length == 0 && $scope.isEverythingOK)
                        $scope.validatedMessage.push("Everything was perfect as per validations");

                    $scope.h.orgUnits[index] = $scope.validatedMessage;
                    $scope.h.orgUnits[index].stats = {};

                    //saving data
                    ExcelMappingService.importData(dataValueSet).then(function (tem) {
                        //						$("#loader").hide();
                        console.log("index : " + index);

                        console.log("no of orgUnits : " + $scope.confirmedUploads.orgUnits.length);
                        console.log(tem.data.importCount.updated);
                        console.log(tem.data.importCount.imported);
                        console.log(tem.data.importCount.ignored);

                        // complete registration
                        if (tem.data.importCount.updated > 0 || tem.data.importCount.imported > 0) {
                            for (var i = 0; i < $scope.confirmedUploads.orgUnits.length; i++) {

                                cdsr.completeDataSetRegistrations.push({
                                    'dataSet': $("#imDataSetId").val(),
                                    'period': $("#importPeriod").val(),
                                    'organisationUnit': $scope.confirmedUploads.orgUnits[i].id
                                    // 'multiOu': false
                                })

                                $.ajax({
                                    url: '../../../api/completeDataSetRegistrations',
                                    data: JSON.stringify(cdsr),
                                    contentType: "application/json; charset=utf-8",
                                    dataType: 'json',
                                    type: 'post',
                                    success: function (data, textStatus, xhr) {
                                        $scope.h.stats.CompleteStatus = "SUCCESS";
                                        console.log("Registration Complete");
                                    },
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log("Error in Registration Complete");
                                        $scope.h.stats.CompleteStatus = "IGNORED";
                                        if (409 == xhr.status || 500 == xhr.status) // Invalid value or locked
                                        {

                                        }
                                        else // Offline, keep local value
                                        {

                                        }
                                    }
                                });

                                console.log(cdsr);

                                console.log($scope.confirmedUploads.orgUnits[i].id + " --" + $("#imDataSetId").val() + "--" + $("#importPeriod").val());
                            }

                        }
                        else {
                            $scope.h.stats.CompleteStatus = "IGNORED";
                        }

                        $scope.h.stats.upc = tem.data.importCount.updated;
                        $scope.h.orgUnits[index].stats.upc = tem.data.importCount.updated;
                        $scope.h.stats.imc = tem.data.importCount.imported;
                        $scope.h.orgUnits[index].stats.imc = tem.data.importCount.imported;
                        $scope.h.stats.responseDescription = tem.data.description;
                        var  errElement = "";
                        if( tem.data.conflicts === undefined )
                        {
                            errElement = "No Conflicts";
                            $scope.h.stats.igc = 0;
                            $scope.h.orgUnits[index].stats.igc = 0;
                        }
                        else {
                            tem.data.conflicts.forEach((child,index) => errElement += (index+1) + ". value: " + child.object + "<br/>Reason: " + child.value + ".<br/>");
                            $scope.h.stats.igc = tem.data.importCount.ignored;
                            //$scope.h.orgUnits[index].stats.igc = tem.data.importCount.ignored;
                            $scope.h.orgUnits[index].stats.igc = tem.data.conflicts.length;
                        }


                        $scope.history.history.push($scope.h);
                        $scope.storeHistory();

                        console.log("org upc : " + $scope.h.orgUnits[index].stats.upc);
                        console.log("org imc : " + $scope.h.orgUnits[index].stats.imc);
                        console.log("org igc : " + $scope.h.orgUnits[index].stats.igc);
                        console.log("upc stat : " + $scope.h.stats.upc);
                        console.log("imc stat : " + $scope.h.stats.imc);
                        console.log("igc stat : " + $scope.h.stats.igc);

                        var table = '';
                        table += '<tr class="info" style="font-weight: bold;">\
                                    <td> Organisation Unit </td>\
                                    <td id="responseDescription">' + $scope.confirmedUploads.orgUnits[index].name + '</td>&nbsp;<td></td>\
                                </tr>\
                                <tr class="info">\
                                    <td> Description </td>\
                                    <td id="responseDescription">' + $scope.h.stats.responseDescription + '</td>&nbsp;<td></td>\
                                </tr>\
                                <tr class="success">\
                                    <td> Imported </td>\
                                    <td id="imct"> ' + $scope.h.stats.imc + ' </td>&nbsp;<td></td>\
                                </tr>\
                                <tr class="info">\
                                    <td> Updated </td>\
                                    <td id="upc"> ' + $scope.h.stats.upc + ' </td>&nbsp;<td></td>\
                                </tr>\
                                <tr class="danger">\
                                    <td> Ignored/Conflict Details </td>\
                                    <td id="igc"> ' + $scope.h.stats.igc + ' </td>&nbsp;<td id="conflictDetails">' + errElement + '</td>\
                                </tr>\
                                <tr class="success">\
                                    <td> DataSet Registrations Complete </td>\
                                    <td id="dataSetRegistrationsComplete">' + $scope.h.stats.CompleteStatus + '</td>&nbsp;<td></td>\
                                </tr>';

                        $("#modal-table").append(table);

                        if ($scope.confirmedUploads.orgUnits.length == (index + 1)) {
                            callbackfunct();
							
							/*
                            let selectedMonth = $scope.confirmedUploads.periodVal.slice(-2);
                            if( selectedMonth === '04' && $("#imDataSetId").val() === 'ruF6WDXDWAM'){
                                $scope.financialPeriodList( $scope.confirmedUploads.periodVal );
                            }
                            else{
                                //alert( 'selected month - ' + selectedMonth );
                            }
							*/
							

                        }
                    });
                });
            })
        };


        //****************************************************************************************************************
        //****************************************************************************************************************
        //****************************************************************************************************************
        //****************************************************************************************************************

        $scope.getTemplate = function (id) {
            var t = "";

            $scope.templates.templates.forEach(function (te) {
                if (te.id == id)
                    t = te;
            });

            return t;
        };

        $scope.getImportData = function (rowNum, colNum) {
            var address = $scope.engAddress[colNum] + "" + rowNum;
            var val = "";

            return (val);
        };

        $scope.getImportDataByAddress = function (add, orgUnit) {
            var address = add;
            var val = "";

            orgUnit.dataCells.forEach(function (c) {
                if (c.address == address)
                    val = c.value;
            });
            //console.log("value : " + val);
            return (val);
        };

        $scope.generateEnglishAddresses = function () {
            //generating more address notations for columns
            for (var x = 1; x < 27; x++) {
                for (var y = 1; y < 27; y++) {
                    $scope.engAddress.push($scope.engAddress[x] + "" + $scope.engAddress[y]);
                }
            }

            for (var x = 1; x < 27; x++) {
                for (var y = 1; y < 27; y++) {
                    for (var z = 1; z < 27; z++) {
                        $scope.engAddress.push($scope.engAddress[x] + "" + $scope.engAddress[y] + "" + $scope.engAddress[z]);
                    }
                }
            }

            for (var x = 1; x < 27; x++) {
                for (var y = 1; y < 27; y++) {
                    for (var z = 1; z < 27; z++) {
                        for (var u = 1; u < 27; u++) {
                            $scope.engAddress.push($scope.engAddress[x] + "" + $scope.engAddress[y] + "" + $scope.engAddress[z] + "" + $scope.engAddress[u]);
                        }
                    }
                }
            }
        };



        $scope.storeHistory = function () {
            ExcelMappingService.save('Excel-import-app-history', $scope.history).then(function (r) {
                //console.log(r);
            });
        };

        $scope.validateUploads = function () {
            $("#loader").fadeIn();
            $scope.validatedMessage.length = 0;
            $scope.isEverythingOK = true;
         
            $scope.confirmedUploads.orgUnits.forEach(function (orgUnit, index) {
                $scope.validateAll(orgUnit, index);
            });

            if ($scope.isEverythingOK) {
                $("#ime").show();
            } else {
                $("#imd").show();
                $scope.viewConflicts();
            }

            $("#confirmedUploadsDiv").addClass("disabled");
            $("#imb").hide();
            $("#loader").fadeOut();
        };


        $scope.importUploads = function () {
            $("#loader").fadeIn();

            $scope.h.orgUnitGroup = $scope.confirmedUploads.orgUnitGrpName;
            $scope.h.dataSet = $scope.confirmedUploads.dataSetName;
            $scope.h.period = $scope.confirmedUploads.periodName;
            $scope.h.template = $scope.confirmedUploads.TempName;
            $scope.h.orgUnits = [];
            $scope.h.stats = {};
            $scope.h.stats.upc = 0;
            $scope.h.stats.imc = 0;
            $scope.h.stats.igc = 0;

            var callbackfunct = function () {
                $("#upc").html($scope.h.stats.upc);
                $("#imct").html($scope.h.stats.imc);
                $("#igc").html($scope.h.stats.igc);
                $("#stModal").modal('show');

                $("#loader").fadeOut();

            };

            $scope.confirmedUploads.orgUnits.forEach(function (orgUnit, index) {

                $("#loader").fadeIn();
                $("#templateProgress").html(orgUnit.name + " -> preparing data values to import");
                $timeout(()=> {
                    $scope.importData(orgUnit, index, callbackfunct);

                },1000)

            });
        };

        // for import status downloads

        $scope.tableToExcel = (function () {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
            return function (table, name, filename) {
                if (!table.nodeType) table = document.getElementById(table)
                var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
                document.getElementById("dlink").href = uri + base64(format(template, ctx));
                document.getElementById("dlink").download = filename;
                document.getElementById("dlink").click();
            }
        })();

/* // use case for NIPI --
        $scope.financialPeriodList = function (  selectedPeriod ) {
            //$scope.financilaPeriodList.push('201904');
            //let startYear = financialYear.split("-")[0];
            //let endYear =  financialYear.split("-")[0].substring(0, 2) + financialYear.split("-")[1];
            let selectedYear = selectedPeriod.substring(0, 4);
            let selectedMonth = selectedPeriod.slice(-2);

            let nextYear = parseInt( selectedYear ) + 1;
            $scope.financilaPeriodList.push( selectedPeriod );
            $scope.financilaPeriodList.push( selectedYear + '05' );
            $scope.financilaPeriodList.push( selectedYear + '06' );
            $scope.financilaPeriodList.push( selectedYear + '07' );
            $scope.financilaPeriodList.push( selectedYear + '08' );
            $scope.financilaPeriodList.push( selectedYear + '09' );
            $scope.financilaPeriodList.push( selectedYear + '10' );
            $scope.financilaPeriodList.push( selectedYear + '11' );
            $scope.financilaPeriodList.push( selectedYear + '12' );
            $scope.financilaPeriodList.push( nextYear + '01' );
            $scope.financilaPeriodList.push( nextYear + '02' );
            $scope.financilaPeriodList.push( nextYear + '03' );

            //console.log(' temp period list ' + $scope.financilaPeriodList );
            //http://127.0.0.1:8092/dhis234/api/organisationUnits/" + $scope.selectedOrgUnit.id + ".json?paging=false&fields=id,name,children[id,name]"

            $.ajax({
            url: "../../../api/organisationUnits/" + $scope.selectedOrgUnit.id + ".json?paging=false&fields=id,name,children[id,name]",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            async: false,
            success: function (organisationUnitsResponse) {
                for (let  i = 0; i < organisationUnitsResponse.children.length; i++) {
                    $scope.orgUnitChildrens = organisationUnitsResponse.children;

                }
            },
            error: function (err) {
                console.log("org error" + JSON.stringify(err));
            }
        });

        $scope.orgUnitChildrens.push($scope.selectedOrgUnit);
        //console.log(' temp children ou list ' + $scope.orgUnitChildrens );
        let tempDataValues = [];

        $.each($scope.childrenDataValues, function (i, dv) {

            if(  dv.dataElement !== 'reIsaKSpZRO' || dv.dataElement !== 'XVK0Y3PnGsU' ){
                $.each($scope.orgUnitChildrens, function (j, temOrgUnit) {

                    for (let  k = 0; k < $scope.financilaPeriodList.length; k++) {
                        let tempDataValue = {};
                        tempDataValue.period = $scope.financilaPeriodList[k];
                        tempDataValue.dataElement = dv.dataElement;
                        tempDataValue.categoryOptionCombo = dv.categoryOptionCombo;
                        tempDataValue.orgUnit = temOrgUnit.id;
                        tempDataValue.value = dv.value;
                        tempDataValues.push(tempDataValue);
                    }
                });
            }


            //console.log(' dataElement ' + dv.dataElement + ' categoryOptionCombo ' + dv.categoryOptionCombo + ' value ' + dv.value);
            //console.log(' temp data - categoryOptionCombo ' + dv.categoryOptionCombo );
            //console.log(' temp data - value ' + dv.value );

        });

        console.log(" final dataValues : " + JSON.stringify(tempDataValues));
        let tempDataValueSet = {};
        tempDataValueSet.dataValues = tempDataValues;
        if(tempDataValueSet.dataValues.length !== 0){
            ExcelMappingService.importData(tempDataValueSet).then(function (tempResponseDataValueSet) {

                //console.log("no of orgUnits : " + $scope.confirmedUploads.orgUnits.length);
                console.log(tempResponseDataValueSet.data.importCount.updated);
                console.log(tempResponseDataValueSet.data.importCount.imported);
                console.log(tempResponseDataValueSet.data.importCount.ignored);
            });
        }
       //$("#loader").fadeOut();
    };
	
*/
	
});