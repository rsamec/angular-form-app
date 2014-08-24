
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['app/js/*.ts'],
                dest: '',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: false,
                    comments:true
                }
            },
            forms: {
                src: ['app/forms/**/*.ts'],
                dest: '',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: false,
                    comments:true
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {src: ['app/bower_components/business-rules/dist/hobbies/i18n/*.json'], dest: 'app/i18n/hobbies/',flatten:true,filter: 'isFile',expand: true},
                    {src: ['app/bower_components/business-rules/dist/vacationApproval/i18n/*.json'], dest: 'app/i18n/vacationApproval/',flatten:true,filter: 'isFile',expand: true},
                    {src: ['app/bower_components/business-rules/dist/invoice/i18n/*.json'], dest: 'app/i18n/invoice/',flatten:true,filter: 'isFile',expand: true}

                    //{expand: true, src: ['src/customValidators/*.js'], dest: 'dist/customValidators', filter: 'isFile',flatten:true}
                ]
            }
        },
        rename: {
            main: {
                files: [
                    // includes files within path
                    {src: ['app/bower_components/business-rules/dist/hobbies/business-rules.d.ts'], dest: 'typings/business-rules/hobbies.d.ts'},
                    {src: ['app/bower_components/business-rules/dist/vacationApproval/business-rules.d.ts'], dest: 'typings/business-rules/vacationApproval.d.ts'},
                    {src: ['app/bower_components/business-rules/dist/invoice/business-rules.d.ts'], dest: 'typings/business-rules/invoice.d.ts'}
                    //{expand: true, src: ['src/customValidators/*.js'], dest: 'dist/customValidators', filter: 'isFile',flatten:true}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.registerTask('app', ['typescript:base','typescript:forms']);
    grunt.registerTask('i18n', ['copy:main']);
    grunt.registerTask('typings', ['rename:main']);
};
