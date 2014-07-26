///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/formValidation/form.d.ts'/>
///<reference path='../models/VacationApproval.ts'/>
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var VacationApprovalCtrl = (function (_super) {
    __extends(VacationApprovalCtrl, _super);
    function VacationApprovalCtrl($scope, data, param) {
        _super.call(this, $scope, data);

        $scope.model = new Models.VacationApproval($scope.data.data, param);
        if ($scope.model.Data.Duration === undefined)
            $scope.model.Data.Duration = { From: new Date(), To: new Date() };

        $scope.name = "Vacation Approval";

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.openFrom = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedFrom = true;
        };
        $scope.openTo = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedTo = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.days = function () {
            var from = moment($scope.model.Data.Duration.From);
            var to = moment($scope.model.Data.Duration.To);
            if (!from.isValid() || !to.isValid())
                return undefined;
            return moment.duration(to.startOf('days').diff(from.startOf('days'))).days();
        };
    }
    return VacationApprovalCtrl;
})(DocCtrl);
angular.module('myApp.controllers', []).controller('VacationApprovalCtrl', ['$scope', 'docInstance', 'param', VacationApprovalCtrl]).controller('ErrorCtrl', function ($scope, $translate) {
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
