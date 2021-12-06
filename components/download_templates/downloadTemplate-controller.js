/* global excelUpload, angular */

//Controller for excel importing
excelUpload.controller('DownLoadTemplateController',
        function($rootScope,
                $scope,
                $timeout,
                $route,
                $filter,
                $http,
                ExcelMappingService,
                ValidationRuleService,
                CurrentSelection,
                ExcelReaderService,
                MetaDataFactory,
                orderByFilter,
                OrgUnitService,
                DialogService) {
    
    $scope.selected = {};
    $scope.templates = {};
	$scope.commonPool = {};
	$scope.history = {};
    $scope.dataSets = [];
    $scope.organisationUnits = [];
    $scope.selectedDataSetInfo = {};
	$scope.selectedOuChildren = {};
	$scope.currentAction = 0; // 1 for managing templates , 2 for data import, 3 for settings
	
	//uploaded template cells
	$scope.tempCells = [];
	
	//data cells
	$scope.dataCells = [];
	
	$scope.engAddress = ["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];		
	
    $scope.authority = '';

	$("#loader").hide();

});