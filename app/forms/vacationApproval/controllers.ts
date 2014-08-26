///<reference path='../../../typings/angularjs/angular.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/jquery/jquery.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../js/DocCtrl.ts'/>
///<reference path='../../../typings/business-rules/vacationApproval.d.ts'/>


var app:any;
class VacationApprovalCtrl extends DocCtrl {

    public model:VacationApproval.BusinessRules;

    //vacation approval ctrl props
    public vacationDays:Array<any>;
    public excludedDays:Array<any>;

    //date picker props
    public dateOptions:any;
    public openedFrom:boolean;
    public openedTo:boolean;


    constructor($scope:any, docInstance:any,$translate, $translatePartialLoader, param:any) {
        super($scope, new VacationApproval.BusinessRules(docInstance.data, param),docInstance, $translate, $translatePartialLoader);

        if (this.model.Data.Duration === undefined) this.model.Data.Duration = {From: new Date(), To: new Date()};
        if (this.model.Data.Deputy1 === undefined) this.model.Data.Deputy1 = {FirstName:undefined,LastName:undefined};

        this.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.$watch('va.model.Data.Duration.ExcludedDaysChecked',
            function (newValue, oldValue, scope) {
                if (!!!newValue) scope.va.resetExcludedDays();
            });


        $scope.$watch('va.model.Data.Approval.ApprovedBy',
            function (newValue, oldValue, scope) {
                scope.va.copyApprovedBy();
            },true);

        $scope.$watch('va.model.Data.Approval.Checked',
            function (newValue, oldValue, scope) {
                scope.va.copyApprovedBy();
            },true);



        this.vacationDays = [];

        if (this.model.Data.Duration.ExcludedDays == undefined) this.model.Data.Duration.ExcludedDays = [];
        this.excludedDays = this.model.Data.Duration.ExcludedDays;

        this.refreshVacationDays();

    }

    // Disable weekend selection
    public disabled(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    }

    public openFrom($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.openedFrom = true;
    }

    public openTo = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        this.openedTo = true;
    }


    public excludedDaysContains(idx) {
        return this.excludedDaysIndexOf(idx) !== -1;
    }

    public excludedDaysIndexOf(idx) {
        for (var i = 0; i != this.excludedDays.length; i++) {
            var item = this.excludedDays[i];
            if (moment(item).isSame(idx)) return i;
        }
        return -1;
    }

    public toggleExcludedDays(idx) {
        var selection = this.excludedDays;
        var pos = this.excludedDaysIndexOf(idx);
        if (pos == -1) {
            selection.push(idx);
        } else {
            selection.splice(pos, 1);
        }
    }

    public refreshVacationDays() {

        //reset array
        this.vacationDays.splice(0, this.vacationDays.length);

        //fill
        _.each(this.model.Duration.RangeWeekdays, function (item:Moment) {
                this.vacationDays.push(item.toDate());
            },this)
    }



    public resetExcludedDays() {
        //reset excluded days
        this.excludedDays.splice(0, this.excludedDays.length);
    }

    public rangeChange() {
        this.resetExcludedDays();
        this.refreshVacationDays();
    }

    public days() {
        var from = moment(this.model.Data.Duration.From);
        var to = moment(this.model.Data.Duration.To);
        if (!from.isValid() || !to.isValid()) return undefined;
        return this.model.Duration.VacationDaysCount;
    }

    public copyApprovedBy() {
        if (this.model.Data.Approval !== undefined && this.model.Data.Approval.ApprovedBy.Checked) {
            var source = this.model.Data.Approval.ApprovedBy;
            var target = this.model.Data.Deputy1;

            target.FirstName = source.FirstName;
            target.LastName = source.LastName;
            target.Email = source.Email;

            this.model.Deputy1Validator.ValidateAll(target);
        }
    }


    public OnBeforeSave() {
        super.OnBeforeSave();
        this.data.desc = this.model.Data.Employee.FirstName + " " + this.model.Data.Employee.LastName;
        this.model.Data.Duration.Days = this.model.Duration.VacationDaysCount;
    }
}

//angular.module('myApp.vacationApproval', [])
//.controller('VacationApprovalCtrl', ['$scope','docInstance','$translate','$translatePartialLoader','param', VacationApprovalCtrl]);
app.register.controller('vacationApprovalCtrl',VacationApprovalCtrl);
//app.controller.$inject = ['$scope','docInstance','$translate','$translatePartialLoader','param'];

