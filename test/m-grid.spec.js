/* eslint-disable no-undef */

'use strict';

describe('m-grid.directive', function () {
    var $compile, $rootScope, $timeout;

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

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
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

        var gridScope = element.isolateScope();
        gridScope.$destroy();
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

        expect(gridScope.getRecordCount()).toEqual(0);
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

    it('m-grid search', function () {
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
            defaultSorting: 'id',
            disablePagination: true,
            enableSearch: true
        };

        element = $compile('<m-grid grid-options="gridOptions"></m-grid>')($scope);
        $scope.$digest();

        gridScope = element.isolateScope();

        $scope.gridOptions.data = [{id: 2}, {id: 1}, {id: 5}];

        expect(gridScope.getRecordCount()).toBe(3);

        $scope.gridOptions.search = '5';
        $scope.$digest();
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
        expect(gridScope.search).toBe('5');
        expect(gridScope.getRecordCount()).toBe(1);
        expect(gridScope.getData()).toEqual([{id: 5}]);

        $scope.gridOptions.search = '6';
        $scope.$digest();
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
        expect(gridScope.search).toBe('6');

        $rootScope.$broadcast('globalSearch', '5');
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
        expect(gridScope.search).toBe('5');

        $rootScope.$broadcast('globalSearch', '5');
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
        expect(gridScope.search).toBe('5');

        expect(gridScope.getStatusString()).toBe('1 - 1 of 1 items');

        gridScope.$destroy();
    });

    describe('m-grid async', function () {
        var $q;

        beforeEach(inject(function (_$q_) {
            $q = _$q_;
        }));

        it('m-grid async data', function () {
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
                sorting: true,
                defaultSorting: 'id',
                enableSearch: true,
                async: true,
                urlParams: {
                    even: false
                }
            };

            var htmlTemplate = '<m-grid grid-options="gridOptions"></m-grid>';
            var errorMsg;

            try {
                $compile(htmlTemplate)($scope);
            } catch (e) {
                errorMsg = e.message;
            }

            expect(errorMsg).toBe('asyncData and asyncCount must a function or string');

            var totalRecord = 15;
            var firstPageRecord = [{page: 1}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
            var secondPageRecord = [{page: 2}, {}, {}, {}, {}];
            var limit5PageRecord = [{limit: 5}, {}, {}, {}, {}];
            var evenPageRecord = [{even: true}];

            $scope.gridOptions.asyncData = function (options) {
                var defer = $q.defer();
                if (options.even) {
                    defer.resolve(evenPageRecord);
                } else if (options.limit > 20) {
                    defer.reject('error');
                } else if (options.limit === 5) {
                    defer.resolve(limit5PageRecord);
                } else if (options.page === 1) {
                    defer.resolve(firstPageRecord);
                } else if (options.page === 2) {
                    defer.resolve(secondPageRecord);
                } else {
                    defer.reject('error');
                }
                return defer.promise;
            };
            $scope.gridOptions.asyncDataCount = function (options) {
                var defer = $q.defer();
                if (options.even) {
                    defer.resolve(1);
                } else if (options.limit > 30) {
                    defer.reject('error');
                } else if (options.page < 5) {
                    defer.resolve(totalRecord);
                } else {
                    defer.reject('error');
                }
                return defer.promise;
            };

            element = $compile(htmlTemplate)($scope);

            $scope.$digest();

            gridScope = element.isolateScope();

            expect(gridScope.gridData.total).toBe(15);
            expect(gridScope.gridData.data).toEqual(JSON.parse(JSON.stringify(firstPageRecord)));

            gridScope.currentPage = 2;
            gridScope.currentPageChange();
            $scope.$digest();

            expect(gridScope.gridData.data).toEqual(JSON.parse(JSON.stringify(secondPageRecord)));

            gridScope.currentPage = 1;
            gridScope.displayLimit = 5;
            $scope.$digest();

            expect(gridScope.gridData.data).toEqual(JSON.parse(JSON.stringify(limit5PageRecord)));

            // api error block test
            gridScope.displayLimit = 10;
            gridScope.currentPage = 3;
            gridScope.currentPageChange();
            $scope.$digest();

            gridScope.currentPage = 6;
            gridScope.currentPageChange();
            $scope.$digest();

            gridScope.displayLimit = 30;
            $scope.$digest();

            gridScope.displayLimit = 40;
            $scope.$digest();

            $scope.gridOptions.urlParams.even = true;
            $scope.$digest();

            expect(gridScope.gridData.data).toEqual(JSON.parse(JSON.stringify(evenPageRecord)));

            // gridScope.gridOptions.search = '6';
            // $scope.$digest();
            // $timeout.flush();
            // $timeout.verifyNoPendingTasks();
            // $scope.$digest();

            // expect(gridScope.currentPage).toBe(1);

            $scope.$digest();

            gridScope.gridData.total = undefined;
            gridScope.gridData.data = undefined;

            expect(gridScope.getRecordCount()).toBe(0);
            expect(gridScope.getData()).toEqual([]);

            $scope.gridOptions.urlParams = {
                flag: true
            };
            gridScope.predicate = 'id';
            gridScope.reverse = true;
            $scope.$digest();
            gridScope.currentPageChange();
            $scope.$digest();

            gridScope.$destroy();
        });
    });
});
