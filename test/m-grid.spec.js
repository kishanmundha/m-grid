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
                return '<div>m-grid</div>';
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
        expect(element.html()).toContain('<div class="ng-scope">m-grid</div>');
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
});
