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
    {API_KEY:'SX4PfDQhzWoek3EnS6FdYo-fWaxO7cQI', DB_NAME:'datagraph'});
app.config(['$routeProvider','$httpProvider','$translateProvider', function($routeProvider,$httpProvider,$translateProvider) {

    $httpProvider.defaults.transformResponse.push(function (responseData) {
        Utils.transformISOStringToDates(responseData);
        return responseData;
    });


    $translateProvider.translations('en', {
        HEADLINE: 'Hello there, This is my awesome app!',
        INTRO_TEXT: 'And it has i18n support!',
        Employee:'Employee',
        Name:'Name',
        FirstName: 'First name',
        LastName: 'Last name',
        Duration:'Duration',
        From: 'From',
        To: 'To',
        Deputy1:'Deputy',
        Deputy2:'Next deputy',
        DiffNames:'Duplicate names',
        BeforeDate: JSON.stringify({
            Format:'MM/DD/YYYY',
            Msg:"Date from '{From}' must preceed date to '{To}'."
        }),
        dateCompareExt: JSON.stringify({
            Format:'MM/DD/YYYY',
            Msg:"Date must be between '{From}' - '{To}'."
        }),
        DAYS_TEXT:'day(s)'

    })
    .translations('cz', {
            HEADLINE: 'Hey, das ist meine großartige App!',
            INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!',
            Employee: 'Zaměstnanec',
            Name:'Jméno a příjmení',
            FirstName: 'Jméno',
            LastName: 'Příjmení',
            Duration: 'Doba',
            From: 'Od',
            To: 'Do',
            Deputy1:'Zástupce',
            Deputy2:'Další zástupce',
            DiffNames:'Duplicitní jména',
            BeforeDate:JSON.stringify({
                Format:'DD/MM/YYYY',
                Msg:"Datum '{From}' musí být před datem '{To}."
            }),
            dateCompareExt: JSON.stringify({
                Format:'MM/DD/YYYY',
                Msg:"Datum musí být mezi ('{From}' - '{To}')."
            }),
            DAYS_TEXT:'den(dnů)'


        })

    $translateProvider.preferredLanguage('cz');

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
  $routeProvider.otherwise({redirectTo: '/docs'});
}]);


