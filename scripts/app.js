var isolateTransferApp = angular.module("isolateTransferApp", ['ngRoute']).config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/dispatch-new-sample.html',
        controller: 'dispatchNewSample'
    }).when('/create-new-transfer', {
        templateUrl: 'views/create-new-transfer.html',
        controller: 'createNewTransfer'
    }).when('/edit-transfer', {
        templateUrl: 'views/edit-transfer.html',
        controller: 'editTransfer'
    }).when('/sample-sent-for-quality-check', {
        templateUrl: 'views/sample-sent-for-quality-check.html',
        controller: 'sampleSentForQualityCheck'
    })

})