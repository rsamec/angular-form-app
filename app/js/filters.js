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

filterModule.filter('person', ['$filter', function ($filter) {
    return function (person) {
        if (!!!person) return undefined;
        var result=  person.FirstName + " " + person.LastName;
        return result;
    };
}]);
filterModule.filter('duration', ['$filter', function ($filter) {
    return function (duration, format) {
        if (!!!duration) return undefined;
        var result =$filter("date")(duration.From, format)  + " - " + $filter("date")(duration.To, format);
        if (duration.Days != undefined) result+= " (" + duration.Days + ")";
        return result;
    };
}]);
filterModule.filter('vacationFilter', ['$filter', function ($filter) {
    return function (input, searchText) {
        if (searchText == undefined) return input;
        searchText = searchText.toLowerCase();
        return _.filter(input, function (item) {
            return  item.data.Employee.FirstName.toLowerCase().indexOf(searchText) != -1 || item.data.Employee.LastName.toLowerCase().indexOf(searchText) != -1;
        });
    }
}]);
