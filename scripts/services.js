isolateTransferApp.service('MetadataService', function ($http, $q) {
    return {
        getOrgUnit: function (id) {
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: '../../organisationUnits/' + id + ".json?fields=id,name,code&paging=false",
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
        getAllPrograms: function () {
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: '../../programs.json?paging=false',
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
        getSQLView: function (sqlViewUID, param) {
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: '../../sqlViews/' + sqlViewUID + "/data?" + param + "&skipPaging=true",
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        }
    }
});

isolateTransferApp.service('storeService', function () {
    var arr = [];
    return {
        get: function () {
            return arr;
        },
        set: function (data) {
            arr = data
        }
    }

});

isolateTransferApp.service("dataStoreService", function ($http, $q) {
    return {
        saveInDataStore: function (getkey, value) {
            var promise;
            var key = getkey;
            var val = value;
            var value = JSON.stringify(value);
            url = '../../../api/dataStore.json'
            return $http.get(url).then(function (data) {
                if (data.data.indexOf("id") != -1) {
                    url1 = '../../../api/dataStore/id.json';
                    return $http.get(url1).then(function (data) {

                        if (data.data.indexOf(key) != -1) {
                            url = '../../../api/dataStore/id/' + key;
                            return $http.get(url).then(function (response) {
                                response.data[key].unshift(val[key]["0"]);
                                var vall = response.data;
                                return $http.put(url, vall)
                            })

                        } else {
                            url = '../../../api/dataStore/id/' + key;
                            return $http.post(url, value)

                        }
                    })
                } else {
                    url = '../../../api/dataStore/id/' + key;
                    return $http.post(url, value)

                }
            })
        },
        updateInDataStore: function (keys, value) {
            var def = $q.defer();
            var key = keys;
            var values = {}
            values[key] = value
            var url = '../../../api/dataStore/id/' + key;
            return $http.put(url, values)
        },
        get: function (key) {
            var promise = $http.get('../../../api/dataStore/id/' + key).then(function (response) {
                return response.data[key];
            }, function () {
                return "No value contains in the selected feild";
            });
            return promise;
        },
    }
});