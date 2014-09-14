///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/business-rules-engine/business-rules-engine.d.ts'/>


/* Controllers */
interface IDocScope {

    /*
    Return document data object.
     */
    data:any;
    /*
    Return document model (business rules).
     */
    model:IBusinessRules;

    /*
     Return form name.
     */
    name:string;
    /*
     Return form version.
     */
    version:string;
    /*
     Return document creation date.
     */
    created:Date;
    /*
     Return document last update date.
     */
    updated:Date;

    /*
    Executes all validation rules on form.
     */
    validate(): Q.Promise<Validation.IValidationResult>;

    /*
    It saves the document data to persistent repository.
     */
    save():void;

    /*
    It resets all values to default state.
     */
    reset(): void;
    /*
    It displays user-friendly information message.
     */
    showMessage(msg): void;
    /*
    It displays user-friendly error message.
     */
    showError(reason): void;

}


interface IBusinessRules{
    ValidationResult:any;//Validation.ValidationResult;
    Validate():Q.Promise<Validation.IValidationResult>;
    Name:string;
}
var Localization:any;
class DocCtrl implements IDocScope{

    get rootTemplateUrl():string {return "forms/" + this.name + "/root.tpl.html";}

    get name():string {return this.model.Name;}
    version:string;
    get created() {return this.data.created;}
    get updated() {return this.data.updated;}



    constructor(private $scope:ng.IScope,
                public model:IBusinessRules,
                public data:any,
                private $translate,
                private $translatePartialLoader,
                private alertService) {

        //load translation strings
        $translatePartialLoader.addPart(model.Name);
        $translate.refresh();

        // root binding for alertService
        $scope["closeAlert"] = this.alertService.closeAlert;

        // change language
        $scope["changeLanguage"] = function (langKey) {
            $translate.use(langKey);
            $translate.refresh();

            $.getScript("bower_components/business-rules-engine/dist/module/i18n/messages_" + langKey + ".js", function(){
                _.extend(Validation.MessageLocalization.defaultMessages, Localization.ValidationMessages);
                $scope["va"].model.Validate();
            })
        };
    }

    public get isForm():boolean {return true;}

    public validate():Q.Promise<Validation.IValidationResult> {
        this.model.ValidationResult.SetDirty();
        return this.model.Validate();
    }

    public reset = function () {
        this.model.Errors.SetPristine();
    }

    public save() {
        this.validate().then(this.saveEx.bind(this), this.showError);
    }

    private saveEx(result){
        if (this.model.ValidationResult.HasErrors) {
            return;
        }
        this.OnBeforeSave();
        this.data.$saveOrUpdate(this.createdSuccess.bind(this), this.updatedSuccess.bind(this), this.saveFailed.bind(this), this.saveFailed.bind(this));
    }

    private createdSuccess(response) {
        if (!this.data.$id()) {
            this.data._id = response._id;
        }
        this.alertService.add("success", "Document was succesfully saved.",2000);
    }

    private updatedSuccess(response) {
        this.alertService.add("success", "Document was succesfully saved.",2000);
    }

    public saveFailed(reason) {
        this.alertService.add("danger", "Error encounters: " + reason,0);
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
        this.data.name = this.model.Name;

    }
}