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

                    // event update
                    if( sheetName === 'eventDataValueUpdate' ){
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