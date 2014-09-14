///<reference path='../../../typings/angularjs/angular.d.ts'/>
///<reference path='../../../typings/business-rules/hobbies.d.ts'/>

///<reference path='../../js/DocCtrl.ts'/>
class HobbiesCtrl extends DocCtrl {

    public model:Hobbies.BusinessRules;

    constructor($scope:ng.IScope, docInstance:any, $translate, $translatePartialLoader, alertService) {
        super($scope, new Hobbies.BusinessRules(docInstance.data), docInstance, $translate, $translatePartialLoader,alertService);

        //fill list of hobbies with one empty item to indicate there are some hobbies to fill in
        if (this.model.Data.Hobbies === undefined) this.model.Data.Hobbies = [{}];
        this.notifyCollectionChanged(true);
    }

    /*
    Return hobbies frequency options.
     */
    get hobbyFrequencyOptions() {
        return [
            {text: 'Daily', value: Hobbies.HobbyFrequency.Daily},
            {text: 'Weekly', value: Hobbies.HobbyFrequency.Weekly},
            {text: 'Monthly', value: Hobbies.HobbyFrequency.Monthly}
        ];
    }


    /*
    Add new hobby to list of hobbies.
     */
    addHobby() {
        this.model.Data.Hobbies.push({});
        this.notifyCollectionChanged();
    }

    /*
    Remove selected hobby from list of hobbies.
     */
    removeHobby(hobby) {
        this.model.Data.Hobbies.splice(
            this.model.Data.Hobbies.indexOf(hobby), 1);
        this.notifyCollectionChanged();

    }

    /*
    Hook function for actions before saving is done.
    */
    OnBeforeSave() {
        super.OnBeforeSave();
        this.data.desc = this.model.Data.Person.FirstName + " " + this.model.Data.Person.LastName;
    }

    /*
    Notify that collection was changed. Conditionally call validation for collection.
     */
    private notifyCollectionChanged(ignoreValidation?:boolean){
        this.model.MainValidator.Children["Hobbies"].RefreshRows(this.model.Data.Hobbies);
        if (!ignoreValidation)this.model.HobbiesNumberValidator.Validate(this.model.Data);
    }
}

var app:any;
app.register.controller('hobbiesCtrl', HobbiesCtrl);