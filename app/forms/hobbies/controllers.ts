///<reference path='../../../typings/angularjs/angular.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/jquery/jquery.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../js/DocCtrl.ts'/>
///<reference path='../../../typings/business-rules/hobbies.d.ts'/>

var app:any;
class HobbiesCtrl extends DocCtrl {

    public model:Hobbies.BusinessRules;


    constructor($scope:any, docInstance:any,$translate, $translatePartialLoader) {
        super($scope,new Hobbies.BusinessRules(docInstance.data), docInstance,$translate, $translatePartialLoader);

    }

    public OnBeforeSave() {
        super.OnBeforeSave();
        this.data.name = "Hobbies";
        this.data.desc = this.model.Data.Person.FirstName + " " + this.model.Data.Person.LastName;
    }
}

app.register.controller('hobbiesCtrl', HobbiesCtrl);