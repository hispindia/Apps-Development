//Controller for column show/hide
excelImport.controller('LeftBarMenuController',function($scope,$location, $timeout, MetadataService) {
     $scope.selectedOrgUnit = {
            id: "",
            name: "",
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
   
});