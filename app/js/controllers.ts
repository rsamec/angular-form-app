///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/node-form/node-form.d.ts'/>

///<reference path='DocsCtrl.ts'/>
///<reference path='VacationDashboardCtrl.ts'/>
'use strict';

angular.module('myApp.controllers', [])
    .controller('ErrorCtrl',function($scope,$translate)
    {
//        $translate('Error').then(function() {
//
//        });

//        $scope.model.Errors["SummaryMessage"] = function () {
//            if (!this.HasErrors) return "";
//            var errorCount = this.ErrorCount;
//            switch (errorCount) {
//                case 0:
//                    return "";
//                case 1:
//                    return Validation.StringFce.format("{ErrorCount} error.", this);
//                case 2:
//                case 3:
//                case 4:
//                    return Validation.StringFce.format("{ErrorCount} errors.", this);
//                default:
//                    return Validation.StringFce.format("{ErrorCount} errors.", this);
//            }
//        };


    })
    .controller('DocsCtrl',DocsCtrl)
    .controller('VacationDashboardCtr',VacationDashboardCtrl);
