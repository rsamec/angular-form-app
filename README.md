FormValidationApp
=================

Demo for form validation engine

### Download or clone git repository.

``` bash
git clone https://github.com/rsamec/FormValidationApp
```

### Install dependencies

``` bash
cd myProject
npm install
npm start
```


### Business rules for vacation

Vacation request - basic business rules

+   name -> first name + last name is required
+   duration
    +   from and to is required
    +   from and to must be valid dates (expect weekends)
    +   from and to must be greater or queal today
    +   from and to must be less or queal 1 year
    +   from must be at least one day before to
+   deputy
    +   first name + last name of deputy is required
    +   contact (email) is required
    +   can not select deputy have approved vacation at the same days (async)
+   at least one deputy is required -> second deputy is optional

### Business workflows

Vacation request
+   each employee can create request
+   enable to generate multiple request at once (for example for all employees - obligatory vacation)

Vacation approval
+   enable to approve multiple request at once

Vacation cancel
+   each employee can cancel not approved vacation
+   approved vacation can be cancelled only with approval

