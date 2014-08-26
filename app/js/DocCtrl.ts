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
    ValidationResult:any;//Validation.ValidationResult;
    Validate():Q.Promise<Validation.IValidationResult>;
    Name:string;
}
var Localization:any;
class DocCtrl implements IDocScope {

    public get rootTemplateUrl():string {return "forms/" + this.name + "/root.tpl.html";}
    public get name():string {return this.model.Name;}
    public version:string;
    public get created() {return this.data.created;}
    public get updated() {return this.data.updated;}

    constructor($scope:any,public model:IBusinessRules, public data:any,  $translate, $translatePartialLoader) {


        $translatePartialLoader.addPart(model.Name);
        $translate.refresh();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $translate.refresh();
            $.getScript("bower_components/business-rules-engine/dist/module/i18n/messages_" + langKey + ".js", function(){
                _.extend(Validation.MessageLocalization.defaultMessages, Localization.ValidationMessages);
                $scope.va.model.Validate();
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
        this.data.$saveOrUpdate(this.createdSuccess.bind(this), this.updatedSuccess.bind(this), this.showError, this.showError);
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
        this.data.name = this.model.Name;

    }
}