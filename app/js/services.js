'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.value('version', '0.1');
var Q;
services.service('param',function($q, $timeout){
    Q = $q;
    return {

        isAcceptable:function (data) {
            var deferral = $q.defer();
            $timeout(function() {
                deferral.resolve(true);
            }, 1000);
            return deferral.promise;
        }
    }
} )



services.factory('person',function(param){
    var data = {
        Person1: {
            Checked: true,
                FirstName: "Roman",
                LastName: "Samec"
        },
        Person2:{
            Checked: true,
                FirstName: "Roman",
                LastName: "Samec"
        }
    }
    return new Models.Person(data,param);
});

services.factory('vacationApproval',function(param){

    return new Models.VacationApproval({},param);
});

services.factory('Doc', function ($mongolabResourceHttp) {
    return $mongolabResourceHttp('docs');
});
services.factory('Form', function ($mongolabResourceHttp) {
    return $mongolabResourceHttp('forms');
});




