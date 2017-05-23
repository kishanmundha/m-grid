'use strict';

var process = require('process');

module.exports = function (config) {
    var sourcePreprocessors = ['coverage'];

    var isDebug = function (argument) {
        return argument === '--debug';
    };

    if (process.argv.some(isDebug)) {
        sourcePreprocessors = [];
    }

    config.set({
        basePath: './',
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'test/**/*.js'
        ],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'src/**/*.js': sourcePreprocessors
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage'
        }
    });
};
