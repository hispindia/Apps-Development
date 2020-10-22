/**
 * Created by hisp on 2/12/15.
 */

var excelImportAppServices = angular.module('excelImportAppServices', [])
    .service('MetadataService', function () {
        return {
            getOrgUnit: function (id) {
                var def = $.Deferred();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    url: '../../organisationUnits/' + id + ".json?fields=id,displayName,code&paging=false",
                    success: function (data) {
                        def.resolve(data);
                    }
                });
                return def;
            },
            getDataElements: function (id) {
                var def = $.Deferred();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    url: "../../dataElements.json?paging=false",
                    success: function (data) {
                        def.resolve(data);
                    }
                });
                return def;
            },
            getChildrenOU: function (id) {
                var def = $.Deferred();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    url: "../../organisationUnits/" + id + ".json?fields=id,name,children[id,name]&paging=false",
                    success: function (data) {
                        def.resolve(data);
                    }
                });
                return def;
            },
            postExcelData: function (payload) {
                console.log('here is paylaod', payload)
                var def = $.Deferred();
                $.ajax({
                    async: false,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    url: '../../dataValueSets',
                    data: JSON.stringify(payload),
                    success: function (response) {
                        def.resolve(response);
                    }
                });
                return def;
            },
        }
    });
