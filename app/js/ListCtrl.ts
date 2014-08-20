///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>

interface IGenericListScope extends ng.IScope {
    selection:Array<string>;
    toggle(id:string):void;

    search:any;
 }
class GenericListCtrl{
    constructor($scope: IGenericListScope) {

        $scope.search = {};
        $scope.selection = [];

        $scope.toggle = function (idx) {
            var pos = $scope.selection.indexOf(idx);
            if (pos == -1) {
                $scope.selection.push(idx);
            } else {
                $scope.selection.splice(pos, 1);
            }
        };
    }
}