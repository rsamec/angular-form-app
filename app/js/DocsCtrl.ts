///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/jquery/jquery.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='ListCtrl.ts'/>

interface IDocsScope extends  IGenericListScope  {
    newDoc(formId:string):void;
    edit(formId:string, docId:string):void;
    getAllDocs():void;
    getAllForms():void;
    cancelDocs():void;



    forms:any;
    docs:any;
 }

class DocsCtrl extends GenericListCtrl {
    constructor($scope: IDocsScope,Doc,Form,$location,$translate,$translatePartialLoader) {
        super($scope,$translate,$translatePartialLoader);

        $scope.newDoc = function(formId){
            if (formId !== undefined) {
                $location.path("/" + formId + "/new");
            }
        }

        $scope.edit = function(formId, id){

            if (formId !== undefined && id !== undefined) {
                $location.path("/" + formId + "/edit/" + id);
            }
        }

        $scope.getAllDocs = function() {
            Doc.all(function (items) {
                $scope.docs = items;
            });
        }
        $scope.getAllDocs();

        $scope.getAllForms = function() {
            Form.all(function (items) {
                $scope.forms = items;
            });
        }
        $scope.getAllForms();


        $scope.cancelDocs = function(){
            if ($scope.selection.length == 0) return;

            var toRemove = _.filter($scope.docs,function(item:any) {
                    return $scope.selection.indexOf(item.$id())!==-1}
            );
            _.each(toRemove,function(item:any){
                item.$remove();
                //TODO: all items removed : refresh
                //$scope.getAllDocs();
                //$scope.$apply();
            });

        }
    }


}