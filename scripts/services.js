/**
 * Created by hisp on 2/12/15.
 */

var excelImportAppServices = angular.module('excelImportAppServices', [])
    .service('MetadataService',function(){
       return {
            getRootOrgUnit : function(){
                var def = $.Deferred();
               $.ajax({
                    type: "GET",
                    dataType: "json",
                   contentType: "application/json",
                    url: '../../organisationUnits?level=1&fields=id,name',
                    success: function (data) {
                        def.resolve(data.organisationUnits);
                    }
                });
               return def;
            },
           getOrgUnitGrpMembers : function(){
               var def = $.Deferred();
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   contentType: "application/json",
                   url: '../../organisationUnitGroups/pWtzmP5XVRC.json?fields=id,name,organisationUnits[id,name]&paging=false',
                   success: function (data) {
                       def.resolve(data.organisationUnits);
                   }
               });
               return def;
           },
           loadOrgUnits : function(id){
               var def = $.Deferred();
               var orgUnitMap = [];
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   async: false,
                   contentType: "application/json",
                   //url: '../../organisationUnits/'+id+".json?fields=id,name,programs[id,name,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name],sortOrder]]]",
                   // url: '../../organisationUnits/'+id+".json?fields=id,name,programs[id,name,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[options[code,displayName]]],sortOrder]]]&paging=false",
                   url: '../../organisationUnits.json?fields=id,code,name&paging=false',
                   success: function (orgUnitResponse) {
                       if (orgUnitResponse.organisationUnits.length !== 0) {
                           for (var i = 0; i < orgUnitResponse.organisationUnits.length; i++) {
                               orgUnitMap[orgUnitResponse.organisationUnits[i].code] = orgUnitResponse.organisationUnits[i].id;

                           }
                       }
                       def.resolve(orgUnitMap);
                   }
               });
               return def;
           },
           loadDataElements : function(){
               var def = $.Deferred();
               var dataElementResponseMap = [];
               $.ajax({
                   type: "GET",
                   dataType: "json",
                   async: false,
                   contentType: "application/json",
                   //url: '../../organisationUnits/'+id+".json?fields=id,name,programs[id,name,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name],sortOrder]]]",
                   // url: '../../organisationUnits/'+id+".json?fields=id,name,programs[id,name,programTrackedEntityAttributes[*],programStages[id,name,programStageDataElements[id,dataElement[id,name,optionSet[options[code,displayName]]],sortOrder]]]&paging=false",
                   url: '../../dataElements.json?fields=id,code,name,domainType&paging=false&filter=domainType:eq:AGGREGATE',
                   success: function (dataElementResponse) {
                       if (dataElementResponse.dataElements.length !== 0) {
                           for (var i = 0; i < dataElementResponse.dataElements.length; i++) {
                               dataElementResponseMap[dataElementResponse.dataElements[i].code] = dataElementResponse.dataElements[i].id;
                           }
                       }
                       def.resolve(dataElementResponseMap);
                   }
               });
               return def;
           }
           
    };
}); 