angular.module('m-grid.pagination', ['m-grid.config'])

/**
 * Helper internal service for generating common controller code between the
 * pager and pagination components
 */
.factory('mGridPaging', ['$parse', function ($parse) {
    return {
        create: function (ctrl, $scope, $attrs) {
            ctrl.setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
            ctrl.ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl
            ctrl._watchers = [];

            ctrl.init = function (ngModelCtrl, config) {
                ctrl.ngModelCtrl = ngModelCtrl;
                ctrl.config = config;

                ngModelCtrl.$render = function () {
                    ctrl.render();
                };

                if ($attrs.itemsPerPage) {
                    ctrl._watchers.push($scope.$parent.$watch($attrs.itemsPerPage, function (value) {
                        ctrl.itemsPerPage = parseInt(value, 10);
                        $scope.totalPages = ctrl.calculateTotalPages();
                        ctrl.updatePage();
                    }));
                } else {
                    ctrl.itemsPerPage = config.itemsPerPage;
                }

                $scope.$watch('totalItems', function (newTotal, oldTotal) {
                    if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
                        $scope.totalPages = ctrl.calculateTotalPages();
                        ctrl.updatePage();
                    }
                });
            };

            ctrl.calculateTotalPages = function () {
                var totalPages = ctrl.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / ctrl.itemsPerPage);
                return Math.max(totalPages || 0, 1);
            };

            ctrl.render = function () {
                $scope.page = parseInt(ctrl.ngModelCtrl.$viewValue, 10) || 1;
            };

            $scope.selectPage = function (page, evt) {
                if (evt) {
                    evt.preventDefault();
                }

                var clickAllowed = !$scope.ngDisabled || !evt;
                if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
                    if (evt && evt.target) {
                        evt.target.blur();
                    }
                    ctrl.ngModelCtrl.$setViewValue(page);
                    ctrl.ngModelCtrl.$render();
                }
            };

            $scope.noPrevious = function () {
                return $scope.page === 1;
            };

            $scope.noNext = function () {
                return $scope.page === $scope.totalPages;
            };

            ctrl.updatePage = function () {
                ctrl.setNumPages($scope.$parent, $scope.totalPages); // Readonly variable

                if ($scope.page > $scope.totalPages) {
                    $scope.selectPage($scope.totalPages);
                } else {
                    ctrl.ngModelCtrl.$render();
                }
            };

            $scope.$on('$destroy', function () {
                while (ctrl._watchers.length) {
                    ctrl._watchers.shift()();
                }
            });
        }
    };
}])

.directive('mGridTabindexToggle', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            attrs.$observe('disabled', function (disabled) {
                attrs.$set('tabindex', disabled ? -1 : null);
            });
        }
    };
})

.constant('mGridPaginationConfig', {
    itemsPerPage: 10,
    maxSize: 5
})

.controller('mGridPaginationController', ['$scope', '$attrs', '$parse', 'mGridPaging', 'mGridPaginationConfig', function ($scope, $attrs, $parse, mGridPaging, mGridPaginationConfig) {
    var ctrl = this;
    // Setup configuration parameters
    var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : mGridPaginationConfig.maxSize;
    var pageLabel = angular.identity;
    $attrs.$set('role', 'menu');

    mGridPaging.create(this, $scope, $attrs);

    if ($attrs.maxSize) {
        ctrl._watchers.push($scope.$parent.$watch($parse($attrs.maxSize), function (value) {
            maxSize = parseInt(value, 10);
            ctrl.render();
        }));
    }

    // Create page object used in template
    function makePage (number, text, isActive) {
        return {
            number: number,
            text: text,
            active: isActive
        };
    }

    function getPages (currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1;
        var endPage = totalPages;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
            // Visible pages are paginated with maxSize
            startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
            var page = makePage(number, pageLabel(number), number === currentPage);
            pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && maxSize > 0) {
            if (startPage > 1) {
                var previousPageSet = makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
            }

            if (endPage < totalPages) {
                var nextPageSet = makePage(endPage + 1, '...', false);
                pages.push(nextPageSet);
            }
        }
        return pages;
    }

    var originalRender = this.render;
    this.render = function () {
        originalRender();
        if ($scope.page > 0 && $scope.page <= $scope.totalPages) {
            $scope.pages = getPages($scope.page, $scope.totalPages);
        }
    };
}])

.directive('mGridPagination', ['$log', '$parse', 'mGridPaginationConfig', function ($log, $parse, mGridPaginationConfig) {
    return {
        scope: {
            totalItems: '=',
            ngDisabled: '='
        },
        require: ['mGridPagination', '?ngModel'],
        restrict: 'E',
        replace: true,
        controller: 'mGridPaginationController',
        controllerAs: 'pagination',
        template: '<ul class="pagination pagination-sm" style="margin: 0px;">' +
        '<li role="menuitem" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href ng-click="selectPage(1, $event)" ng-disabled="noPrevious()||ngDisabled" m-grid-tabindex-toggle>First</a></li>' +
        '<li role="menuitem" ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href ng-click="selectPage(page.number, $event)" ng-disabled="ngDisabled&&!page.active" m-grid-tabindex-toggle>{{page.text}}</a></li>' +
        '<li role="menuiem" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href ng-click="selectPage(totalPages, $event)" ng-disabled="noNext()||ngDisabled" m-grid-tabindex-toggle>Last</a></li>' +
        '</ul>',
        link: function (scope, element, attrs, ctrls) {
            element.addClass('pagination');
            var paginationCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];

            if (!ngModelCtrl) {
                return; // do nothing if no ng-model
            }

            paginationCtrl.init(ngModelCtrl, mGridPaginationConfig);
        }
    };
}]);
