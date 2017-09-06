/* eslint-disable no-undef */

'use strict';

describe('m-grid.config', function () {
    var mGridConfig;

    beforeEach(module('m-grid.config'));

    describe('m-grid.config default configuration', function () {
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config default should not change if not configuring', function () {
            var defaultConfig = {
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
            expect(mGridConfig).toBeDefined();
            expect(mGridConfig).toEqual(defaultConfig);
        });
    });

    describe('m-grid.config custom configuration - setDefaultPageLimit', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.setDefaultPageLimit(5);
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setDefaultPageLimit', function () {
            expect(mGridConfig.defaultPageLimit).toBe(5);
        });
    });

    describe('m-grid.config custom configuration - setDefaultPageLimit - 0 to be 10', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.setDefaultPageLimit(0);
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setDefaultPageLimit - 0 to be 10', function () {
            expect(mGridConfig.defaultPageLimit).toBe(10);
        });
    });

    describe('m-grid.config custom configuration - setDisplayLimitOptions - should array', function () {
        var error;
        beforeEach(module(function (mGridConfigProvider) {
            try {
                mGridConfigProvider.setDisplayLimitOptions();
            } catch (e) {
                error = e.message;
            }
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setDisplayLimitOptions - should array', function () {
            expect(error).toBeDefined();
        });
    });

    describe('m-grid.config custom configuration - setDisplayLimitOptions - should not 0 length', function () {
        var error;
        beforeEach(module(function (mGridConfigProvider) {
            try {
                mGridConfigProvider.setDisplayLimitOptions([]);
            } catch (e) {
                error = e.message;
            }
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setDisplayLimitOptions - should not 0 length', function () {
            expect(error).toBeDefined();
        });
    });

    describe('m-grid.config custom configuration - setDisplayLimitOptions', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.setDisplayLimitOptions([1, 5, {text: 10, value: 10}]);
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setDisplayLimitOptions', function () {
            expect(mGridConfig.displayLimitOptions).toEqual([{
                text: 1,
                value: 1
            }, {
                text: 5,
                value: 5
            }, {
                text: 10,
                value: 10
            }]);
        });
    });

    describe('m-grid.config custom configuration - setCssClass - invalid', function () {
        var error;
        beforeEach(module(function (mGridConfigProvider) {
            try {
                mGridConfigProvider.setCssClass();
            } catch (e) {
                error = e.message;
            }
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setCssClass - invalid', function () {
            expect(error).toBeDefined();
        });
    });

    describe('m-grid.config custom configuration - setCssClass - table', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.setCssClass({
                table: 'mytable'
            });
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setCssClass - table', function () {
            expect(mGridConfig.tableClass).toBe('mytable');
            expect(mGridConfig.thClass).toBe('m-grid-th');
            expect(mGridConfig.footerClass).toBe('m-grid-footer');
        });
    });

    describe('m-grid.config custom configuration - setCssClass - th and footer', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.setCssClass({
                th: 'myth',
                footer: 'myfooter'
            });
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config setCssClass - th and footer', function () {
            expect(mGridConfig.tableClass).toBe('table table-striped table-bordered m-grid-table');
            expect(mGridConfig.thClass).toBe('myth');
            expect(mGridConfig.footerClass).toBe('myfooter');
        });
    });

    describe('m-grid.config custom configuration - appendCssClass - invalid', function () {
        var error;
        beforeEach(module(function (mGridConfigProvider) {
            try {
                mGridConfigProvider.appendCssClass();
            } catch (e) {
                error = e.message;
            }
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config append css invalid', function () {
            expect(error).toBeDefined();
        });
    });

    describe('m-grid.config custom configuration - appendCssClass - table', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.appendCssClass({
                table: 'mytable'
            });
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config appendCssClass - table', function () {
            expect(mGridConfig.tableClass).toBe('table table-striped table-bordered m-grid-table mytable');
            expect(mGridConfig.thClass).toBe('m-grid-th');
            expect(mGridConfig.footerClass).toBe('m-grid-footer');
        });
    });

    describe('m-grid.config custom configuration - appendCssClass - th and footer', function () {
        beforeEach(module(function (mGridConfigProvider) {
            mGridConfigProvider.appendCssClass({
                th: 'myth',
                footer: 'myfooter'
            });
        }));
        beforeEach(inject(function (_mGridConfig_) {
            mGridConfig = _mGridConfig_;
        }));

        it('m-grid.config appendCssClass - th and footer', function () {
            expect(mGridConfig.tableClass).toBe('table table-striped table-bordered m-grid-table');
            expect(mGridConfig.thClass).toBe('m-grid-th myth');
            expect(mGridConfig.footerClass).toBe('m-grid-footer myfooter');
        });
    });
});
