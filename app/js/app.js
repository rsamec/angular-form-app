'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers',
    'mongolabResourceHttp',
    'ui.bootstrap',
    'pascalprecht.translate'
]);

app.constant('MONGOLAB_CONFIG',
    {API_KEY: 'SX4PfDQhzWoek3EnS6FdYo-fWaxO7cQI', DB_NAME: 'documents'});
app.config(['$controllerProvider', '$provide', '$routeProvider', '$httpProvider', '$translateProvider', '$translatePartialLoaderProvider',
    function ($controllerProvider, $provide, $routeProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider) {

        app.register = {
            controller: $controllerProvider.register
        };


        // Intercept http calls.
        $provide.factory('MyHttpInterceptor', function () {
            return {
                // On request success
                request: function (config) {
                    // console.log(config); // Contains the data about the request before it is sent.
                    if (config.data === undefined) return config;
                    var data = angular.copy(config.data);
                    AppUtils.transformDatesToISOString(data);
                    config.data = data;
                    return config;

                },

                // On request failure
                requestError: function (rejection) {
                    // console.log(rejection); // Contains the data about the error on the request.

                    // Return the promise rejection.
                    return rejection;
                },

                // On response success
                response: function (response) {
                    // console.log(response); // Contains the data from the response.

                    // Return the response or promise.
                    AppUtils.transformISOStringToDates(response.data);
                    return response;
                },

                // On response failture
                responseError: function (rejection) {
                    // console.log(rejection); // Contains the data about the error.

                    // Return the promise rejection.
                    return rejection;
                }
            };
        });


        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('MyHttpInterceptor');
//    $httpProvider.defaults.transformResponse.push(function (responseData) {
//        Utils.transformISOStringToDates(responseData);
//        return responseData;
//    });
//    $httpProvider.defaults.transformRequest.push(function (reqeuestData) {
//        Utils.transformDatesToISOString(reqeuestData);
//        return reqeuestData;
//    });

        $translatePartialLoaderProvider.addPart('docs');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/app/i18n/{part}/{lang}.json'
        });

//    $translateProvider.useStaticFilesLoader({
//        prefix: 'bower_components/node-form-models/dist/vacationApproval/i18n/',
//        suffix: '.json'
//    });

        $translateProvider.preferredLanguage('en');

        _.extend(Validation.MessageLocalization.defaultMessages, Localization.ValidationMessages);

        var formCtrl = function (formId, docInstance) {
            return {
                controller: formId + "Ctrl",
                templateUrl: 'partials/form.tpl.html',
                controllerAs: 'va',
                resolve: {
                    docInstance: docInstance,
                    load: function ($q, $route, $rootScope) {

                        var deferred = $q.defer();

                        //var formId =  $route.current.params.form;
                        var dependencies = [
                                'bower_components/business-rules/dist/' + formId + '/business-rules.js',
                                'forms/' + formId + '/controllers.js'
                        ];

                        $script(dependencies, function () {
                            $rootScope.$apply(function () {
                                deferred.resolve();
                            });
                        });

                        return deferred.promise;
                    }
                }
            }
        };
        var newFormCtrl = function (formId) {
            return formCtrl(formId,
                function (Doc) {
                    var doc = new Doc();
                    doc.data = {};
                    return doc;
                })
        };

        var editFormCtrl = function (formId) {
            return formCtrl(formId,
                function ($route, Doc) {
                    return Doc.getById($route.current.params.id);
                })
        };

        $routeProvider.when('/vacationApproval/edit/:id', editFormCtrl("vacationApproval"));
        $routeProvider.when('/hobbies/edit/:id', editFormCtrl("hobbies"));

        $routeProvider.when('/vacationApproval/new', newFormCtrl("vacationApproval"));
        $routeProvider.when('/hobbies/new', newFormCtrl("hobbies"));

        $routeProvider.when('/docs', {templateUrl: 'partials/docs.tpl.html', controller: 'DocsCtrl'});
        $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.tpl.html', controller: 'VacationDashboardCtrl'});
        $routeProvider.otherwise({redirectTo: '/docs'});
    }]);

$().ready(function () {
    /* For theme switching */
    var themeName = $.cookie("themeName");
    var themePath = $.cookie("themePath");
    if (themeName !== undefined) {
        setTheme(themeName, themePath);
    }
});

function setTheme(themeName, themePath) {

    $('#bootstrapTheme').attr('href', themePath.substr(1) + "bootstrap.css");
    $.cookie("themeName", themeName, { expires: 7, path: "/" });
    $.cookie("themePath", themePath, { expires: 7, path: "/" });
}



