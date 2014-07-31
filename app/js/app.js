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
  'pascalprecht.translate',
  'myApp.vacationApproval'
]);

app.constant('MONGOLAB_CONFIG',
    {API_KEY:'SX4PfDQhzWoek3EnS6FdYo-fWaxO7cQI', DB_NAME:'datagraph'});
app.config(['$provide','$routeProvider','$httpProvider','$translateProvider','$translatePartialLoaderProvider',
    function($provide,$routeProvider,$httpProvider,$translateProvider,$translatePartialLoaderProvider) {

    // Intercept http calls.
    $provide.factory('MyHttpInterceptor', function () {
        return {
            // On request success
            request: function (config) {
                // console.log(config); // Contains the data about the request before it is sent.
                var data = angular.copy(config.data);
                Utils.transformDatesToISOString(data);
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
                Utils.transformISOStringToDates(response.data);
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

    $translateProvider.preferredLanguage('cz');

    _.extend(Validation.MessageLocalization.defaultMessages,Localization.ValidationMessages);

  $routeProvider.when('/edit/:id', {templateUrl: 'partials/form.tpl.html', controller: 'VacationApprovalCtrl',
      resolve: {
          docInstance: function ($route, Doc) {
              return Doc.getById($route.current.params.id);
          }
      }
  })
  $routeProvider.when('/new', {templateUrl: 'partials/form.tpl.html', controller: 'VacationApprovalCtrl',
      resolve: {
          docInstance: function (Doc) {
              var doc = new Doc();
              doc.data = {};
              return doc;
          }
      }


  });
  $routeProvider.when('/docs', {templateUrl: 'partials/docs.tpl.html', controller: 'DocsCtrl'});
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.tpl.html', controller: 'DocsCtrl'});
  $routeProvider.otherwise({redirectTo: '/docs'});
}]);


