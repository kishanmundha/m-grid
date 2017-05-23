/* eslint-disable no-undef */

'use strict';

describe('Basic unit test describe', function () {
    it('Basic unit test equal test', function () {
        expect(2).toBe(2);
    });
});

describe('m-grid.directive', function () {
    var $compile, $rootScope;

    beforeEach(module('m-grid'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('m-grid without grid options', function () {
        var $scope = $rootScope.$new();
        var errorMsg;

        try {
            $compile('<m-grid></m-grid>')($scope);
        } catch (e) {
            errorMsg = e.message;
        }

        expect(errorMsg).toEqual('mGrid must configure gridOptions and there columns');
    });

    it('m-grid basic rendering', function () {
        var $scope = $rootScope.$new();
        $scope.gridOptions = {
            columns: [{
                name: '#',
                field: 'id'
            }, {
                name: 'column1',
                field: 'column1'
            }]
        };
        var element = $compile('<m-grid grid-options="gridOptions"></m-grid>')($scope);
        $scope.$digest();
        expect(element.html()).toContain('<div style="overflow-x:auto;width: 100%;" class="ng-scope"><table class="table table-striped table-bordered"><thead><tr><!-- ngRepeat: column in gridOptions.columns --><th ng-repeat="column in gridOptions.columns" class="m-grid-th ng-scope"><span ng-bind="column.name" class="ng-binding">#</span></th><!-- end ngRepeat: column in gridOptions.columns --><th ng-repeat="column in gridOptions.columns" class="m-grid-th ng-scope"><span ng-bind="column.name" class="ng-binding">column1</span></th><!-- end ngRepeat: column in gridOptions.columns --></tr></thead><tbody><!-- ngRepeat: item in gridOptions.data --></tbody></table></div>');
    });
});
