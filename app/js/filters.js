'use strict';

/* Filters */

var filterModule = angular.module('myApp.filters', []);

    filterModule.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

filterModule.filter('successSave', ['$filter', function ($filter) {
    return function (input, format) {
        if (!!!input) return undefined;
        return "Document was succesfully saved " + $filter("date")(input, format) + ".";
    };
}]);

