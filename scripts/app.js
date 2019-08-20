
var isolateTransferApp = angular.module("isolateTransferApp", ['ngRoute']
).config(function($routeProvider){
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

}).directive('modalDialog', function() {
    return {
      restrict: 'E',
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        console.log(attrs.width);
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
      },
      template:'<div class="ng-modal" ng-show="showModal"><div class="ng-modal-overlay"><div class="ng-modal-dialog"><div class="ng-modal-close" ng-click="showToggle()">X</div><div class="ng-modal-dialog-content" ng-transclude></div></div></div></div>'

    };
  });