
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
        }
    });

    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('app', ['typescript:base','typescript:forms']);
    grunt.registerTask('forms', ['typescript:forms']);
};
