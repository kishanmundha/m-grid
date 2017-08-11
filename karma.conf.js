'use strict';

var process = require('process');

module.exports = function (config) {
    var sourcePreprocessors = ['coverage'];
    var browsers = ['PhantomJS'];
    var singleRun = true;

    var isDebug = function (argument) {
        return argument === '--debug';
    };

    if (process.argv.some(isDebug)) {
        sourcePreprocessors = [];
        browsers = ['Chrome'];
        singleRun = false;
    }

    config.set({
        singleRun: singleRun,
        basePath: './',
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'test/**/*.js'
        ],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-htmlfile-reporter'
        ],
        frameworks: ['jasmine'],
        browsers: browsers,
        preprocessors: {
            'src/**/*.js': sourcePreprocessors
        },
        reporters: ['progress', 'coverage', 'html'],
        htmlReporter: {
            outputFile: 'coverage/test-result.html',
            pageTitle: 'Unit Tests',
            subPageTitle: 'm-grid testing result',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: true
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage'
        }
    });
};
