angular-form-app
=================

This application demonstrates usage of business rules engine [business-rules-engine](https://github.com/rsamec/business-rules-engine) in AngularJS.
It uses example of [vacation approval business rules] (https://github.com/rsamec/business-rules/blob/master/dist/vacationApproval/README.md) - see [API documentation] (http://rsamec.github.io/business-rules/docs/classes/vacationapproval.businessrules.html).

Application consists:
+   display vacation request form
+   how to use business rules for vacation approval on this form
+   business rules workflows (work in progress)

[Demo] (http://nodejs-formvalidation.rhcloud.com/)

More complex usages of business rules engine [Tutorial](https://github.com/rsamec/business-rules-engine/wiki).
Find more business rules example in [business rules repository] (https://github.com/rsamec/business-rules) - see [API documentation] (http://rsamec.github.io/business-rules/docs/globals.html).



### Download or clone git repository.

``` bash
git clone https://github.com/rsamec/angular-form-app
npm start
grunt app - compile typescript source to js
```

### Business workflows (work in progress)

Vacation request
+   each employee can create request
+   enable to generate multiple request at once (for example for all employees - obligatory vacation)

Vacation approval
+   enable to approve multiple request at once

Vacation cancel
+   each employee can cancel not approved vacation
+   approved vacation can be cancelled only with approval

