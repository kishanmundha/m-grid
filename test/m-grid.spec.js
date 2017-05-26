/* eslint-disable no-undef */

'use strict';

describe('Basic unit test describe', function () {
    it('Basic unit test equal test', function () {
        expect(2).toBe(2);
    });
});

describe('m-grid.directive', function () {
    var $compile, $rootScope;

    beforeEach(module('m-grid', function ($provide) {
        $provide.value('mGridService', {
            getGridTemplate: function (gridOptions, mGridConfig) {
                return '<div><table><tbody><tr></tr></tbody></table></div>';
            },
            getBodyTemplate: function (gridOptions, mGridConfig) {
                return '<tr><td>new template</td></tr>';
            }
        });
    }));

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
        expect(element.html()).toContain('<div class="ng-scope"><table><tbody><tr></tr></tbody></table></div>');

        $scope.gridOptions.refresh();
        expect(element.html()).toContain('<div class="ng-scope"><table><tbody><tr class="ng-scope"><td>new template</td></tr></tbody></table></div>');

        $scope.gridOptions.refresh(true);
        expect(element.html()).toContain('<div class="ng-scope"><table><tbody><tr></tr></tbody></table></div>');
    });

    it('m-grid external scope event', function () {
        var $scope = $rootScope.$new();
        $scope.gridOptions = {
            columns: []
        };
        var element = $compile('<m-grid grid-options="gridOptions"></m-grid>')($scope);
        $scope.$digest();

        var gridScope = element.isolateScope();
        expect(gridScope.getExternalScope()).toBeDefined();
        expect(gridScope.getExternalScope().click).toBeUndefined();

        $scope.states = {
            click: function () {},
            value: 2
        };

        expect(gridScope.getExternalScope().click).toBeDefined();
        expect(typeof gridScope.getExternalScope().click).toBe('function');

        expect(gridScope.getExternalScope().value).toBe(2);
    });

    it('m-grid external scope event with custom scope object', function () {
        var $scope = $rootScope.$new();
        $scope.gridOptions = {
            columns: [],
            externalScope: 'myScope'
        };
        var element = $compile('<m-grid grid-options="gridOptions"></m-grid>')($scope);
        $scope.$digest();

        var gridScope = element.isolateScope();
        expect(gridScope.getExternalScope()).toBeDefined();
        expect(gridScope.getExternalScope().click).toBeUndefined();

        $scope.myScope = {
            click: function () {},
            value: 2
        };

        expect(gridScope.getExternalScope().click).toBeDefined();
        expect(typeof gridScope.getExternalScope().click).toBe('function');

        expect(gridScope.getExternalScope().value).toBe(2);
    });

    it('m-grid sorting', function () {
        var gridScope, element;

        var $scope = $rootScope.$new();
        $scope.gridOptions = {
            columns: [{
                name: '#',
                field: 'id'
            }, {
                name: 'No sort',
                field: 'nosort',
                sorting: false
            }],
            externalScope: 'myScope',
            sorting: true,
            defaultSorting: 'id'
        };

        element = $compile('<m-grid grid-options="gridOptions"></m-grid>')($scope);
        $scope.$digest();

        gridScope = element.isolateScope();

        expect(gridScope.predicate).toBe('id');
        expect(gridScope.reverse).toBe(false);

        $scope.gridOptions.defaultSorting = '-id';

        element = $compile('<m-grid grid-options="gridOptions"></m-grid>')($scope);
        $scope.$digest();

        gridScope = element.isolateScope();
        expect(gridScope.predicate).toBe('id');
        expect(gridScope.reverse).toBe(true);

        gridScope.order('nosort', false);
        expect(gridScope.predicate).not.toBe('nosort');

        expect(gridScope.getData()).toEqual([]);

        $scope.gridOptions.data = [{id: 2}, {id: 1}, {id: 5}];

        gridScope.predicate = '';
        gridScope.reverse = false;
        expect(gridScope.getData()).toEqual([{id: 2}, {id: 1}, {id: 5}]);

        gridScope.order('id', true);
        expect(gridScope.getData()).toEqual([{id: 1}, {id: 2}, {id: 5}]);

        gridScope.order('id', true);
        expect(gridScope.getData()).toEqual([{id: 5}, {id: 2}, {id: 1}]);
    });
});
