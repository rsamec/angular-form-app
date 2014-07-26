///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../validators.ts'/>
//var moment = require("moment");
//var _ = require("underscore");

/**
* @ngdoc object
* @name DateCompareValidator
*
* @requires moment
* @requires underscore
* @description
* DateCompareValidator enables to compare date to another date (CompareTo).</br>
*
* @property {Date} CompareTo
* The datetime against the compare is done.
* If  property is not set, then comparison is done against actual datetime.
*
* @property {boolean} IgnoreDate
* It forces to ignore time part of date by date compare.
*
* @example
* <pre>
*
*  //create validator
*  var validator = new dateCompareValidator();
*  validator.CompareTo = new Date(2000,2,2);
*  validator.FromOperator = Validation.FromOperator.LessThanEqual;
*
*
*  //less more than month -> return true
*  var result = validator.isAcceptable(new Date(2000,1,1));
*  //equal up to days -> return true
*  var result = validator.isAcceptable(new Date(2000,2,2));
*
* </pre>
*/
var DateCompareValidator = (function () {
    function DateCompareValidator() {
        /**
        * It forces to ignore time part of date by date compare.
        * @type {boolean}
        */
        this.IgnoreTime = false;
        this.tagName = 'dateCompare';
    }
    DateCompareValidator.prototype.isAcceptable = function (s) {
        var isValid = false;

        //if date to compare is not specified - defaults to compare against now
        if (!_.isDate(s))
            return false;

        if (this.CompareTo == undefined)
            Date.now();

        var now = moment(this.CompareTo);
        var then = moment(s);

        var diffs = then.diff(now);
        if (this.IgnoreTime)
            diffs = moment.duration(diffs).days();

        if (diffs < 0) {
            isValid = this.CompareOperator == 0 /* LessThan */ || this.CompareOperator == 1 /* LessThanEqual */ || this.CompareOperator == 3 /* NotEqual */;
        } else if (diffs > 0) {
            isValid = this.CompareOperator == 5 /* GreaterThan */ || this.CompareOperator == 4 /* GreaterThanEqual */ || this.CompareOperator == 3 /* NotEqual */;
        } else {
            isValid = this.CompareOperator == 1 /* LessThanEqual */ || this.CompareOperator == 2 /* Equal */ || this.CompareOperator == 4 /* GreaterThanEqual */;
        }
        return isValid;
    };

    DateCompareValidator.prototype.getErrorMessage = function (localMessages) {
        var msg = '';
        var messages = localMessages[this.tagName];

        var format = messages["Format"];
        if (format != undefined) {
            _.extend(this, { FormatedCompareTo: moment(this.CompareTo).format(format) });
        }

        switch (this.CompareOperator) {
            case 0 /* LessThan */:
                msg = messages["LessThan"];
                break;
            case 1 /* LessThanEqual */:
                msg = messages["LessThanEqual"];
                break;
            case 2 /* Equal */:
                msg = messages["Equal"];
                break;
            case 3 /* NotEqual */:
                msg = messages["NotEqual"];
                break;
            case 4 /* GreaterThanEqual */:
                msg = messages["GreaterThanEqual"];
                break;
            case 5 /* GreaterThan */:
                msg = messages["GreaterThan"];
                break;
        }
        return DateCompareValidator.format(msg.replace('CompareTo', 'FormatedCompareTo'), this);
    };

    DateCompareValidator.format = function (s, args) {
        var formatted = s;
        for (var prop in args) {
            var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
            formatted = formatted.replace(regexp, args[prop]);
        }
        return formatted;
    };
    return DateCompareValidator;
})();

//module.exports = DateCompareValidator;
//# sourceMappingURL=DateCompareValidator.js.map
