/**
 * Created by hisp on 1/12/15.
 */

var excelImport = angular.module('excelImport',['ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngMessages',
    'd2HeaderBar',
    'd2Directives',
    'd2Filters',
    'd2Services',
    'pascalprecht.translate',
    'excelImportAppServices',
    'jsonFormatter',
])

.config(function($routeProvider,$translateProvider){
        $routeProvider.when('/', {
            templateUrl:'views/home.html',
            controller: 'importController'
        }).when('/tracker-data-import', {
            templateUrl:'views/trackerDataImport.html',
            controller: 'importController'
        })
        .when('/aggregated-data-import', {
            templateUrl:'views/aggregatedDataImport.html',
            controller: 'aggregatedataimportController'
        })
        .otherwise({
            redirectTo : '/'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');
    })
