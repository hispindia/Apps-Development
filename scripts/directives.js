isolateTransferApp.directive('modalDialog', function () {
    return {
        restrict: 'E',
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
        },
        template: '<div class="ng-modal" ng-show="showModal"><div class="ng-modal-overlay"><div class="ng-modal-dialog"><div class="ng-modal-close" ng-click="showToggle()">X</div><div class="ng-modal-dialog-content" ng-transclude></div></div></div></div>'

    };
}).directive('popUp', function () {
    return {
        restrict: 'E',
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
        },
        template: '<div class="ng-popup" ng-show="showPopup"><div class="ng-popup-overlay"><div class="ng-popup-dialog"><div class="ng-popup-close"  ng-click="switch()">OK</div><div class="ng-popup-dialog-content" ng-transclude></div></div></div></div>'
    };
}).directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});