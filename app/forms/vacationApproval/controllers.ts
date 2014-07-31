///<reference path='../../../typings/angularjs/angular.d.ts'/>
///<reference path='../../../typings/node-form/node-form.d.ts'/>

///<reference path='../../js/controllers.ts'/>
///<reference path='../../bower_components/node-form-models/dist/vacationApproval/vacationApproval.d.ts'/>

class VacationApprovalCtrl extends DocCtrl{

    private Model:VacationApproval.BusinessRules;
    constructor($scope: any, data: any,$translate, $translatePartialLoader,param:any) {
        super($scope,data);

        $translatePartialLoader.addPart('vacationApproval');
        $translate.refresh();


        this.Model = new VacationApproval.BusinessRules($scope.data.data,param);
        $scope.model = this.Model;
        if ($scope.model.Data.Duration === undefined) $scope.model.Data.Duration = {From :new Date(),To:new Date()};


        $scope.name = "VacationRequest";

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
        $scope.vacationDays = [];

        if ($scope.model.Data.Duration.ExcludedDays == undefined) $scope.model.Data.Duration.ExcludedDays = [];
        $scope.excludedDays = $scope.model.Data.Duration.ExcludedDays;

        $scope.excludedDaysContains = function(idx) {
            return $scope.excludedDaysIndexOf(idx) != -1;

            //return _.any($scope.excludedDays,function(item:Date) {return moment(item).isSame(idx);})
            //return $scope.excludedDays.indexOf(idx) != -1;
        };

        $scope.excludedDaysIndexOf = function(idx){
            for (var i=0; i != $scope.excludedDays.length; i++)
            {
                var item = $scope.excludedDays[i];
                if (moment(item).isSame(idx)) return i;
            }
            return -1;
        };

        $scope.toggleExcludedDays = function (idx) {
            var selection = $scope.excludedDays;
            var pos = $scope.excludedDaysIndexOf(idx);
            if (pos == -1) {
                selection.push(idx);
            } else {
                selection.splice(pos, 1);
            }
        };

        $scope.refreshVacationDays = function(){

            //reset array
            $scope.vacationDays.splice(0,$scope.vacationDays.length);

            //fill
            _.each($scope.model.Duration.RangeWeekdays,function(item:Moment ){
                $scope.vacationDays.push(item.toDate());}
            )
        }

        $scope.$watch('model.Data.Duration.ExcludedDaysChecked',function(newValue,oldValue,scope){
            if (!!!newValue) $scope.resetExcludedDays();
        })

        $scope.resetExcludedDays = function() {
            //reset excluded days
            $scope.excludedDays.splice(0, $scope.excludedDays.length);
        }

        $scope.rangeChange = function(){
            $scope.resetExcludedDays();
            $scope.refreshVacationDays();
        }
        $scope.refreshVacationDays();
        $scope.days = function(){
            var from = moment($scope.model.Data.Duration.From);
            var to = moment($scope.model.Data.Duration.To);
            if (!from.isValid() || !to.isValid()) return undefined;
            return $scope.model.Duration.VacationDaysCount;
        }
    }

    public OnBeforeSave(){
        super.OnBeforeSave();
        this.Model.Data.Duration.Days = this.Model.Duration.VacationDaysCount;
    }
}

angular.module('myApp.vacationApproval', [])
    .controller('VacationApprovalCtrl', ['$scope','docInstance','$translate','$translatePartialLoader','param', VacationApprovalCtrl]);