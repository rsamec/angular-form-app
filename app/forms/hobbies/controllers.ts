///<reference path='../../../typings/angularjs/angular.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/jquery/jquery.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../js/DocCtrl.ts'/>
///<reference path='../../../typings/business-rules/hobbies.d.ts'/>

var app:any;
class HobbiesCtrl extends DocCtrl {

    public model:Hobbies.BusinessRules;


    constructor($scope:any, docInstance:any, $translate, $translatePartialLoader) {
        super($scope, new Hobbies.BusinessRules(docInstance.data), docInstance, $translate, $translatePartialLoader);

        if (this.model.Data.Hobbies === undefined) this.model.Data.Hobbies = [{}];

        this.model.MainValidator.Children["Hobbies"].RefreshRows(this.model.Data.Hobbies);
    }

    public get hobbyFrequencyOptions() {
        return [
            {text: 'Daily', value: Hobbies.HobbyFrequency.Daily},
            {text: 'Weekly', value: Hobbies.HobbyFrequency.Weekly},
            {text: 'Monthly', value: Hobbies.HobbyFrequency.Monthly}
        ];
    }

    public addHobby() {
        this.model.Data.Hobbies.push({});
        this.RefreshRows();
    }

    public removeHobby(hobby) {
        this.model.Data.Hobbies.splice(
            this.model.Data.Hobbies.indexOf(hobby), 1);
        this.RefreshRows();

    }

    public OnBeforeSave() {
        super.OnBeforeSave();
        this.data.desc = this.model.Data.Person.FirstName + " " + this.model.Data.Person.LastName;
    }

    private RefreshRows(){
        this.model.MainValidator.Children["Hobbies"].RefreshRows(this.model.Data.Hobbies);
        this.model.HobbiesNumberValidator.Validate(this.model.Data);
    }
}

app.register.controller('hobbiesCtrl', HobbiesCtrl);