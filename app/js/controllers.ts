///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/formValidation/form.d.ts'/>

///<reference path='../models/VacationApproval.ts'/>

'use strict';


/* Controllers */
interface IDocScope extends ng.IScope {
    validate(): void;
    reset(): void;
    showMessage(): void;
    showError(reason): void;
    save():void;

    data:any;
    model:any;

    name:string;
    version:string;
    created:Date;
    updated:Date;
}
class DocCtrl{

    constructor($scope: IDocScope, data: any){
        $scope.data = data;
        //$scope.model = new Models.VacationApproval($scope.data.data,param);

        $scope.validate = function () {
            $scope.model.Errors.SetDirty();
            $scope.model.Validate();
        }

        $scope.reset = function(){
            $scope.model.Errors.SetPristine();
        }

        var createdSuccess = function(response){
            if (!$scope.data.$id()) {
                $scope.data._id = response._id;
            }
            $scope.created = new Date();
            $scope.updated = new Date();
        }

        var updatedSuccess = function(response){
            $scope.updated = new Date();
        }

        $scope.save = function() {
            $scope.validate();
            if ($scope.model.Errors.HasErrors) {
                return;
            }

            $scope.data.$saveOrUpdate(createdSuccess,updatedSuccess,$scope.showError, $scope.showError)
        }


        $scope.showError = function(reason){
            alert(reason);
        }

    }


}
class VacationApprovalCtrl extends DocCtrl{
    constructor($scope: any, data: any, param:any) {
        super($scope,data);

        $scope.model = new Models.VacationApproval($scope.data.data,param);
        if ($scope.model.Data.Duration === undefined) $scope.model.Data.Duration = {From :new Date(),To:new Date()};

        $scope.name = "Vacation Approval";

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.openFrom = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedFrom = true;
        };
        $scope.openTo = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedTo = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
    }
}
angular.module('myApp.controllers', [])
    .controller('VacationApprovalCtrl', ['$scope','docInstance','param', VacationApprovalCtrl])

    .controller('ErrorCtrl',function($scope) {
        $scope.model.Errors["SummaryMessage"] = function () {
            if (!this.HasErrors) return "";
            var errorCount = this.ErrorCount;
            switch (errorCount) {
                case 0:
                    return "";
                case 1:
                    return Validation.StringFce.format("{ErrorCount} chyba.", this);
                case 2:
                case 3:
                case 4:
                    return Validation.StringFce.format("{ErrorCount} chyby.", this);
                default:
                    return Validation.StringFce.format("{ErrorCount} chyb.", this);
            }
        };


    })

    .controller('DocsCtrl',function($scope,$http,$location,Doc) {
        Doc.all(function(docs){
            $scope.docs = docs;
            $scope.edit = function(id){
                if (id != undefined) {
                    $location.path("/edit/" + id);
                }

            }

            $scope.selection = [];

            $scope.toggle = function (idx) {
                var pos = $scope.selection.indexOf(idx);
                if (pos == -1) {
                    $scope.selection.push(idx);
                } else {
                    $scope.selection.splice(pos, 1);
                }
            };
        });
    });
