///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/node-form/node-form.d.ts'/>


/* Controllers */
interface IDocScope extends ng.IScope {
    validate(): Q.Promise<any>;
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
    constructor($scope: IDocScope,public Data: any){

        $scope.data = this.Data;
        //$scope.model = new Models.VacationApproval($scope.data.data,param);

        $scope.validate = function () {
            $scope.model.Errors.SetDirty();
            return $scope.model.Validate();
            //return $scope.model.ValidateAsync();
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
        var self = this;
        $scope.save = function() {
            $scope.validate().then(function (result) {
                if ($scope.model.Errors.HasErrors) {
                    return;
                }
                self.OnBeforeSave();
                $scope.data.$saveOrUpdate(createdSuccess, updatedSuccess, $scope.showError, $scope.showError);
            },$scope.showError);
        }

        $scope.showError = function(reason){
            alert(reason);
        }
    }
    public OnBeforeSave(){
        var today = new Date();
        if (this.Data.created === undefined) this.Data.created = today;
        this.Data.updated = today;
    }
}