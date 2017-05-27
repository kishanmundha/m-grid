'use strict';

angular.module('m-grid.config', [])

.constant('mGridConfig', {
    tableClass: 'table table-striped table-bordered m-grid-table',
    thClass: 'm-grid-th',
    footerClass: 'm-grid-footer',
    displayLimitOptions: [
        { 'text': 10, 'value': 10 },
        { 'text': 20, 'value': 20 },
        { 'text': 50, 'value': 50 },
        { 'text': 100, 'value': 100 }
    ]
});
