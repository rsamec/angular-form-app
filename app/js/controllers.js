///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/node-form/node-form.d.ts'/>
'use strict';
var DocCtrl = (function () {
    function DocCtrl($scope, Data) {
        this.Data = Data;
        $scope.data = this.Data;

        //$scope.model = new Models.VacationApproval($scope.data.data,param);
        $scope.validate = function () {
            $scope.model.Errors.SetDirty();
            $scope.model.Validate();
            return $scope.model.ValidateAsync();
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
        var self = this;
        $scope.save = function () {
            $scope.validate().then(function (result) {
                if ($scope.model.Errors.HasErrors) {
                    return;
                }
                self.OnBeforeSave();
                $scope.data.$saveOrUpdate(createdSuccess, updatedSuccess, $scope.showError, $scope.showError);
            }, $scope.showError);
        };

        $scope.showError = function (reason) {
            alert(reason);
        };
    }
    DocCtrl.prototype.OnBeforeSave = function () {
        this.Data["Updated"] = new Date();
    };
    return DocCtrl;
})();

angular.module('myApp.controllers', []).controller('ErrorCtrl', function ($scope, $translate) {
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
}).controller('DocsCtrl', function ($scope, $http, $location, Doc, $translate, $translatePartialLoader) {
    $translatePartialLoader.addPart('docs');
    $translate.refresh();
    var queryByLastName = { 'data.Employee.LastName': 'Samcova' };
    var today = moment().startOf('days').toDate();
    var tomorrow = moment().startOf('days').add({ 'days': 1 }).toDate();
    var end = new Date(2020, 1, 1);

    //        var queryFuture = {$query: {'data.Duration.From':{"$gte": tomorrow}, $orderby:{'data.Duration.From': 1}}};
    var queryFuture = { 'data.Duration.From': { "$gte": tomorrow } };
    var queryToday = { 'data.Duration.From': { "$gte": today, "$lt": tomorrow } };
    var queryOld = { 'data.Duration.To': { "$lt": today } };

    var options = { sort: { 'data.Duration.From': 1 } };

    $scope.search = {};
    $scope.getAllDocs = function () {
        Doc.all(function (docs) {
            $scope.docs = docs;
        });
    };
    $scope.getAllDocs();

    Doc.query(queryFuture, options, function (docs) {
        $scope.docsQueryFuture = docs;
    });
    Doc.query(queryToday, options, function (docs) {
        $scope.docsQueryToday = docs;
    });
    Doc.query(queryOld, options, function (docs) {
        $scope.docsQueryOld = docs;
    });

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

    $scope.cancelDocs = function () {
        if ($scope.selection.length == 0)
            return;

        var toRemove = _.filter($scope.docs, function (item) {
            return $scope.selection.indexOf(item.$id()) != -1;
        });
        _.each(toRemove, function (item) {
            item.$remove();
        });

        $scope.getAllDocs();
    };
});
//# sourceMappingURL=controllers.js.map
