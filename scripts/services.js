/**
 * Created by hisp on 2/12/15.
 */

var excelImportAppServices = angular.module('excelImportAppServices', [])
    .service('MetadataService',function(){
       return {
        getOrgUnit: function (id) {
            var def = $.Deferred();
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                url: '../../organisationUnits/' + id + ".json?fields=id,displayName,code&includeDescendants=true&paging=false",
                success: function (data) {
                    def.resolve(data);
                }
            });
            return def;
        },
        postExcelData: function (payload) {
            console.log('here is payload', payload)
            var def = $.Deferred();
            // $.ajax({
            //     type: "Post",
            //     dataType: "json",
             //    data: JSON.stringify(payload),
            //     contentType: "application/json",
            //     url: '../../organisationUnits/' + id + ".json?fields=id,displayName,code&includeDescendants=true&paging=false",
            //     success: function (data) {
            //         def.resolve(data);
            //     }
            // });
            return def;
        },
        
       }
    });
