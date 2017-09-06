angular.module('m-grid.config', [])

.provider('mGridConfig', function () {
    var config = {
        tableClass: 'table table-striped table-bordered m-grid-table',
        thClass: 'm-grid-th',
        footerClass: 'm-grid-footer',
        defaultPageLimit: 10,
        displayLimitOptions: [
            { 'text': 10, 'value': 10 },
            { 'text': 20, 'value': 20 },
            { 'text': 50, 'value': 50 },
            { 'text': 100, 'value': 100 }
        ]
    };

    this.setDefaultPageLimit = function (limit) {
        config.defaultPageLimit = limit || 10;
    };

    this.setDisplayLimitOptions = function (limitOptions) {
        if (!angular.isArray(limitOptions)) {
            throw new Error('param limitOptions should be array');
        }

        if (limitOptions.length === 0) {
            throw new Error('param limitOptions should have at least one record');
        }

        config.displayLimitOptions = [];
        limitOptions.forEach(function (item) {
            if (angular.isObject(item)) {
                config.displayLimitOptions.push({
                    text: item.text,
                    value: item.value
                });
            } else {
                config.displayLimitOptions.push({
                    text: item,
                    value: +item
                });
            }
        });
    };

    this.setCssClass = function (classObj) {
        if (!angular.isObject(classObj)) {
            throw new Error('param classObj should be a object');
        }
        if (classObj.hasOwnProperty('table')) {
            config.tableClass = classObj.table;
        }
        if (classObj.hasOwnProperty('th')) {
            config.thClass = classObj.th;
        }
        if (classObj.hasOwnProperty('footer')) {
            config.footerClass = classObj.footer;
        }
    };

    this.appendCssClass = function (classObj) {
        if (!angular.isObject(classObj)) {
            throw new Error('param classObj should be a object');
        }
        if (classObj.hasOwnProperty('table')) {
            config.tableClass += ' ' + classObj.table;
        }
        if (classObj.hasOwnProperty('th')) {
            config.thClass += ' ' + classObj.th;
        }
        if (classObj.hasOwnProperty('footer')) {
            config.footerClass += ' ' + classObj.footer;
        }
    };

    this.$get = [function () {
        return config;
    }];
});
