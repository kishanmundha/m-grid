/* eslint-disable no-undef */

'use strict';

describe('m-grid.service', function () {
    var mGridService;
    beforeEach(module('m-grid.service'));

    beforeEach(inject(function (_mGridService_) {
        mGridService = _mGridService_;
    }));

    it('m-grid.service getGridTemplate', function () {
        var gridOptions = {
            columns: [{
                name: '#',
                field: 'id'
            }, {
                name: 'column1',
                field: 'column1'
            }]
        };

        var mGridConfig = {
            tableClass: 'my-table-class',
            thClass: 'my-th-class'
        };
        var template = mGridService.getGridTemplate(gridOptions, mGridConfig);

        expect(template).toBe('<div style="overflow-x:auto;width: 100%;"><table class="my-table-class"><thead><tr><th ng-repeat="column in gridOptions.columns" class="my-th-class"><span ng-bind="column.name">Name</a></th></tr></thead><tbody><tr ng-repeat="item in gridOptions.data"><td><span ng-bind="item[\'id\']"></span></td><td><span ng-bind="item[\'column1\']"></span></td></tr></tbody></thead></table></div>');
    });

    it('m-grid.service getCellTemplate', function () {
        var column = {
            name: '#',
            field: 'id',
            cellTemplate: '<span>my-custom-template</span>'
        };

        var template = mGridService.getCellTemplate(column);

        expect(template).toBe('<td><div ng-init="row={\'entity\':item}"><span>my-custom-template</span></div></td>');
    });

    it('m-grid.service getCellTemplate cell text format', function () {
        var column = {
            name: 'Price',
            field: 'price',
            format: 'currency'
        };

        var template = mGridService.getCellTemplate(column);

        expect(template).toBe('<td><span ng-bind="item[\'price\'] | currency"></span></td>');
    });
});
