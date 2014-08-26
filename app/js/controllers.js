///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='DocsCtrl.ts'/>
///<reference path='VacationDashboardCtrl.ts'/>
'use strict';
var setQ;
angular.module('myApp.controllers', []).controller('ErrorCtrl', function ($scope, $translate, $q) {
    setQ($q);
}).controller('DocsCtrl', DocsCtrl).controller('VacationDashboardCtr', VacationDashboardCtrl);
