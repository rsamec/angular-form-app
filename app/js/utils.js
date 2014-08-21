///<reference path='../../typings/underscore/underscore.d.ts'/>
var AppUtils = (function () {
    function AppUtils() {
    }
    Object.defineProperty(AppUtils, "R_ISO8061_STR", {
        get: function () {
            return /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;
        },
        enumerable: true,
        configurable: true
    });

    /**
    * It replaces all EcmaScript date occurences with ISO formatted date string.
    *
    * @param obj
    * @returns {*} return obje, where
    */
    AppUtils.transformDatesToISOString = function (obj) {
        if (_.isDate(obj)) {
            return AppUtils.toLocalISOString(obj);
        } else if (_.isArray(obj) || _.isObject(obj)) {
            _.forEach(obj, function (val, name) {
                obj[name] = AppUtils.transformDatesToISOString(val);
            });
        }
        return obj;
    };

    /**
    *  It replaces all ISO formatted date string occurences with EcmaScript dates.
    *
    * @param obj source object
    * @returns {*}
    */
    AppUtils.transformISOStringToDates = function (obj) {
        if (_.isString(obj) && 15 <= obj.length && obj.length <= 24) {
            return AppUtils.toLocalISODate(obj);
        } else if (_.isArray(obj) || _.isObject(obj)) {
            _.forEach(obj, function (val, name) {
                obj[name] = AppUtils.transformISOStringToDates(val);
            });
        }
        return obj;
    };

    /**
    *  It converts date types to ISO date string.
    *
    * @param date
    * @returns {string}
    */
    AppUtils.toLocalISOString = function (date) {
        var pad = function (number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        };
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
    };

    /**
    * It converts ISO date string to date type.
    *
    * @param string
    * @returns {*}
    */
    AppUtils.toLocalISODate = function (string) {
        var int = function (value) {
            return parseInt(value, 10);
        };
        var match;
        if (match = string.match(AppUtils.R_ISO8061_STR)) {
            var date = new Date(0), tzHour = 0, tzMin = 0;

            //if (match[9]) {
            //    tzHour = int(match[9] + match[10]);
            //    tzMin = int(match[9] + match[11]);
            //}
            date.setFullYear(int(match[1]), int(match[2]) - 1, int(match[3]));
            date.setHours(int(match[4] || 0) - tzHour, int(match[5] || 0) - tzMin, int(match[6] || 0), int(match[7] || 0));
            return date;
        }
        return string;
    };
    return AppUtils;
})();
