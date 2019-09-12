isolateTransferApp.controller('editTransfer', function ($scope, $location, $timeout, storeService, MetadataService, dataStoreService) {

    $scope.data = storeService.get();
    if(!$scope.data.BatchNo) {
        $location.path('/').search();
    }
    $scope.selectedProgram = $scope.data.program.displayName;
    $scope.Ids = [];
    $scope.selectedOrgUnit = {
        id: $scope.data.key,
        name: "",
        code: ""
    };

    $scope.batchNoDeUid = 'wNTllPkgB92';
    $scope.dispatchDateDeUid = 'nU2wf4hwlDD';
    $scope.dispatchStatusDeUid = 'D4jwjr4opAv';
    $scope.receivedDateDeUid = 'BQwb1YbN3mH';
    $scope.eventDataValue = [];

    selection.load();
    $scope.dataElementsMapping = [];
    $scope.dataElementsMapping = [{
            "displayName": "Isolate status",
            "id": "KHHHMoiUsWZ",
            "valueType": "TEXT"
        },
        {
            "displayName": "Quality check date",
            "id": "hQmS69HXStI",
            "valueType": "DATE"
        },
        {
            "displayName": "Isolate condition",
            "id": "H4s7FuoY3Hm",
            "valueType": "TEXT"
        },
        {
            "displayName": "Molecular test date",
            "id": "qNmtxrjYccb",
            "valueType": "DATE"
        }
        /*
        {
            "displayName": "Batch No",
            "id": "wNTllPkgB92",
            "valueType": "TEXT"
        },
        {
            "displayName": "Dispatch Date",
            "id": "nU2wf4hwlDD",
            "valueType": "DATE"
        },
        {
            "displayName": "Dispatch Status",
            "id": "D4jwjr4opAv",
            "valueType": "TEXT"
        },
        {
            "displayName": "Recived Date",
            "id": "BQwb1YbN3mH",
            "valueType": "DATE"
        }
        */

    ];

    console.log($scope.dataElementsMapping);

    processEventDataValue();

    // Listen for OU changes
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedOrgUnit.id = selectedSelection["0"];
    }, false);

    $scope.teiDataValue = {
        availableArray: $scope.data.rows.availableArray,
        selectedArray: $scope.data.rows.selectedArray
    };

    MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (orgUnit) {
        $timeout(function () {
            $scope.selectedOrgUnit.name = orgUnit.name;
            $scope.selectedOrgUnit.code = orgUnit.code;
        })
    });

    $scope.showToggle = function () {
        $scope.showModal = !$scope.showModal;
        
    };

    $scope.checkDate = function(passedDate, amrId, dateId) {
        var givenDate = new Date(passedDate);
        var date = new Date();
        if(givenDate > date) {
            $scope.eventDataValue[amrId][dateId] = ""
            $scope.message = "Please select valid date.";
            $scope.showToggle();
            return;
        }
    }

    $scope.cancelTeiDataValue = function () {
        $location.path('/').search();
    };

    $scope.makeIds = function (rows, cols) {
        for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < cols.length; j++) {
                $scope.Ids[rows[i]][cols[j]] = "";
            }
        }
    };
    //makeIds(teiDataValue.selectedArray,);

    // init methods
    function processEventDataValue() {

        var batchNo = $scope.data.BatchNo;
        var dispatchDate = $scope.data.dispatchDate;
        var dispatchStatus = $scope.data.disptachStatus.received;
        var receivedDate = $scope.data.disptachStatus.receivedDate;

        var eventDataElements = [{
                dataElement: $scope.batchNoDeUid,
                value: batchNo
            },
            {
                dataElement: $scope.dispatchDateDeUid,
                value: dispatchDate
            },
            {
                dataElement: $scope.dispatchStatusDeUid,
                value: dispatchStatus
            },
            {
                dataElement: $scope.receivedDateDeUid,
                value: receivedDate
            }
        ];

        for (var j = 0; j < $scope.data.rows.selectedArray.length; j++) {

            var eventUid = $scope.data.rows.selectedArray[j].eventuid;
            var programUid = $scope.data.rows.selectedArray[j].programuid;
            var teiUid = $scope.data.rows.selectedArray[j].teiuid;


            if (eventDataElements.length != 0) {
                for (var i = 0; i < eventDataElements.length; i++) {
                    updateSingleTEIDataValue(teiUid, programUid, eventUid, eventDataElements[i].dataElement, eventDataElements[i].value);
                }
            }

            //get events dataValue
            $.ajax({
                async: false,
                type: "GET",
                url: '../../../api/events/' + eventUid + '.json?skipPaging=true',
                success: function (eventResponse) {

                    if (eventResponse.event != undefined && eventResponse.dataValues.length != 0) {
                        for (var k = 0; k < eventResponse.dataValues.length; k++) {

                            if (!$scope.eventDataValue[eventResponse.event]) {
                                $scope.eventDataValue[eventResponse.event] = [];
                            }
                            $scope.eventDataValue[eventResponse.event][eventResponse.dataValues[k].dataElement] = eventResponse.dataValues[k].value;
                        }
                    }
                },
                error: function (response) {}

            });

            console.log("Get Events DataValue Map :", $scope.eventDataValue);

            // post method for savaEvent dataValue
            //alert( $scope.eventDataValue );
            /*
            var eventDataValue = {
                event: $scope.data.rows.selectedArray[j].eventuid,
                orgUnit: $scope.data.rows.selectedArray[j].orguid,
                program: $scope.data.rows.selectedArray[j].programuid,
                trackedEntityInstance: $scope.data.rows.selectedArray[j].teiuid,
                dataValues: [
                    {
                        dataElement: $scope.batchNoDeUid,
                        value: batchNo
                    },
                    {
                        dataElement: $scope.dispatchDateDeUid,
                        value: dispatchDate
                    },
                    {
                        dataElement: $scope.dispatchStatusDeUid,
                        value: dispatchStatus
                    },
                    {
                        dataElement: $scope.receivedDateDeUid,
                        value: receivedDate
                    }
                ]
            };

            if( eventDataValue.dataValues.length != 0){
                $.ajax({
                    async: false,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    url: '../../../api/events/',
                    data: JSON.stringify(eventDataValue),
                    success: function (response) {
                        console.log("Update Event with UID :",eventDataValue.event);
                    },
                    error: function (response) {
                        console.log("Not Update Event with UID:",eventDataValue.event);
                    }
                });
            }
            */

        }
    
        $("#loader").hide();
    }

    $scope.saveSingleTEIDataValue = function (eventUid, programUid, teiUid, deUid) {
        //alert( eventUid + " -- " + programUid + " -- " + teiUid + " -- " + deUid);
        //alert($scope.eventDataValue[eventUid][deUid]);
        var valueForUpdate = $scope.eventDataValue[eventUid][deUid];
        console.log(eventUid + " -- " + programUid + " -- " + teiUid + " -- " + deUid + " -- " + valueForUpdate);
        updateSingleTEIDataValue(teiUid, programUid, eventUid, deUid, valueForUpdate);

        if ($scope.eventDataValue[eventUid][deUid] === 'Dead') {
            var arr = ["H4s7FuoY3Hm", "hQmS69HXStI", "qNmtxrjYccb"];
            arr.forEach(id => {
                if ($scope.eventDataValue[eventUid][id]) {
                    emptyString = $scope.eventDataValue[eventUid][id] = "";
                    updateSingleTEIDataValue(teiUid, programUid, eventUid, id, emptyString);

                }
            })
        } else if ($scope.eventDataValue[eventUid][deUid] === "Contaminated") {
            var arr = ["hQmS69HXStI", "qNmtxrjYccb"];
            arr.forEach(id => {
                if ($scope.eventDataValue[eventUid][id]) {
                    emptyString = $scope.eventDataValue[eventUid][id] = "";
                    updateSingleTEIDataValue(teiUid, programUid, eventUid, id, emptyString);
                }
            })
        }

    };


    // update single event dataValue
    function updateSingleTEIDataValue(teiUid, programUid, eventUid, deUid, deValue) {

        var updateEventDataValue = {
            event: eventUid,
            program: programUid,
            trackedEntityInstance: teiUid,
            dataValues: [{
                dataElement: deUid,
                value: deValue
            }]
        };

        console.log("Event DataValue fro Update :", updateEventDataValue);

        $.ajax({
            async: false,
            type: "PUT",
            url: '../../../api/events/' + eventUid + '/' + deUid,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(updateEventDataValue),
            success: function (updateEventResponse) {
                console.log("Update Event with UID :", updateEventResponse + "--" + updateEventDataValue.event + " -- " + deUid + " -- " + deValue);
            },
            error: function (updateEventResponse) {
                console.log("Not Update Event with UID:", updateEventResponse + "--" + updateEventDataValue.event + " -- " + deUid + " -- " + deValue);
            }
        });

    }




});