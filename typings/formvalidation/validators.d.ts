/**
 * Created by rsamec on 10.7.2014.
 */
///<reference path='form.d.ts'/>
declare enum CompareOperatorStatic {
    LessThan,
    LessThanEqual,
    Equal,
    NotEqual,
    GreaterThanEqual,
    GreaterThan
}

interface DateCompareValidator extends Validation.IPropertyValidator {
    CompareOperator:CompareOperatorStatic;
    CompareTo:Date;
    IgnoreTime:boolean;
}

interface DateCompareValidatorStatic {
    new():DateCompareValidator;
    CompareOperator:CompareOperatorStatic
}

declare var DateCompareValidator:DateCompareValidatorStatic;

declare module "DateCompareValidator" {
    export = DateCompareValidator;
}



