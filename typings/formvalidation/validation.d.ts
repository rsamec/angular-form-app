///<reference path='../q/q.d.ts'/>


///////////////////////////////////////////////////////////////////////////////
// ng module (angular.js)
///////////////////////////////////////////////////////////////////////////////
declare module Validation {

    interface AbstractValidatorStatic{
        new<T>():IAbstractValidator<T>;
    }

    interface ValidatorStatic{
        new(string,IValidate):IValidator;
    }

    interface MaxLengthValidator extends IPropertyValidator{
        MaxLength:number;
    }
    interface MaxLengthValidatorStatic{
        new():MaxLengthValidator;
    }
    
    interface RequiredValidatorStatic{
        new():IPropertyValidator;
    }


    interface IValidationStatic {
        AbstractValidator:AbstractValidatorStatic;
        RequiredValidator:RequiredValidatorStatic;
        MaxLengthValidator:MaxLengthValidatorStatic;
        CompositeErrorInfo(string):void;
        ContainsValidator():void;
        EmailValidator():void;
        Validator:ValidatorStatic;

        CompositeValidationResult(string):void;
        StringFce:any;
    }

    /**
     * It represents a property validator for atomic object.
     */
    export interface IPropertyValidator{
        isAcceptable(s: any): boolean;
        getErrorMessage?(localization:any):string;
        tagName?:string;
    }

    /**
     * It represents a property validator for simple string value.
     */
    export interface IStringValidator extends IPropertyValidator{
        isAcceptable(s: string): boolean;
    }

    /**
     * It represents an async property validator for atomic object.
     */
    export interface IAsyncPropertyValidator{
        isAcceptable(s: any): Q.Promise<boolean>;
        getErrorMessage?(localization:any):string;
        isAsync:boolean;
        tagName?:string;
    }

    /**
     * It represents an async property validator for simple string value.
     */
    export interface IAsyncStringPropertyValidator extends  IAsyncPropertyValidator{
        isAcceptable(s: string): Q.Promise<boolean>;
    }

    /**
     * basic error structure
     */
    export interface IError {
        HasError: boolean;
        ErrorMessage: string;
    }

    /**
     * It defines conditional function.
     */
    export interface IOptional { (): boolean; }

    /**
     * It represents the validation result.
     */
    export interface IValidationFailure {
        Validator:IPropertyValidator
        Error:IError;
    }
    /**
     * It represents the validation result for validator.
     */
    export interface IAsyncValidationFailure {
        Validator:IAsyncPropertyValidator
        Error:IError;
    }

    /**
     * This class provides unit of information about error.
     * Implements composite design pattern to enable nesting of error information.
     */
    export interface IValidationResult {

        /**
         * The name of error collection.
         */
        Name: string;

        /**
         * Add error information to child collection of errors.
         * @param validationResult - error information to be added.
         */
        Add(validationResult:IValidationResult): void;

        /**
         * Remove error information from child collection of errors.
         * @param index - index of error information to be removed.
         */
        Remove(index:number): void;

        /**
         * Return collections of child errors information.
         */
        Children: Array<IValidationResult>;

        /**
         * Return true if there is any error.
         */
        HasErrors: boolean;
        /**
         * Return error message, if there is no error, return empty string.
         */
        ErrorMessage: string;
        /**
         * Return number of errors.
         */
        ErrorCount: number;

        /**
         * It enables to have errors optional.
         */
        Optional?: IOptional;
    }

    /**
     * It defines validation function.
     */
    export interface IValidate { (args: IError): void; }

    /**
     * It represents named validation function.
     */
    export interface IValidatorFce {
        Name:string;
        ValidationFce: IValidate;
    }

    /**
     * This class represents custom validator.
     */
    export interface IValidator extends IError {
        Validate(context:any): boolean;
        Error: IError;
    }


    /**
     * It represents abstract validator for type of <T>.
     */
    export interface IAbstractValidator<T>{
        RuleFor(prop:string,validator:IPropertyValidator);
        ValidationFor(prop:string,validator:IValidatorFce);
        ValidatorFor<K>(prop:string,validator:IAbstractValidator<K>);

        //Validators:{ [name: string]: Array<IPropertyValidator> ; };

        /**
         * It creates new concrete validation rule and assigned data context to this rule.
         * @param name of the rule
         * @param data context
         * @constructor
         */
        CreateRule(name:string):IAbstractValidationRule<any>;
        CreateAbstractRule(name:string):IAbstractValidationRule<any>;
        //CreateAbstractListRule(name:string):AbstractListValidationRule<any>;

        /**
         * return true if this validation rule is intended for list of items, otherwise true
         */
        ForList:boolean;
    }


    /**
     * It represents concrete validation rule for type of <T>.
     */
    export interface IAbstractValidationRule<T> {

        /**
         * Performs validation and async validation using a validation context.
         */
        ValidateAll(context:T):void;

        /**
         * Performs validation and async validation using a validation context for a passed field.
         */
        ValidateField(context:T,propName:string):void;

        /**
         * Return validation results.
         */
        ValidationResult: IValidationResult

    }
    /**
     * It represents property validation rule for type of <T>.
     */
    export interface IPropertyValidationRule<T> {
        /**
         *The validators that are grouped under this rule.
         */
        Validators:Array<IPropertyValidator>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext<T>):Array<IValidationFailure>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext<T>):Q.Promise<Array<IValidationFailure>>;

    }


    /**
     *  It represents a data context for validation rule.
     */
    export interface IValidationContext<T> {
        /**
         * Return current value.
         */
        Value:string;

        /**
         * Return property name for current data context.
         */
        Key:string;

        /**
         * Data context for validation rule.
         */
        Data:T
    }

}
declare var Validation: Validation.IValidationStatic;