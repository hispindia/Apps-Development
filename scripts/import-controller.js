/**
 * updated by mithilesh on 2020-05-18.
 */
excelImport
    .controller('importController', function ($rootScope, $http,
                                              $scope
    ) {

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
            var reader = new FileReader()
            reader.readAsBinaryString(file)
            reader.onload = function (e) {
                var data = e.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                })
                workbook.SheetNames.forEach(function (sheetName) {

                    if( sheetName === 'event' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            var updateEventDataValue = {
                                event: row.event,
                                program: row.program,
                                dataValues: [{
                                    dataElement: row.dataElement,
                                    value: row.value
                                }]
                            };

                            $.ajax({
                                type: "PUT",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(updateEventDataValue),
                                url: '../../events/' + row.event + '/' + row.dataElement,
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount + JSON.stringify(row) + " updated value " + row.value + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount + JSON.stringify(row) +  " not updated value " + row.value + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log( "Row - " + importCount + JSON.stringify(row ) +  " -- "+ "Warning!: " +  JSON.stringify(response ) );
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update done ");

                            }
                        });

                    }
                    // event update
                    else if( sheetName === 'eventDataValueUpdate' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        let json_object = JSON.stringify(XL_row_object);
                        let objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            //console.log( row );
                            //latitude: row.coordinates.split(",")[1],
                            //longitude: row.coordinates.split(",")[0]
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../events/' + row.event + ".json?paging=false",
                                success: function (eventResponse) {
                                    let updateEventDataValue = {
                                        event: row.event,
                                        program: eventResponse.program,
                                        dataValues: [{
                                            dataElement: row.dataElement,
                                            value: row.value,
                                            created: row.created,
                                            lastUpdated: row.lastUpdated,
                                            providedElsewhere: row.providedElsewhere,
                                            storedBy: row.storedBy
                                        }]
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateEventDataValue),
                                        url: '../../events/' + row.event + '/' + row.dataElement,
                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            //console.log( JSON.stringify(row) + " updated value " + row.value + " response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  JSON.stringify(row) +  " not updated value " + row.uid + " response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( JSON.stringify(row ) +  " -- "+ "Warning!: " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (eventResponse) {
                                    console.log( JSON.stringify( row.event ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                },
                                warning: function (eventResponse) {
                                    console.log( JSON.stringify( row.event ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                }
                            });
                            importCount++;
                            console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update done ");

                            }
                        });

                    }

                    // event status update
                    else if( sheetName === 'eventStatusUpdate' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        let json_object = JSON.stringify(XL_row_object);
                        let objectKeys = Object.keys(XL_row_object["0"]);
                        let updateCount = 1;
                        XL_row_object.forEach(row => {
                            //console.log( row );
                            //latitude: row.coordinates.split(",")[1], small
                            //longitude: row.coordinates.split(",")[0] big
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../events/' + row.event + ".json?paging=false",
                                success: function (eventResponse) {

                                    var updateEventStatus = eventResponse;

                                    updateEventStatus.status = row.status;
                                    updateEventStatus.completedBy = row.completedBy;
                                    updateEventStatus.completedDate = row.completedDate;

                                    $.ajax({
                                        type: "PUT",
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateEventStatus),
                                        url: '../../events/' + row.event,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log( JSON.stringify(row) + " updated value " + row.event + " response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  JSON.stringify(row) +  " not updated value " + row.event + " response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( JSON.stringify(row ) +  " -- "+ "Warning!: " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (eventResponse) {
                                    console.log( JSON.stringify( row.event ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                },
                                warning: function (eventResponse) {
                                    console.log( JSON.stringify( row.event ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                }
                            });
                            updateCount++;
                            console.log( "Row - " + updateCount + " update done for event " + row.event );
                            if( updateCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update done ");

                            }
                        });

                    }

                    else if( sheetName === 'eventCoordinate' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        let json_object = JSON.stringify(XL_row_object);
                        let objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            //console.log( row );
                            //latitude: row.coordinates.split(",")[1], small
                            //longitude: row.coordinates.split(",")[0] big
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../events/' + row.event + ".json?paging=false",
                                success: function (eventResponse) {
                                    let updateEventCoordinate = {
                                        event: row.event,
                                        program: eventResponse.program,
                                        orgUnit: eventResponse.orgUnit,
                                        coordinate: {
                                            latitude: row.latitude,
                                            longitude: row.longitude
                                        },
                                        dataValues: [...eventResponse.dataValues]
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateEventCoordinate),
                                        url: '../../events/' + row.event,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            //console.log( JSON.stringify(row) + " updated value " + row.value + " response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  JSON.stringify(row) +  " not updated value " + row.uid + " response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( JSON.stringify(row ) +  " -- "+ "Warning!: " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (eventResponse) {
                                    console.log( JSON.stringify( row.event ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                },
                                warning: function (eventResponse) {
                                    console.log( JSON.stringify( row.event ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                }
                            });
                            importCount++;
                            console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update done ");

                            }
                        });

                    }
                    // for enrollment
                    else if( sheetName === 'enrollmentCoordinate' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        let json_object = JSON.stringify(XL_row_object);
                        let objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            //console.log( row );
                            importCount++;
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../enrollments/' + row.enrollment + ".json?paging=false",
                                success: function (enrollmentResponse) {
                                    let updateEnrollment = {
                                        enrollment: row.enrollment,
                                        status: enrollmentResponse.status,
                                        program: enrollmentResponse.program,
                                        trackedEntityInstance: enrollmentResponse.trackedEntityInstance,
                                        trackedEntityType: enrollmentResponse.trackedEntityType,
                                        incidentDate: enrollmentResponse.incidentDate,
                                        enrollmentDate: enrollmentResponse.enrollmentDate,
                                        orgUnit: enrollmentResponse.orgUnit,
                                        coordinate: {
                                            latitude: row.coordinates.split(",")[0],
                                            longitude: row.coordinates.split(",")[1]
                                        }
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        dataType: "json",
                                        async: false,
                                        contentType: "application/json",
                                        data: JSON.stringify(updateEnrollment),
                                        url: '../../enrollments/' + row.enrollment,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            //console.log( JSON.stringify(row) + " updated value " + row.value + " response: " + JSON.stringify(response) );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            //console.log(  JSON.stringify(row) +  " not updated value " + row.uid + " response: " + JSON.stringify(response ));
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            //console.log( JSON.stringify(row ) +  " -- "+ "Warning!: " +  JSON.stringify(response ) );
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (eventResponse) {
                                    console.log( JSON.stringify( row.enrollment ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                },
                                warning: function (eventResponse) {
                                    console.log( JSON.stringify( row.enrollment ) +  " -- "+ "Error!: " +  JSON.stringify( eventResponse ) );
                                }
                            });

                            console.log( "Row - " + importCount + " update done for enrollemnt " + row.enrollment );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update done ");

                            }
                        });

                    }


                    // organisationUnits coordinate update 2.32
                    else if( sheetName === 'organisationUnits' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // 0 index -- longitude and 1st index -- latitude
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../organisationUnits/' + row.uid + ".json?paging=false",
                                success: function (orgUnitResponse) {
                                    var updateOrgUnitCoOrdinate = {
                                        id: row.uid,
                                        name:orgUnitResponse.name,
                                        shortName:orgUnitResponse.shortName,
                                        openingDate:orgUnitResponse.openingDate,
                                        parent: orgUnitResponse.parent,
                                        geometry: {
                                            type: row.featureType,
                                            coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                                        }
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateOrgUnitCoOrdinate),
                                        url: '../../organisationUnits/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }

                    // organisationUnits coordinate update 2.227
                    else if( sheetName === 'organisationUnits227' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../organisationUnits/' + row.uid + ".json?paging=false",
                                success: function (orgUnitResponse) {
                                    var updateOrgUnitCoOrdinate = {
                                        id: row.uid,
                                        name:orgUnitResponse.name,
                                        shortName:orgUnitResponse.shortName,
                                        openingDate:orgUnitResponse.openingDate,
                                        parent: orgUnitResponse.parent,
                                        attributeValues:[
                                            {value:row.value,
                                                attribute:{
                                                    id:"GHXW2VReNjS"
                                                }
                                            }
                                        ],
                                        coordinates:row.coordinates,
                                        featureType:'POINT'
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateOrgUnitCoOrdinate),
                                        url: '../../organisationUnits/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }

                    // organisationUnits post
                    else if( sheetName === 'organisationUnitsPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            let orgUnitPostRequest = {
                                id : row.uid,
                                name: row.name,
                                shortName: row.shortName,
                                parent: { id:  row.parent },
                                code: row.code,
                                comment: row.comment,
                                description: row.description,
                                level: row.level,
                                phoneNumber: row.phoneNumber,
                                email: row.email,
                                address: row.address,
                                contactPerson: row.contactPerson,
                                attributeValues:[
                                    {   value:row.attributeValue,
                                        attribute:{
                                            id:row.attribute,
                                        }
                                    }
                                ],
                                openingDate: row.openingDate
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(orgUnitPostRequest),
                                url: '../../organisationUnits',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");
                            }
                        });

                        /*
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        //let objectKeys = Object.keys(XL_row_object["0"]);
                        //let importCount = 1;

                        let orgUnitPostRequest = {
                            uid : row.uid,
                            name: row.name,
                            shortName: 'Ultha',
                            openingDate:'2020-07-02',
                            code: 'R1',
                            parent: { id:  'yToWgUDECAh' },

                            attributeValues : [ { value: '1', attribute: {id: 'veZ49fBzseV'}},
                                { value: 'R', attribute: {id: 'gOXwCqwgxL9'}} ]
                        };

                        $.ajax({
                            type: "POST",
                            async: false,
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(orgUnitPostRequest),
                            url: '../../organisationUnits',

                            success: function (response) {
                                //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                            },
                            error: function (response) {
                                console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                            },
                            warning: function (response) {
                                console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                            }

                        });
                        */
                    }

                    // organisationUnits  update
                    else if( sheetName === 'organisationUnitsPUT' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../organisationUnits/' + row.uid + ".json?paging=false",
                                success: function (orgUnitResponse) {
                                    var updateOrgUnit = {
                                        id: row.uid,
                                        name:row.name,
                                        shortName:orgUnitResponse.shortName,
                                        openingDate:orgUnitResponse.openingDate,
                                        closedDate:orgUnitResponse.closedDate,
                                        parent: orgUnitResponse.parent,
                                        code: orgUnitResponse.code,
                                        comment: orgUnitResponse.comment,
                                        description: orgUnitResponse.description,
                                        level: orgUnitResponse.level,
                                        phoneNumber: orgUnitResponse.phoneNumber,
                                        email: orgUnitResponse.email,
                                        address: orgUnitResponse.address,
                                        contactPerson: orgUnitResponse.contactPerson
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateOrgUnit),
                                        url: '../../organisationUnits/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }
                    // organisationUnits  update
                    else if( sheetName === 'organisationUnitUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../organisationUnits/' + row.uid + ".json?paging=false",
                                success: function (orgUnitResponse) {
                                    var updateOrgUnit = orgUnitResponse;
                                    updateOrgUnit.id = row.uid;
                                    updateOrgUnit.name = row.name;
                                    updateOrgUnit.shortName = row.shortName;
                                    //updateOrgUnit.translations = row.translations;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateOrgUnit),
                                        url: '../../organisationUnits/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }
                        // organisationUnits translations update // translations in json format in xls
                    // update translations from one instance to another instance
                    else if( sheetName === 'orgUnitTranslationsUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../organisationUnits/' + row.uid + ".json?paging=false",
                                success: function (orgUnitResponse) {
                                    var updateOrgUnit = orgUnitResponse;
                                    //var tempTranslations = eval(row.translations);
                                    var tempTranslations = JSON.parse(row.translations);
                                    //var translationArr = [];
                                    //updateOrgUnit.id = row.uid;
                                    //updateOrgUnit.name = row.name;
                                    //updateOrgUnit.shortName = row.shortName;
                                    //updateOrgUnit.translations = row.translations;
                                    //tempTranslations.push( row.translations);
                                    //updateOrgUnit.translations = tempTranslations;
                                    /*
                                    for( let i = 0; i < tempTranslations.length; i++){

                                        translationArr.push({
                                            "property": tempTranslations[i].property,
                                            "locale": tempTranslations[i].locale,
                                            "value": tempTranslations[i].value
                                        });
                                    }
                                    */

                                    updateOrgUnit.translations = tempTranslations;
                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateOrgUnit),
                                        url: '../../organisationUnits/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }
                    // organisationUnits  update
                    else if( sheetName === 'orgUnitCoordinateUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                        // 0 index -- longitude and 1st index -- latitude
                        // for polygon coordinates: row.coordinates
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../organisationUnits/' + row.uid + ".json?paging=false",
                                success: function (orgUnitResponse) {
                                    /*
                                    var updateOrgUnit = orgUnitResponse;
                                    orgUnitResponse.id = row.uid;
                                    orgUnitResponse.name = row.name;
                                    orgUnitResponse.shortName = row.shortName;
                                    orgUnitResponse.code = row.code;
                                    orgUnitResponse.openingDate = row.openingDate;
                                    */

                                    var updateOrgUnit = {
                                        id: row.uid,
                                        name:orgUnitResponse.name,
                                        shortName:orgUnitResponse.shortName,
                                        openingDate:orgUnitResponse.openingDate,
                                        closedDate:orgUnitResponse.closedDate,
                                        parent: orgUnitResponse.parent,
                                        code: orgUnitResponse.code,
                                        comment: orgUnitResponse.comment,
                                        description: orgUnitResponse.description,
                                        level: orgUnitResponse.level,
                                        phoneNumber: orgUnitResponse.phoneNumber,
                                        email: orgUnitResponse.email,
                                        address: orgUnitResponse.address,
                                        contactPerson: orgUnitResponse.contactPerson,
                                        geometry: {
                                            type: row.featureType,
                                            coordinates: [row.longitude, row.latitude]
                                        }
                                    };

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateOrgUnit),
                                        url: '../../organisationUnits/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }
                        // update organisationUnitsGroup members
                    // organisationUnitGroups  PUT
                    else if( sheetName === 'organisationUnitGroup' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;

                        var organisationUnitGrpMem = [];
                        var orgUnitGroupID = "";
                        XL_row_object.forEach(row => {
                            orgUnitGroupID = row.orgUnitGrpUID;
                            organisationUnitGrpMem.push({
                                'id': row.orgUnitGrpMem
                            });
                        });
                        $.ajax({
                            type: "GET",
                            async: false,
                            url: '../../organisationUnitGroups/' + orgUnitGroupID + ".json?paging=false",
                            success: function (orgUnitGroupResponse) {
                                var updateOrgUnitGroup = orgUnitGroupResponse;
                                //updateOrgUnitGroup.id = orgUnitGroupID;
                                updateOrgUnitGroup.organisationUnits = organisationUnitGrpMem;

                                $.ajax({
                                    type: "PUT",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify(updateOrgUnitGroup),
                                    url: '../../organisationUnitGroups/' + orgUnitGroupID + "?mergeMode=REPLACE",

                                    success: function (response) {
                                        console.log(  " organisationUnitGroup Member length -- " + organisationUnitGrpMem.length + " update done response: " + JSON.stringify(response) );
                                    },
                                    error: function (response) {
                                        console.log(  " organisationUnitGroup Member" + organisationUnitGrpMem.length + " error response: " + JSON.stringify(response ));
                                    },
                                    warning: function (response) {
                                        console.log( " organisationUnitGroup Member" + organisationUnitGrpMem.length  + "Warning response : " +  JSON.stringify(response ) );
                                    }

                                });
                            },
                            error: function (orgUnitGroupResponse) {
                                console.log(  " -- Error!: " +  JSON.stringify( orgUnitGroupResponse ) );
                            },
                            warning: function (orgUnitGroupResponse) {
                                console.log(  " -- Error!: " +  JSON.stringify( orgUnitGroupResponse ) );
                            }
                        });
                    }

                    // indicator name/short-name update
                    else if( sheetName === 'indicatorNameShortNameUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../indicators/' + row.uid + ".json?paging=false",
                                success: function (indicatorResponse) {
                                    var updateIndicator = indicatorResponse;

                                    updateIndicator.id = row.uid;
                                    updateIndicator.name = row.name;
                                    updateIndicator.shortName = row.shortName;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateIndicator),
                                        url: '../../indicators/' + row.uid,
                                        //url: '../../indicators/' + row.uid + "?mergeMode=REPLACE",

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( indicatorResponse ) );
                                },
                                warning: function (indicatorResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( indicatorResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }




                    // indicator delete
                    else if( sheetName === 'indicatorDelete' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let deleteCount = 1;
                        XL_row_object.forEach(row => {
                            deleteCount++;

                            $.ajax({
                                type: "DELETE",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                url: '../../indicators/' + row.uid,

                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + deleteCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + deleteCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + deleteCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( deleteCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " indicator delete done ");
                            }
                        });

                    }

                    //
                    else if( sheetName === 'dataValueSetTemp' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        let objectKeys = Object.keys(XL_row_object["0"]);
                        console.log("objectKeys : " + objectKeys );
                        //let importCount = 1;

                        let dataElementUIds = [
                            {"id": "aUZ4ddiK158"},
                            {"id": "FxxTnas9FMs"},
                            {"id": "EWu5rMuulrX"},
                            {"id": "tNaOziMOmfN"},
                            {"id": "fPyrcgudzke"},
                            {"id": "JMFgo0ObPPm"},
                            {"id": "Cn2HHo2jVQk"},
                            {"id": "S2G8IMUsOQ5"},
                            {"id": "cG96DfItKGv"},
                            {"id": "Ir1CsEYYNe4"},
                            {"id": "DME8vdexgvm"},
                            {"id": "erDbDhYaVMF"}
                        ];

                        let dataValues = [];

                        //for (let i = 0; i < objectKeys.length; i++) {

                        XL_row_object.forEach(row => {
                            //for (let i = 0; i < objectKeys.length; i++) {
                            // let dataValue = {};
                            // dataValue.orgUnit = row[objectKeys[0]];
                            // dataValue.dataElement = objectKeys[i];

                            for (let i = 0; i < objectKeys.length; i++) {

                                for (let k = 0; k < dataElementUIds.length; k++) {
                                    let dataValue = {};
                                    if (dataElementUIds[k].id === objectKeys[i]) {
                                        if (row[objectKeys[i]] !== undefined && row[objectKeys[i]] !== "") {
                                            dataValue.period = row[objectKeys[1]];
                                            dataValue.dataElement = dataElementUIds[k].id;
                                            dataValue.categoryOptionCombo = row[objectKeys[0]];
                                            dataValue.orgUnit = row[objectKeys[2]];
                                            dataValue.value = row[objectKeys[i]];
                                            dataValues.push(dataValue);
                                        }
                                    }
                                }
                            }
                            //}
                        });
                        //}

                        let dataValueSet = {};
                        dataValueSet.dataValues = dataValues;
                        console.log( " final dataValues length : " + dataValues.length + " final dataValueSet length : " + dataValueSet.length);
                        console.log(" final dataValueSet : " + JSON.stringify(dataValueSet) );
                        let dataJSON = JSON.stringify(dataValueSet);

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

                                let impCount = response.importCount.imported;
                                let upCount = response.importCount.updated;
                                let igCount = response.importCount.ignored;
                                let conflictsDetails   = response.conflicts;

                                console.log(  "impCount - " + impCount + " upCount - " + upCount + " igCount - " + igCount + " conflictsDetails - " + conflictsDetails  );
                            },
                            error: function (response) {
                                console.log("error : " + response.conflicts );
                            },
                            warning: function (response) {
                                console.log("warning : " + response.conflicts );
                            }

                        });

                    }

                    // dataValueSet post
                    else if( sheetName === 'dataValueSet' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        //let objectKeys = Object.keys(XL_row_object["0"]);
                        //let importCount = 1;
                        let dataValues = [];
                        XL_row_object.forEach(row => {
                            let dataValue = {};
                            dataValue.dataElement = row.dataElementUID;
                            dataValue.categoryOptionCombo = row.categoryoptioncomboUID;
                            dataValue.orgUnit = row.organisationunitUID;
                            dataValue.value = row.dataValue;
                            dataValue.lastUpdated = row.lastUpdated;
                            dataValue.storedBy = row.storedBy;
                            dataValue.period = row.isoPeriod;
                            dataValues.push(dataValue);

                        });
                        let dataValueSet = {};
                        dataValueSet.dataValues = dataValues;
                        console.log(" final dataValueSet : " + dataValueSet );
                        let dataJSON = JSON.stringify(dataValueSet);
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

                                let impCount = response.importCount.imported;
                                let upCount = response.importCount.updated;
                                let igCount = response.importCount.ignored;
                                let conflictsDetails   = response.conflicts;

                                console.log(  "impCount - " + impCount + " upCount - " + upCount + " igCount - " + igCount + " conflictsDetails - " + conflictsDetails  );
                            },
                            error: function (response) {
                                console.log("error : " + response.conflicts );
                            },
                            warning: function (response) {
                                console.log("warning : " + response.conflicts );
                            }

                        });

                    }
                    // dataValueSetDataSetAttribute post
                    else if( sheetName === 'dataValueSetDataSetAttribute' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        //let objectKeys = Object.keys(XL_row_object["0"]);
                        //let importCount = 1;
                        let dataValues = [];
                        XL_row_object.forEach(row => {
                            let dataValue = {};
                            dataValue.dataElement = row.dataElementUID;
                            dataValue.categoryOptionCombo = row.categoryoptioncomboUID;
                            dataValue.attributeOptionCombo = row.attributeOptionComboUID;
                            dataValue.orgUnit = row.organisationunitUID;
                            dataValue.period = row.isoPeriod;
                            dataValue.value = row.dataValue;
                            dataValue.storedBy = row.storedBy;
                            dataValue.lastUpdated = row.lastUpdated;
                            dataValues.push(dataValue);

                        });
                        let dataValueSet = {};
                        dataValueSet.dataValues = dataValues;
                        console.log(" final dataValueSet : " + dataValueSet );
                        let dataJSON = JSON.stringify(dataValueSet);
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

                                let impCount = response.importCount.imported;
                                let upCount = response.importCount.updated;
                                let igCount = response.importCount.ignored;
                                let conflictsDetails   = response.conflicts;

                                console.log(  "impCount - " + impCount + " upCount - " + upCount + " igCount - " + igCount + " conflictsDetails - " + conflictsDetails  );
                            },
                            error: function (response) {
                                console.log("error : " + response.conflicts );
                            },
                            warning: function (response) {
                                console.log("warning : " + response.conflicts );
                            }

                        });

                    }
                    // dataValueSet post
                    else if( sheetName === 'dataValuesDelete' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        //let objectKeys = Object.keys(XL_row_object["0"]);
                        //let importCount = 1;
                        let dataValues = [];
                        var deleteCount = 1;
                        XL_row_object.forEach(row => {
                            deleteCount++;
                            let value = '';
                            let dataValueDelete = {
                                'de' : row.dataElementUID,
                                'co' : row.categoryoptioncomboUID,
                                'ds' : row.dataSetUID,
                                'ou' : row.organisationunitUID,
                                'pe' : row.isoPeriod,
                                'value': value
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                //dataType: "json",
                                //contentType: "application/json",
                                //data: JSON.stringify(dataValueDelete),
                                data: dataValueDelete,
                                url: '../../dataValues',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + deleteCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + deleteCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + deleteCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( deleteCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " datavalue delete done ");
                            }
                        });
                    }
                    // dataSetComplete post
                    else if( sheetName === 'dataSetComplete' ){
                        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //let json_object = JSON.stringify(XL_row_object);
                        //let objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;

                        XL_row_object.forEach(row => {
                            importCount++;

                            let dataSetCompleteRegistration = {completeDataSetRegistrations: []};
                            dataSetCompleteRegistration.completeDataSetRegistrations.push({
                                'dataSet': row.dataSet,
                                'organisationUnit': row.organisationUnit,
                                'period': row.period
                            })
                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(dataSetCompleteRegistration),
                                url: '../../completeDataSetRegistrations',

                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );

                                    console.log( "Row - " + importCount + " Registration Complete " + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log("error : " + response.conflicts );
                                },
                                warning: function (response) {
                                    console.log("warning : " + response.conflicts );
                                }
                            });
                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " Registration Complete");

                            }
                        });
                    }

                    // optionSetsPost post
                    else if( sheetName === 'optionSetsPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            let optionSetPostRequest = {
                                id : row.uid,
                                name: row.name,
                                code: row.code,
                                valueType: row.valueType,
                                options: []
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(optionSetPostRequest),
                                url: '../../optionSets',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");
                            }
                        });

                    }

                    // optionSetsPost post
                    else if( sheetName === 'optionsPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            let optionPostRequest = {
                                id : row.uid,
                                name: row.name,
                                code: row.code,
                                optionSet: { id:  row.optionSet },
                                sortOrder: row.sortOrder
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(optionPostRequest),
                                url: '../../options',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");
                            }
                        });

                    }

                    // optionGroupPost
                    else if( sheetName === 'optionGroupsPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            let optionGroupPostRequest = {
                                id : row.uid,
                                name: row.name,
                                shortName: row.shortName,
                                code: row.code,
                                optionSet: { id:  row.optionSet },
                                options: []
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(optionGroupPostRequest),
                                url: '../../optionGroups',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");
                            }
                        });

                    }

                    // categoryOption post
                    else if( sheetName === 'categoryOptionsPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            let categoryOptionPostRequest = {
                                id : row.uid,
                                name: row.name,
                                shortName: row.shortName,
                                code: row.code
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(categoryOptionPostRequest),
                                url: '../../categoryOptions',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");
                            }
                        });

                    }

                    // categories post
                    else if( sheetName === 'categoriesPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;

                        var categoryOptions = [];
                        var categoryUID = "";
                        var categoryName = "";
                        var categoryDataDimensionType = "";
                        var categoryDataDimension = true;
                        XL_row_object.forEach(row => {
                            categoryUID = row.uid;
                            categoryName = row.name;
                            categoryDataDimensionType = row.dataDimensionType;
                            categoryOptions.push({
                                'id': row.categoryOptions
                            });
                        });

                        let categoryPostRequest = {
                            id : categoryUID,
                            name: categoryName,
                            dataDimensionType: categoryDataDimensionType,
                            dataDimension: categoryDataDimension,
                            categoryOptions:categoryOptions
                        };

                        $.ajax({
                            type: "POST",
                            async: false,
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(categoryPostRequest),
                            url: '../../categories/',

                            success: function (response) {
                                console.log(  " categoryOptions Member length -- " + categoryOptions.length + " update done response: " + JSON.stringify(response) );
                            },
                            error: function (response) {
                                console.log(  " categoryOptions Member" + categoryOptions.length + " error response: " + JSON.stringify(response ));
                            },
                            warning: function (response) {
                                console.log( " categoryOptions Member" + categoryOptions.length  + "Warning response : " +  JSON.stringify(response ) );
                            }

                        });
                    }

                    // dataElementPost post
                    else if( sheetName === 'dataElementsPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        //var json_object = JSON.stringify(XL_row_object);
                        //var objectKeys = Object.keys(XL_row_object["0"]);
                        let importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            let dataElementPostRequest = {
                                id : row.uid,
                                name: row.name,
                                shortName: row.shortName,
                                code: row.code,
                                formName: row.formName,
                                categoryCombo: { id:  row.categoryCombo },
                                aggregationType: row.aggregationType,
                                domainType: row.domainType,
                                valueType: row.valueType,
                                zeroIsSignificant: row.zeroIsSignificant,
                                legendSets: []
                            };

                            $.ajax({
                                type: "POST",
                                async: false,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(dataElementPostRequest),
                                url: '../../dataElements',
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                }
                            });

                            //importCount++;
                            //console.log( "Row - " + importCount + " update done for event " + row.event );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");
                            }
                        });

                    }

                    // dataElements  update
                    else if( sheetName === 'dataElementsPUT' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../dataElements/' + row.uid + ".json?paging=false",
                                success: function (dataElementResponse) {
                                    var updateDataElement = dataElementResponse;

                                    updateDataElement.id = row.uid;
                                    updateDataElement.name = row.name;
                                    updateDataElement.shortName = row.shortName;
                                    updateDataElement.description = row.description;
                                    updateDataElement.formName = row.formName;
                                    updateDataElement.aggregationType = row.aggregationType;
                                    updateDataElement.zeroIsSignificant = row.zeroIsSignificant;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateDataElement),
                                        url: '../../dataElements/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }

                    // dataElements  attributeValue Update
                    else if( sheetName === 'dataElementAttributeUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../dataElements/' + row.uid + ".json?paging=false",
                                success: function (dataElementResponse) {
                                    var updateDataElement = dataElementResponse;
                                    var dataElementAttributeValue = [];

                                    dataElementAttributeValue.push({
                                        value:row.attributeValue,
                                        attribute:{
                                            id:row.attribute,
                                        }
                                    });

                                    updateDataElement.attributeValues = dataElementAttributeValue;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateDataElement),
                                        url: '../../dataElements/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }

                    // dataElements  name update
                    else if( sheetName === 'dataElementsNameUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../dataElements/' + row.uid + ".json?paging=false",
                                success: function (dataElementResponse) {
                                    var updateDataElement = dataElementResponse;

                                    updateDataElement.id = row.uid;
                                    updateDataElement.name = row.name;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateDataElement),
                                        url: '../../dataElements/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });
                    }

                    // dataElements  name/shortName update
                    else if( sheetName === 'dataElementsNameShortNameUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../dataElements/' + row.uid + ".json?paging=false",
                                success: function (dataElementResponse) {
                                    var updateDataElement = dataElementResponse;

                                    updateDataElement.id = row.uid;
                                    updateDataElement.name = row.name;
                                    updateDataElement.shortName = row.shortName;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateDataElement),
                                        url: '../../dataElements/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                },
                                warning: function (orgUnitResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( orgUnitResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }

                    // users  dataViewOrganisationUnits  Update
                    else if( sheetName === 'userDataViewOrganisationUnits' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../users/' + row.uid + ".json?paging=false",
                                success: function (userResponse) {
                                    var updateUser = userResponse;
                                    var dataViewOrganisationUnits = [];

                                    dataViewOrganisationUnits.push({
                                        'id': row.dataViewOrganisationUnits
                                    });
                                    updateUser.dataViewOrganisationUnits = dataViewOrganisationUnits;

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateUser),
                                        url: '../../users/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (userResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                },
                                warning: function (userResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });

                    }
                    // users  teiSearchOrganisationUnits  usersUpdate Update
                    else if( sheetName === 'usersUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var updateCount = 1;
                        XL_row_object.forEach(row => {
                            updateCount++;
                            //console.log( row );
                            // for point coordinates: [row.coordinates.split(",")[0], row.coordinates.split(",")[1]]
                            // for polygon coordinates: row.coordinates
                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../users/' + row.userInfoUid + ".json?paging=false",
                                success: function (userResponse) {
                                    var updateUser = userResponse;
                                    let teiSearchOrganisationUnits = [];

                                    if( row.teiSearchOrganisationUnits !== undefined && row.teiSearchOrganisationUnits !== "" ){
                                        teiSearchOrganisationUnits.push({
                                            'id': row.teiSearchOrganisationUnits
                                        });
                                        updateUser.teiSearchOrganisationUnits = teiSearchOrganisationUnits;
                                    }
                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateUser),
                                        url: '../../users/' + row.userInfoUid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + updateCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + updateCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + updateCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (userResponse) {
                                    console.log( JSON.stringify( row.userInfoUid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                },
                                warning: function (userResponse) {
                                    console.log( JSON.stringify( row.userInfoUid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( updateCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });
                    }

                    // users  userGroups  Update
                    else if( sheetName === 'userGroupsUpdate' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {
                            importCount++;

                            $.ajax({
                                type: "GET",
                                async: false,
                                url: '../../users/' + row.uid + ".json?paging=false",
                                success: function (userResponse) {
                                    let updateUserGroups = userResponse;
                                    let userGroups = [];

                                    if( row.userGroups !== undefined  && row.userGroups !== "" ){
                                        let tempUserGroups = row.userGroups.split(",");
                                        for (let i=0;i<tempUserGroups.length;i++){
                                            userGroups.push({
                                                'id': tempUserGroups[i]
                                            });
                                        }
                                        updateUserGroups.userGroups = userGroups;
                                    }

                                    $.ajax({
                                        type: "PUT",
                                        async: false,
                                        dataType: "json",
                                        contentType: "application/json",
                                        data: JSON.stringify(updateUserGroups),
                                        url: '../../users/' + row.uid,

                                        success: function (response) {
                                            //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                            console.log(  "Row - " + importCount + " update done response: " + JSON.stringify(response) );
                                        },
                                        error: function (response) {
                                            console.log(  "Row - " + importCount + " error response: " + JSON.stringify(response ));
                                        },
                                        warning: function (response) {
                                            console.log( "Row - " + importCount + "Warning response : " +  JSON.stringify(response ) );
                                        }

                                    });
                                },
                                error: function (userResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                },
                                warning: function (userResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                }
                            });

                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " update complete ");

                            }
                        });
                    }

                    // users post check if user already taken
                    else if( sheetName === 'usersPost' ){
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var importCount = 1;
                        XL_row_object.forEach(row => {

                            $.ajax({
                                type: "GET",
                                async: false,
                                //api/users.json?filter=userCredentials.username:eq:norbur_LT&fields=id,name&paging=false
                                url: '../../users.json?filter=userCredentials.username:eq:' + row.username + "&fields=id,name&paging=false",
                                success: function (userResponse) {

                                    //console.log( userResponse.users.length);
                                    if( userResponse.users.length === 0 && userResponse.users[0] === undefined ){
                                        importCount++;

                                        let usersPost = {};
                                        let organisationUnits = [];
                                        let dataViewOrganisationUnits = [];
                                        let teiSearchOrganisationUnits = [];
                                        let userGroups = [];
                                        let userRoles = [];

                                        usersPost.id = row.userInfoUid;
                                        usersPost.firstName = row.firstName;
                                        usersPost.surname = row.surname;
                                        usersPost.email = row.email;
                                        usersPost.phoneNumber = row.phoneNumber;
                                        usersPost.userCredentials = {};
                                        usersPost.userCredentials.username = row.username;
                                        usersPost.userCredentials.password = row.password;

                                        if( row.organisationUnits !== undefined  && row.organisationUnits !== "" ){
                                            organisationUnits.push({
                                                'id': row.organisationUnits
                                            });
                                            usersPost.organisationUnits = organisationUnits;
                                        }
                                        if( row.dataViewOrganisationUnits !== undefined  && row.dataViewOrganisationUnits !== "" ){
                                            dataViewOrganisationUnits.push({
                                                'id': row.dataViewOrganisationUnits
                                            });
                                            usersPost.dataViewOrganisationUnits = dataViewOrganisationUnits;
                                        }

                                        if( row.teiSearchOrganisationUnits !== undefined && row.teiSearchOrganisationUnits !== "" ){
                                            teiSearchOrganisationUnits.push({
                                                'id': row.teiSearchOrganisationUnits
                                            });
                                            usersPost.teiSearchOrganisationUnits = teiSearchOrganisationUnits;
                                        }
                                        if( row.userGroups !== undefined  && row.userGroups !== "" ){
                                            let tempUserGroups = row.userGroups.split(",");
                                            for (let i=0;i<tempUserGroups.length;i++){
                                                userGroups.push({
                                                    'id': tempUserGroups[i]
                                                });
                                            }
                                            usersPost.userGroups = userGroups;
                                        }
                                        if( row.userRoles !== undefined  && row.userRoles !== "" ){
                                            let tempUserRoles = row.userRoles.split(",");
                                            for (let j=0;j<tempUserRoles.length;j++){
                                                //user.userGroups.push(this.userGroups[i]);
                                                userRoles.push({
                                                    'id': tempUserRoles[j]
                                                });
                                            }
                                            usersPost.userCredentials.userRoles = userRoles;
                                        }
                                        $.ajax({
                                            type: "POST",
                                            async: false,
                                            dataType: "json",
                                            contentType: "application/json",
                                            data: JSON.stringify(usersPost),
                                            url: '../../users',
                                            success: function (response) {
                                                //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                                console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                            },
                                            error: function (response) {
                                                console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                            },
                                            warning: function (response) {
                                                console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                            }
                                        });

                                    }
                                    else{
                                        //console.log( userResponse.users[0].id);
                                        console.log( " Username already taken with user id " + userResponse.users[0].id + " and name " + userResponse.users[0].name);
                                    }
                                },
                                error: function (userResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                },
                                warning: function (userResponse) {
                                    console.log( JSON.stringify( row.uid ) +  " -- "+ "Error!: " +  JSON.stringify( userResponse ) );
                                }
                            });
                            //console.log( "Row - " + importCount + " update done for organisationUnit " + row.uid );
                            if( importCount === parseInt(XL_row_object.length) + 1 ){
                                console.log( " import done ");

                            }
                        });
                    }

                        /*
                        else if( sheetName === 'usersPost' ){
                            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            //var json_object = JSON.stringify(XL_row_object);
                            //var objectKeys = Object.keys(XL_row_object["0"]);
                            let importCount = 1;
                            XL_row_object.forEach(row => {

                                importCount++;

                                let usersPost = {};
                                let organisationUnits = [];
                                let dataViewOrganisationUnits = [];
                                let teiSearchOrganisationUnits = [];
                                let userGroups = [];
                                let userRoles = [];

                                usersPost.firstName = row.firstName;
                                usersPost.surname = row.surname;
                                usersPost.email = row.email;
                                usersPost.phoneNumber = row.phoneNumber;
                                usersPost.userCredentials = {};
                                usersPost.userCredentials.username = row.username;
                                usersPost.userCredentials.password = row.password;

                                if( row.organisationUnits !== undefined  && row.organisationUnits !== "" ){
                                    organisationUnits.push({
                                        'id': row.organisationUnits
                                    });
                                    usersPost.organisationUnits = organisationUnits;
                                }

                                if( row.dataViewOrganisationUnits !== undefined  && row.dataViewOrganisationUnits !== "" ){
                                    dataViewOrganisationUnits.push({
                                        'id': row.dataViewOrganisationUnits
                                    });
                                    usersPost.dataViewOrganisationUnits = dataViewOrganisationUnits;
                                }

                                if( row.teiSearchOrganisationUnits !== undefined && row.teiSearchOrganisationUnits !== "" ){
                                    teiSearchOrganisationUnits.push({
                                        'id': row.teiSearchOrganisationUnits
                                    });
                                    usersPost.teiSearchOrganisationUnits = teiSearchOrganisationUnits;
                                }

                                if( row.userGroups !== undefined  && row.userGroups !== "" ){
                                    let tempUserGroups = row.userGroups.split(",");
                                    for (let i=0;i<tempUserGroups.length;i++){
                                        userGroups.push({
                                            'id': tempUserGroups[i]
                                        });
                                    }
                                    usersPost.userGroups = userGroups;
                                }

                                if( row.userRoles !== undefined  && row.userRoles !== "" ){
                                    let tempUserRoles = row.userRoles.split(",");
                                    for (let j=0;j<tempUserRoles.length;j++){
                                        //user.userGroups.push(this.userGroups[i]);
                                        userRoles.push({
                                            'id': tempUserRoles[j]
                                        });
                                    }
                                    usersPost.userCredentials.userRoles = userRoles;
                                }

                                $.ajax({
                                    type: "POST",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify(usersPost),
                                    url: '../../users',
                                    success: function (response) {
                                        //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                        console.log( "Row - " + importCount  + " response: " + JSON.stringify(response) );
                                    },
                                    error: function (response) {
                                        console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                    },
                                    warning: function (response) {
                                        console.log(  "Row - " + importCount  + " response: " + JSON.stringify(response ));
                                    }
                                });

                                //importCount++;
                                //console.log( "Row - " + importCount + " update done for event " + row.event );
                                if( importCount === parseInt(XL_row_object.length) + 1 ){
                                    console.log( " import done ");
                                }
                            });
                        }
                        */

                    // translation update
                    else{
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        var json_object = JSON.stringify(XL_row_object);

                        //Arranging ids with values
                        var objectKeys = Object.keys(XL_row_object["0"]);
                        var totalRows = [];
                        XL_row_object.forEach(row => {
                            if (!totalRows[row[objectKeys["0"]]]) {
                                totalRows[row[objectKeys["0"]]] = [];
                                let obj = {}
                                for (let i = 1; i < objectKeys.length; i++) {
                                    obj[objectKeys[i]] = row[objectKeys[i]]
                                }
                                totalRows[row[objectKeys["0"]]].push(obj);

                            } else {
                                let obj = {}
                                for (let i = 1; i < objectKeys.length; i++) {
                                    obj[objectKeys[i]] = row[objectKeys[i]]
                                }
                                totalRows[row[objectKeys["0"]]].push(obj);
                            }
                        });

                        //Getting ids that are present in the excel
                        var ids = Object.keys(totalRows);
                        $scope.excelIdElement = ids.length;

                        //putting values according to the ids.
                        ids.forEach((id, indexId) => {
                            let url = "../../" + sheetName + "/" + id + ".json?paging=false"
                            $http.get(url).then(function (response) {
                                var data = response.data;
                                var translationArr = [...data.translations];
                                $scope.logs[indexId] = [];
                                var checkData = false;
                                $scope.logs[indexId]["head"] = "Translation Check for '" + data.displayName + "' with id: '" + data.id + "'";
                                $scope.logs[indexId]["body"] = [];
                                totalRows[id].forEach(row => {
                                    let checkArr = true;
                                    data.translations.forEach((translation, index) => {

                                        if (translation.property == row.property && translation.locale == row.locale && translation.value != row.value) {
                                            translationArr[index].value = row.value;
                                            checkArr = false;
                                            checkData = true;
                                            $scope.logs[indexId]["body"].push("Changed Value of id: '" + data.id + "' having Property:" + row.property + " and Locale: " + row.locale);

                                        } else if (translation.property == row.property && translation.locale == row.locale && translation.value == row.value) {
                                            checkArr = false;
                                            $scope.logs[indexId]["body"].push("Value found same for  id: '" + data.id + "' having Property:" +  row.property + " and Locale: " + row.locale)
                                        }
                                    });

                                    if (checkArr) {
                                        translationArr.push({
                                            "property": row.property,
                                            "locale": row.locale,
                                            "value": row.value
                                        });
                                        checkData = true;
                                        checkArr = false;
                                        $scope.logs[indexId]["body"].push("Added Value: " + row.value + " for  id: '" + data.id + "' having Property:" +  row.property + " and Locale: " + row.locale);

                                    }

                                })

                                if (checkData) {

                                    data.translations = translationArr;
                                    $http.put(url, data).then(function (response) {
                                        console.log(response)
                                        $scope.logs[indexId]["tail"] = "Updated value for '" + data.displayName + "' with id: '" + data.id + "'";
                                    })
                                    checkData = false;
                                }

                            });

                            // console.log(JSON.parse(json_object));
                            // console.log('here is json format of the data read from excel', json_object)
                            // jQuery( '#xlx_json' ).val( json_object );
                        })
                    }
                    // Here is your object

                    //    console.log('here is data', data);    
                })
            }
        }
        $scope.getSet = function () {
            var file = document.getElementById('upload').files[0]
            if (!file) {
                alert('Please Choose a File!')
                return
            }
            switch (file.type) {
                case 'text/csv':
                    parseCSV(file)
                    break
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                case 'application/vnd.ms-excel':
                    parseExcel(file)
                    break
                default:
                    alert('Unsupported Format')
                    break
            }

        }
    })