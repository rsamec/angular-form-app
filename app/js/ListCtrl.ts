///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>

interface IGenericListScope extends ng.IScope {
    selection:Array<string>;
    toggle(id:string):void;
    changeLanguage(langKey:string):void;

    search:any;
 }
var Localization:any;
class GenericListCtrl{
    constructor($scope: IGenericListScope,$translate,$translatePartialLoader) {


        $translatePartialLoader.addPart('docs');
        $translate.refresh();


        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $translate.refresh();
            $.getScript("bower_components/business-rules-engine/dist/module/i18n/messages_" + langKey + ".js", function(){
                _.extend(Validation.MessageLocalization.defaultMessages, Localization.ValidationMessages);
            })
        };


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