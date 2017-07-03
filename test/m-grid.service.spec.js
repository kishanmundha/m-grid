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
            }],
            disablePagination: true
        };

        var mGridConfig = {
            tableClass: 'my-table-class',
            thClass: 'my-th-class'
        };
        var template = mGridService.getGridTemplate(gridOptions, mGridConfig);

        expect(template).toBe('<div style="overflow-x:auto;width: 100%;"><table class="my-table-class"><thead><tr><th ng-repeat="column in gridOptions.columns" class="my-th-class" ng-style="{\'width\':column.style.width||\'auto\',\'min-width\':column.style.minWidth||\'auto\',\'text-align\':column.style.textAlign||\'left\',\'display\':(column.style.visible!==false?\'table-cell\':\'none\')}"><a href="" ng-click="order(column.field, (column.sorting !== undefined ? column.sorting : gridOptions.sorting))" ng-bind="column.name">Name</a><span class="m-grid-sortorder" ng-show="predicate === column.field" ng-class="{\'m-grid-sortorder-reverse\':reverse}"></span></th></tr></thead><tbody><tr ng-repeat="item in getData()"><td><span ng-bind="item[\'id\']"></span></td><td><span ng-bind="item[\'column1\']"></span></td></tr><tr ng-show="getRecordCount() == 0"><td colspan="2"><div style="text-align:center; margin: 20px auto 20px;"><h3>No record found</h3></div></td></tr></tbody></thead></table></div>');
    });

    it('m-grid.service getCellTemplate', function () {
        var column = {
            name: '#',
            field: 'id',
            cellTemplate: '<span>my-custom-template</span>'
        };

        var template = mGridService.getCellTemplate(column);

        expect(template).toBe('<td><div><span>my-custom-template</span></div></td>');

        var templateWithAlias = mGridService.getCellTemplate(column, 'test');

        expect(templateWithAlias).toBe('<td><div ng-init="test=item"><span>my-custom-template</span></div></td>');
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

    it('m-grid.service getCellTemplate with style', function () {
        var template;

        var column = {
            name: 'Price',
            field: 'price',
            format: 'currency',
            style: {
                textAlign: 'right'
            }
        };

        template = mGridService.getCellTemplate(column);

        expect(template).toBe('<td ng-style="{\'text-align\':\'right\',\'display\':\'table-cell\'}"><span ng-bind="item[\'price\'] | currency"></span></td>');

        column.style.textAlign = undefined;
        column.style.visible = false;

        template = mGridService.getCellTemplate(column);

        expect(template).toBe('<td ng-style="{\'text-align\':\'left\',\'display\':\'none\'}"><span ng-bind="item[\'price\'] | currency"></span></td>');
    });

    it('m-grid.service pagination', function () {
        var gridOptions = {
            columns: [{
                name: '#',
                field: 'id'
            }]
        };

        var mGridConfig = {
            tableClass: 'my-table-class',
            thClass: 'my-th-class'
        };

        var template = mGridService.getGridTemplate(gridOptions, mGridConfig);

        expect(template.indexOf('<div ng-hide="getRecordCount() == 0" class="panel-footer') !== -1).toBe(true);
    });
});
