///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>


/* Controllers */
interface IDocScope {
    validate(): Q.Promise<any>;
    reset(): void;
    showMessage(msg): void;
    showError(reason): void;
    save():void;

    data:any;
    model:any;

    name:string;
    version:string;
    created:Date;
    updated:Date;
}

interface IBusinessRules{
    Errors:any;//Validation.ValidationResult;
    Validate():Q.Promise<Validation.IValidationResult>;
}

class DocCtrl implements IDocScope {


    public name:string;
    public version:string;
    public get created() {return this.data.created;}
    public get updated() {return this.data.updated;}

    constructor(public model:IBusinessRules, public data:any) {

    }
    public validate():Q.Promise<Validation.IValidationResult> {
        this.model.Errors.SetDirty();
        return this.model.Validate();
    }

    public reset = function () {
        this.model.Errors.SetPristine();
    }

    public save() {
        this.validate().then(this.saveEx.bind(this), this.showError);
    }

    private saveEx(result){
        if (this.model.Errors.HasErrors) {
            return;
        }
        this.OnBeforeSave();
        this.data.$saveOrUpdate(this.createdSuccess, this.updatedSuccess, this.showError, this.showError);
    }

    private createdSuccess(response) {
        if (!this.data.$id()) {
            this.data._id = response._id;
        }
    }

    private updatedSuccess(response) {
    }

    public showError(reason) {
        alert(reason);
    }
    public showMessage(msg) {
        alert(msg);
    }

    public OnBeforeSave() {
        var today = new Date();
        if (this.data.created === undefined) this.data.created = today;
        this.data.updated = today;
    }
}