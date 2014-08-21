'use strict';

/* Directives */


var uiControls = angular.module('myApp.directives', []);
 uiControls.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

uiControls.directive('rule', function ($timeout,$parse) {
    return {
        require:'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            if (ctrl== undefined) return;
            var lastIndexOf = attrs.ngModel.lastIndexOf('.');
            var parentModel = attrs.ngModel.substr(0,lastIndexOf);
            var propertyName = attrs.ngModel.substr(lastIndexOf + 1);

            var rule = scope.$eval(attrs.rule)
            var getter = $parse(parentModel);

            ctrl.$viewChangeListeners.push(function(){
                rule.ValidateProperty(getter(scope),propertyName);
                rule.ValidationResult.Errors[propertyName].IsDirty = true;
            });
        }
    };
});

uiControls.directive('field', function ($timeout,$parse) {
    return {
        require:'ngModel',
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl:'partials/field.tpl.html',
        link: function (scope, element, attrs, ctrl) {
           if (ctrl== undefined) return;

            // we can now use our ngModelController builtin methods
            // that do the heavy-lifting for us

            var inputs = element.find('input');
            var inputEl = inputs.eq(0);

            // when model change, update our view (just update the input value)
            ctrl.$render = function() {
                inputEl.val(ctrl.$viewValue);
            };

            // update the model then the view
            var updateModel = function () {
                // call $parsers pipeline then update $modelValue
                ctrl.$setViewValue(inputEl.val());
                // update the local view
                ctrl.$render();
            }

            bindToOnChanged(scope, inputs, attrs, updateModel);

            var lastIndexOf = attrs.ngModel.lastIndexOf('.');
            var parentModel = attrs.ngModel.substr(0,lastIndexOf);
            var propertyName = attrs.ngModel.substr(lastIndexOf + 1);

            var rule = scope.$eval(attrs.rule)
            var getter = $parse(parentModel);

            ctrl.$viewChangeListeners.push(function(){
                rule.ValidateProperty(getter(scope),propertyName);
                rule.ValidationResult.Errors[propertyName].IsDirty = true;
            });

            scope.getErrorMessage = function() {
                return rule.ValidationResult.Errors[propertyName].ErrorMessage;
            }
        }
    };
});

uiControls.directive('validate', function () {
    return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs, ctrl) {
            if (!ctrl) return;
            var rule = scope.$eval(attrs.validate);
            if (rule != undefined)
                bindToOnChanged(scope, element, attrs, callValidate);

            function callValidate()
            {
                var rule = scope.$eval(attrs.validate);

                if (rule != undefined)
                {
                    rule.ValidateProperty();
                    rule.ValidateAsyncEx(ctrl.$modelValue);
                }
            }
        }
    };
});
uiControls.directive('error', function ($translate) {
    return {
        restrict: 'A',
        scope:{
            error:'='
        },
        template:'<div class="validation-error">{{errMsg}}</div>',
        link: function (scope, element, attrs) {
            var setErrMsg = function() {
                if (!scope.error.HasError) {
                    scope.errMsg = undefined;
                    return
                }

                if (scope.error.TranslateArgs == undefined) {
                    scope.errMsg = scope.error.ErrorMessage;
                    return;

                }
                $translate(scope.error.TranslateArgs.TranslateId).then(function (errMsg) {
                    if (scope.error.TranslateArgs.CustomMessage != undefined){
                        scope.errMsg = scope.error.TranslateArgs.CustomMessage(errMsg, scope.error.TranslateArgs.MessageArgs);
                    }else {
                        scope.errMsg = Validation.StringFce.format(errMsg, scope.error.TranslateArgs.MessageArgs);
                    }},
                    function (reason) {
                        //fallback to default error message
                        scope.errMsg = scope.error.ErrorMessage;
                    }
                )
            }

            setErrMsg();
            scope.$watch('error.ErrorMessage', function (newValue, oldValue, scope)
            {
                setErrMsg();
            }, true);


       }
    };
});

uiControls.directive('valResult', function ($translate) {
    return {
        restrict: 'A',
        scope:{
            valResult:'='
        },
        //template:'<div class="validation-error"></div>',
        link: function (scope, element, attrs) {
            element.addClass("validation-error");

            var translateMsg = function(arg,defaultErrorMsg) {
                $translate(arg.TranslateId).then(function (errMsg) {
                        if (arg.CustomMessage != undefined) {
                            element.append(arg.CustomMessage(errMsg, arg.MessageArgs));
                        } else {
                            element.append(Validation.StringFce.format(errMsg, arg.MessageArgs))
                        }
                    },
                    function (reason) {
                        //fallback to default error message
                        element.append(defaultErrorMsg);
                    }
                );
            };
            var translateMsgs = function(){
                _.each(scope.valResult.ValidationFailures,function(error,key){
                   if (!error.HasError) return;
                   var arg = error.TranslateArgs;
                   if (arg == undefined) {
                       element.append(error.ErrorMessage);
                       return;
                   }
                   translateMsg(arg,error.ErrorMessage);
                })
            };

            translateMsgs();
            var errorChanged =  function(){
                return scope.valResult.ErrorMessage;
            }
            scope.$watch(errorChanged,function(){
                element.html('');
                translateMsgs();
            },true)
        }
    };
});

uiControls.directive('dateMask', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$parsers.push(function (input) {
                if (input == null || input == undefined || input == "") return null;
                if (_.isDate(input)) return input;
                if (input.length < 8) return null;
                var formats = ["DDMMYYYY", "DD.MM.YYYYY", "DD-MM-YYYY", "DD/MM/YYYY"];
                for (var i = 0; i != formats.length; i++) {
                    var date = moment(input, formats[i]);
                    if (date.isValid()) return date.toDate();
                }
                return null;
            });
            function format(input) {
                if (input == null || input == undefined) return "";
                return moment(input).format("DD.MM.YYYY");
            }
            ctrl.$formatters.push(format);

            // Input elements
            element.bind('blur', function (e) {
                ctrl.$viewValue = format(ctrl.$modelValue);
                ctrl.$render();
            });
        }
    };
});



function bindToOnChanged(scope, element, attrs, bindTo) {
    //bind to event according type of element
    var tagName = element[0].tagName.toLowerCase();
    if (tagName === 'select')
    {
        element.bind("change", function ()
        {
            scope.$apply(bindTo);
        });
    }
    else if (tagName === 'input')
    {
        if (attrs.type === 'radio' || attrs.type === 'checkbox')
        {
            element.bind("click", function ()
            {
                scope.$apply(bindTo);
            })
        }
        else
        {
            element.bind("blur", function ()
            {
                scope.$apply(bindTo);
            })
        }
    }
    else if (tagName === 'textarea')
    {
        element.bind("blur", function ()
        {
            scope.$apply(bindTo);
        })
    }
    else
    {
    }
}


