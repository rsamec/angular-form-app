///<reference path='../../../typings/angularjs/angular.d.ts'/>
///<reference path='../../../typings/node-form/node-form.d.ts'/>

///<reference path='../../js/controllers.ts'/>
///<reference path='../../bower_components/node-form-models/dist/vacationApproval/vacationApproval.d.ts'/>

class VacationApprovalCtrl extends DocCtrl{
    constructor($scope: any, data: any, param:any) {
        super($scope,data);


        $scope.model = new VacationApproval.BusinessRules($scope.data.data,param);
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

        $scope.days = function(){
            var from = moment($scope.model.Data.Duration.From);
            var to = moment($scope.model.Data.Duration.To);
            if (!from.isValid() || !to.isValid()) return undefined;
            return moment.duration(to.startOf('days').diff(from.startOf('days'))).days();
        }
    }
}

angular.module('myApp.vacationApproval', [])
    .controller('VacationApprovalCtrl', ['$scope','docInstance','param', VacationApprovalCtrl]);