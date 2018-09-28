"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        mochaTest: {
            all: {
                options: {
                    reporter: 'spec',
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            all: {
                files: ['lib/**/*.js','test/**/*.js'],
                tasks: ['mochaTest:all']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('watch', ['watch:all']);
    grunt.registerTask('test', ['mochaTest']);

};
