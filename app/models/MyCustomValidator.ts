///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/formValidation/form.d.ts'/>
///<reference path='../../typings/formValidation/validators.d.ts'/>

class MyCustomValidator  {
    public isAcceptable(s:any) {
        //if date to compare is not specified - defaults to compare against now
        if (!_.isDate(s)) return false;

        var then = moment(s);

        if (this.From == undefined)  this.From = new Date();
        var now = moment(this.From);

        if (this.To == undefined)  this.To = new Date();
        var now2 = moment(this.To);
        var isValid = this.isValid(now, then, this.FromOperator) && this.isValid(now2, then, this.ToOperator);

        return isValid;
    }

    private isValid(now:any, then:any, compareOperator:Validation.CompareOperator) {
        var isValid = false;
        if (this.IgnoreTime) {
            then =  then.startOf('day');
            now = now.startOf('day');
        }
        var diffs:number = then.diff(now);
        if (this.IgnoreTime) diffs = moment.duration(diffs).days();

        if (diffs < 0) {
            isValid = compareOperator == Validation.CompareOperator.LessThan
                || compareOperator == Validation.CompareOperator.LessThanEqual
                || compareOperator == Validation.CompareOperator.NotEqual;
        }
        else if (diffs > 0) {
            isValid = compareOperator == Validation.CompareOperator.GreaterThan
                || compareOperator == Validation.CompareOperator.GreaterThanEqual
                || compareOperator == Validation.CompareOperator.NotEqual;
        }
        else {
            isValid = compareOperator == Validation.CompareOperator.LessThanEqual
                || compareOperator == Validation.CompareOperator.Equal
                || compareOperator == Validation.CompareOperator.GreaterThanEqual;
        }
        return isValid;
    }

    public customMessage(config,args):string {
        var msg = config["Msg"]

        var format = config["Format"];
        if (format != undefined) {
            _.extend(args, {
                FormatedFrom: moment(args.From).format(format),
                FormatedTo: moment(args.To).format(format),
                FormatedAttemptedValue: moment(args.AttemptedValue).format(format)
            });
        }

        msg = msg.replace('From', 'FormatedFrom');
        msg = msg.replace('To', 'FormatedTo');
        msg = msg.replace('AttemptedValue', 'FormatedAttemptedValue');
        return Validation.StringFce.format(msg, args);
    }

    tagName = "dateCompareExt";


    public IgnoreTime:boolean;

    /**
     * Set the time of compare between passed date and From date.
     */
    public FromOperator:Validation.CompareOperator;

    /**
     * Set the time of compare between passed date and From date.
     */
    public ToOperator:Validation.CompareOperator;

    /**
     * The datetime against the compare is done.
     * If From is not set, then comparison is done against actual datetime.
     */
    public From:Date;
    /**
     * The datetime against the compare is done.
     * If From is not set, then comparison is done against actual datetime.
     */
    public To:Date;
}
