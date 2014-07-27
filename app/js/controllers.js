///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/node-form/node-form.d.ts'/>
'use strict';
var DocCtrl = (function () {
    function DocCtrl($scope, data) {
        $scope.data = data;

        //$scope.model = new Models.VacationApproval($scope.data.data,param);
        $scope.validate = function () {
            $scope.model.Errors.SetDirty();
            $scope.model.Validate();
        };

        $scope.reset = function () {
            $scope.model.Errors.SetPristine();
        };

        var createdSuccess = function (response) {
            if (!$scope.data.$id()) {
                $scope.data._id = response._id;
            }
            $scope.created = new Date();
            $scope.updated = new Date();
        };

        var updatedSuccess = function (response) {
            $scope.updated = new Date();
        };

        $scope.save = function () {
            $scope.validate();
            if ($scope.model.Errors.HasErrors) {
                return;
            }

            $scope.data.$saveOrUpdate(createdSuccess, updatedSuccess, $scope.showError, $scope.showError);
        };

        $scope.showError = function (reason) {
            alert(reason);
        };
    }
    return DocCtrl;
})();

angular.module('myApp.controllers', []).controller('ErrorCtrl', function ($scope, $translate) {
    $scope.model.Errors["SummaryMessage"] = function () {
        if (!this.HasErrors)
            return "";
        var errorCount = this.ErrorCount;
        switch (errorCount) {
            case 0:
                return "";
            case 1:
                return Validation.StringFce.format("{ErrorCount} error.", this);
            case 2:
            case 3:
            case 4:
                return Validation.StringFce.format("{ErrorCount} errors.", this);
            default:
                return Validation.StringFce.format("{ErrorCount} errors.", this);
        }
    };
}).controller('DocsCtrl', function ($scope, $http, $location, Doc) {
    Doc.all(function (docs) {
        $scope.docs = docs;
        $scope.edit = function (id) {
            if (id != undefined) {
                $location.path("/edit/" + id);
            }
        };

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
//# sourceMappingURL=controllers.js.map
