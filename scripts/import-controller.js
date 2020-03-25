/**
 * Created by harsh on 6/5/16.
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
                        var json_object = JSON.stringify(XL_row_object);
                        var objectKeys = Object.keys(XL_row_object["0"]);

                        XL_row_object.forEach(row => {
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
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(updateEventDataValue),
                                url: '../../events/' + row.event + '/' + row.dataElement,
                                success: function (response) {
                                    //console.log( __rowNum__ + " -- "+ row.event + "Event updated with " + row.value + "response: " + response );
                                    console.log( JSON.stringify(row) + " updated value " + row.value + " response: " + JSON.stringify(response) );
                                },
                                error: function (response) {
                                    console.log(  JSON.stringify(row) +  " not updated value " + row.value + " response: " + JSON.stringify(response ));
                                },
                                warning: function (response) {
                                    console.log( JSON.stringify(row ) +  " -- "+ "Warning!: " +  JSON.stringify(response ) );
                                }
                            });


                        });

                    }
					
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