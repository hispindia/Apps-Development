

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
    $scope.selectedPayLoad = {
        orgUnit: "",
        period: "",
        organisationUnits: "",
        dataElements: ""
    }

    $scope.successCount = 0;
    $scope.errorCount = 0;
    $scope.requestCount = 0
    $scope.years = []
    $scope.response = []
    $scope.OUname = ""
    $scope.allOU = []
    $("#loader").hide()
    $("#secondTable").hide()
    selection.load();
    $scope.TrackerPanel = function () {
        $location.path('/tracker-data-import').search();
    };
    $scope.AggregatedPanel = function () {
        $location.path('/aggregated-data-import').search();
    };
    $scope.GoBack = function () {
        $window.history.back();
    }
    MetadataService.getDataElements().then(function (res) {
        $timeout(function () {
            $scope.selectedPayLoad.dataElements = res.dataElements;
        })
    });

    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedPayLoad.id = selectedSelection["0"];

        MetadataService.getOrgUnit($scope.selectedPayLoad.id).then(function (ouRes) {
            $timeout(function () {
                $scope.selectedPayLoad.name = ouRes.displayName;
                $scope.selectedPayLoad.orgUnit = ouRes.id;
                $scope.selectedPayLoad.ouName=ouRes.displayName+" aggregate.xlsx"
            })
        });
        MetadataService.getChildrenOU($scope.selectedPayLoad.id).then(function (res) {
            $timeout(function () {
                let parent = {
                    name: res.name,
                    id: res.id
                }
                $scope.allOU = res.children
                $scope.allOU.push(parent)
                $scope.selectedPayLoad.organisationUnits = $scope.allOU;
            })
        });

    }, false);
    var date = new Date()
    for (let year = date.getFullYear(); year > 2010; year--) {
        $scope.years.push(year)
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
                    $scope.initialSummary = prepareListFromMap(headersMapGrpByDomain);
                    $scope.importSummary = {};
                    $scope.importSummaryMap = [];
                    importHandler($scope.initialSummary, data.data, notificationCallBack);
                })
            }
        });
    }
    function parseExcel(file) {
        var reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = function (e) {
            var data = e.target.result
            var workbook = XLSX.read(data, { type: 'binary' })
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                for (let object of JSON.parse(json_object)) {
                    var dataValueSet = {};
                    var dataValues = [];
                    var months = ["01","02","03","04","05","06","07","08","09","10","11","12"]
                    var objArr =["Sub-national level", "SIA - Age (range) of target group","SIA - Coverage achieved (%)","SIA - Start and end date","Qualitative assessment of most recent SIA","SIA - Vaccine","SIA - % sub-national units >95% coverage","SIA - Supplementary immunization activities with measles/rubella vaccine?","SIA - Target population size","Coverage 1st dose (%)","Coverage 2nd dose (%)","Vaccine target population","Population","Measles cases - Jan","Measles cases - Feb","Measles cases - Mar","Measles cases - April","Measles cases - May","Measles cases - June","Measles cases - July","Measles cases - Aug","Measles cases - Sept","Measles cases - Oct","Measles cases - Nov","Measles cases - Dec","Rubella cases  - Jan","Rubella cases  - Feb","Rubella cases  - Mar","Rubella cases  - April","Rubella cases  - May","Rubella cases  - June","Rubella cases  - July","Rubella cases  - Aug","Rubella cases  - Sept","Rubella cases  - Oct","Rubella cases  - Nov","Rubella cases  - Dec"]
                    for (let property in object) {
                        var dataValue = {};
                         if (property == objArr["1"]) {
                            dataValue.dataElement = "Q2bbJeHtn1u"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["2"]) {
                            dataValue.dataElement = "Hpuo7Nwytj0"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["3"]) {
                            dataValue.dataElement = "tLrclznXikM"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["4"]) {
                            dataValue.dataElement = "uJh0PEQ41Of"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["5"]) {
                            dataValue.dataElement = "tJP6aNDsWIi"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["6"]) {
                            dataValue.dataElement = "p7tbc0wxUcG"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["7"]) {
                            dataValue.dataElement = "gEio39PyL0N"
                            if( object[property] == "Yes"){
                                dataValue.value = true
                            }else {
                                dataValue.value = false
                            }
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["8"]) {
                            dataValue.dataElement = "B8I6bLwMdRh"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["9"]) {
                            dataValue.dataElement = "xsNpodwxGJq"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["10"]) {
                            dataValue.dataElement = "PWFz97YzqJ4"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["11"]) {
                            dataValue.dataElement = "sHsVPj9Np7Q"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            dataValues.push(dataValue);
                        }else if (property == objArr["12"]) {
                            dataValue.dataElement = "kbI6q0c38dz"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period
                            for( let month of months){
                                    let monthlyObj = {};
                                      monthlyObj.categoryOptionCombo="HllvX50cXC0"
                                      monthlyObj.dataElement="kbI6q0c38dz"
                                      monthlyObj.value = object[property];
                                      monthlyObj.period = $scope.selectedPayLoad.period+month;
                                     dataValues.push(monthlyObj);
                            }
                            dataValues.push(dataValue);
                        } else if(property == objArr["13"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "01"
                            dataValues.push(dataValue);
                        } else if (property == objArr["14"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "02"
                            dataValues.push(dataValue);
                        } else if (property == objArr["15"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "03"
                            dataValues.push(dataValue);
                        } else if (property == objArr["16"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "04"
                            dataValues.push(dataValue);
                        } else if (property == objArr["17"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "05"
                            dataValues.push(dataValue);
                        } else if (property == objArr["18"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "06"
                            dataValues.push(dataValue);
                        } else if (property == objArr["19"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "07"
                            dataValues.push(dataValue);
                        } else if (property == objArr["20"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "08"
                            dataValues.push(dataValue);
                        } else if (property == objArr["21"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "09"
                            dataValues.push(dataValue);
                        } else if (property == objArr["22"]) {
                            dataValue.dataElement = "UpQo0wzxWBp"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "10"
                            dataValues.push(dataValue);
                        } else if (property == objArr["23"]) {
                            dataValue.dataElement = "UpQo0wzxWBp",
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "11"
                            dataValues.push(dataValue);
                        } else if (property == objArr["24"]) {
                            dataValue.dataElement = "UpQo0wzxWBp",
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "12"
                            dataValues.push(dataValue);
                        } else if (property == objArr["25"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "01"
                            dataValues.push(dataValue);
                        } else if (property == objArr["26"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "02"
                            dataValues.push(dataValue);
                        } else if (property == objArr["27"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "03"
                            dataValues.push(dataValue);
                        } else if (property == objArr["28"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "04"
                            dataValues.push(dataValue);
                        } else if (property == objArr["29"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "05"
                            dataValues.push(dataValue);
                        } else if (property == objArr["30"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "06"
                            dataValues.push(dataValue);
                        } else if (property == objArr["31"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "07"
                            dataValues.push(dataValue);
                        } else if (property == objArr["32"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "08"
                            dataValues.push(dataValue);
                        } else if (property == objArr["33"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "09"
                            dataValues.push(dataValue);
                        } else if (property == objArr["34"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "10"
                            dataValues.push(dataValue);
                        } else if (property == objArr["35"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "11"
                            dataValues.push(dataValue);
                        } else if (property == objArr["36"]) {
                            dataValue.dataElement = "dGvElBDgK2l"
                            dataValue.value = object[property]
                            dataValue.period = $scope.selectedPayLoad.period + "12"
                            dataValues.push(dataValue);
                        } else {
                            dataValue.dataElement = ""
                            dataValue.value = ""
                            dataValue.period = $scope.selectedPayLoad.period
                        }
                        dataValue.categoryOptionCombo = "HllvX50cXC0";
                        for (let ou of $scope.selectedPayLoad.organisationUnits) {
                            var keys = Object.keys(object)
                            $scope.OUname = object[keys["0"]]
                            if (ou.name == $scope.OUname) {
                                dataValueSet.orgUnit = ou.id;
                            }
                        }
                    }
                    // dataValues.shift()
                    dataValueSet.dataValues = dataValues;
                    MetadataService.postExcelData(dataValueSet).then(function (res) {
                        console.log('here is response', res)
                        $("#secondTable").show()
                        let resObj = {
                            index: [],
                            orgUnit: $scope.OUname,
                            status: "",
                            conflict: [],
                            httpResponse: ""
                        }
                        if(res){
                          let index = 2
                          resObj.index.push(index)
                        }
                        $timeout(function () {
                            if (res.status == "SUCCESS") {
                                $scope.successCount = $scope.successCount + 1;
                                resObj.status = res.status
                                resObj.httpResponse = res.description
                                $scope.response.push(resObj)
                            } else if (res.status == "WARNING") {
                                $scope.errorCount = $scope.errorCount + 1;
                                resObj.conflict = res.conflicts;
                                resObj.status = res.status
                                $scope.response.push(resObj)
                            }
                            $scope.requestCount = $scope.errorCount + $scope.successCount;
                        })
                        $("#loader").hide()
                    });
                    $scope.response.shift()
                }
            })
        }
    }
    $scope.getSet = function () {
        $("#loader").show()
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
});
