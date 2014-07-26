///<reference path='../../typings/angularjs/angular.d.ts'/>
///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/formValidation/form.d.ts'/>
///<reference path='../../typings/formValidation/validators.d.ts'/>
//import dateCompare = require("DateCompareValidator");
var Models;
(function (Models) {
    

    /**
    * YUIDoc_comment
    *
    * @class Person
    * @constructor
    **/
    var VacationApproval = (function () {
        function VacationApproval(Data, paramService) {
            this.Data = Data;
            this.paramService = paramService;
            this.CLASS_NAME = 'Person';
            //assign rule to data context
            this.MainValidator = this.createMainValidator().CreateRule("Data");

            this.EmployeeValidator = this.MainValidator.Children["Employee"];
            this.Deputy1Validator = this.MainValidator.Children["Deputy1"];
            this.Deputy2Validator = this.MainValidator.Children["Deputy2"];
            this.DurationValidator = this.MainValidator.Children["Duration"];
            this.DeputyDiffNamesValidator = this.MainValidator.Validators["DiffNames"];

            //enable optional on the upper level
            this.EmployeeValidator.Rules["Email"].Optional = function () {
                return this.Email == undefined || !this.Email.Checked;
            }.bind(this.Data.Employee);

            this.Deputy1Validator.SetOptional(function () {
                return this.Deputy1 == undefined || !this.Deputy1.Checked;
            }.bind(this.Data));

            this.Deputy2Validator.SetOptional(function () {
                return this.Deputy2 == undefined || !this.Deputy2.Checked;
            }.bind(this.Data));

            this.Errors = this.MainValidator.ValidationResult;
        }
        VacationApproval.prototype.Validate = function () {
            this.MainValidator.ValidateAll(this.Data);
        };

        VacationApproval.prototype.createMainValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            var personValidator = this.createPersonValidator();
            validator.ValidatorFor("Employee", personValidator);
            validator.ValidatorFor("Deputy1", personValidator);
            validator.ValidatorFor("Deputy2", personValidator);

            var durationValidator = this.createDurationValidator();
            validator.ValidatorFor("Duration", durationValidator);

            //separate custom shared validator
            var diffNamesFce = function (args) {
                args.HasError = false;
                args.ErrorMessage = "";
                if (!this.Deputy2.Checked)
                    return;
                if (this.Deputy1.FirstName == this.Deputy2.FirstName && this.Deputy1.LastName == this.Deputy2.LastName) {
                    args.HasError = true;
                    args.ErrorMessage = "Deputies can not have the same names.";
                    return;
                }
            };

            var diffNames = { Name: "DiffNames", ValidationFce: diffNamesFce };

            //shared validation
            validator.ValidationFor("DeputyShared", diffNames);

            return validator;
        };

        VacationApproval.prototype.createDurationValidator = function () {
            //create custom composite validator
            var validator = new Validation.AbstractValidator();

            var required = new Validation.RequiredValidator();

            var greaterThanToday = new DateCompareValidator();
            greaterThanToday.CompareOperator = 4;
            greaterThanToday.IgnoreTime = true;

            var lowerThanOneYearToday = new DateCompareValidator();
            lowerThanOneYearToday.CompareOperator = 1;
            lowerThanOneYearToday.IgnoreTime = true;
            lowerThanOneYearToday.CompareTo = moment(new Date()).add({ year: 1 }).toDate();

            validator.RuleFor("From", required);
            validator.RuleFor("To", required);

            validator.RuleFor("From", greaterThanToday);
            validator.RuleFor("To", greaterThanToday);

            //validator.RuleFor("From", lowerThanOneYearToday);
            //validator.RuleFor("To", lowerThanOneYearToday);
            //create named shared validaton
            var isBeforeFce = function (args) {
                args.HasError = false;
                args.ErrorMessage = "";

                //no dates - > nothing to validate
                if (!_.isDate(this.From) || !_.isDate(this.To))
                    return;

                if (moment(this.From).isAfter(this.To)) {
                    args.HasError = true;
                    args.ErrorMessage = Validation.StringFce.format("Date from '{From}' must be before date to '{To'}.", this);
                    args.TranslateArgs = { TranslateId: 'BeforeDate', MessageArgs: this };
                    return;
                }
            };
            var validatorFce = { Name: "VacationDuration", ValidationFce: isBeforeFce };

            //assign shared validation to fields
            validator.ValidationFor("From", validatorFce);
            validator.ValidationFor("To", validatorFce);

            return validator;
        };
        VacationApproval.prototype.createPersonValidator = function () {
            //create custom composite validator
            var personValidator = new Validation.AbstractValidator();

            //create field validators
            var required = new Validation.RequiredValidator();
            var email = new Validation.EmailValidator();
            var maxLength = new Validation.MaxLengthValidator();
            maxLength.MaxLength = 15;

            personValidator.RuleFor("FirstName", required);
            personValidator.RuleFor("FirstName", maxLength);

            personValidator.RuleFor("LastName", required);
            personValidator.RuleFor("LastName", maxLength);

            personValidator.RuleFor("Email", required);
            personValidator.RuleFor("Email", email);

            //TODO: create custom field validator
            return personValidator;
        };
        return VacationApproval;
    })();
    Models.VacationApproval = VacationApproval;
})(Models || (Models = {}));
//# sourceMappingURL=VacationApproval.js.map
