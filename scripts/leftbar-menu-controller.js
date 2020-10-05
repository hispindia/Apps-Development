//Controller for column show/hide
excelImport.controller('LeftBarMenuController',function($scope,$location, $timeout, MetadataService) {
     $scope.selectedOrgUnit = {
            id: "",
            name: ""
     }
    $scope.payLoad={
        orgUnit: "",
        period: ""
    }
     $scope.years= []
    selection.load();      
    $scope.TrackerPanel = function(){
        $location.path('/tracker-data-import').search();
    }; 
    $scope.AggregatedPanel = function(){
        $location.path('/aggregated-data-import').search();
    }; 
    $scope.GoBack = function(){
        $window.history.back();
    }
    selection.setListenerFunction(function () {
        var selectedSelection = selection.getSelected();
        $scope.selectedOrgUnit.id = selectedSelection["0"];
        MetadataService.getOrgUnit($scope.selectedOrgUnit.id).then(function (ouRes) {
            $timeout(function () {
                $scope.selectedOrgUnit.name = ouRes.organisationUnits["0"].displayName;
                $scope.payLoad.orgUnit = ouRes.organisationUnits["0"].id;
            })
        });
        
    }, false);
    var date = new Date()
    for(let year=date.getFullYear(); year>2010; year--){
        $scope.years.push(year)
    }
    $scope.getPeriod = function(){
        $scope.payLoad.period = $("#period").val();  
    }
// var datesss = [{
// orgUnit: A3,
// YearlyDataElemets [{ b2: deUid},{ M2: deUid}],
// MonthlyDataElements [{ n2: deUid}, {z2: deuid}]
    console.log('here is payload',$scope.payLoad)
});