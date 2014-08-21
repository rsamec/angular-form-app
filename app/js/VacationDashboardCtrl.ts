///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='ListCtrl.ts'/>

interface IVacationDashboardScope extends IGenericListScope {
    edit(id):void;

    docsQueryFuture:any;
    docsQueryToday:any;
    docsQueryOld:any;
}
class VacationDashboardCtrl extends GenericListCtrl {
    constructor($scope: IVacationDashboardScope,Doc,$location,$translate,$translatePartialLoader) {
        super($scope,$translate,$translatePartialLoader);

        $scope.edit = function(id){
            if (id != undefined) {
                $location.path("/edit/" + id);
            }
        }

        var today = moment().startOf('days').toDate();
        var tomorrow = moment().startOf('days').add({'days':1}).toDate();
        var queryFuture = { 'data.Duration.From':{"$gte": tomorrow}};
        var queryToday = {'data.Duration.From':{"$gte": today, "$lt": tomorrow}};
        var queryOld = {'data.Duration.To':{"$lt": today}};

        var options = {sort:{'data.Duration.From':1}}

        Doc.query(queryFuture,options,function(docs){
            $scope.docsQueryFuture = docs;
        });
        Doc.query(queryToday,options,function(docs){
            $scope.docsQueryToday = docs;
        });
        Doc.query(queryOld,options,function(docs){
            $scope.docsQueryOld = docs;
        });
    }
}