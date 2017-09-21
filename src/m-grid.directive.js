angular.module('m-grid.directive', ['m-grid.config'])

.directive('mGrid', ['$log', '$compile', '$filter', '$timeout', '$http', '$q', 'mGridConfig', 'mGridService', function ($log, $compile, $filter, $timeout, $http, $q, mGridConfig, mGridService) {
    /**
     * Link function for directive
     * @param {*} scope
     * @param {*} element
     * @param {*} attr
     */
    function linkFn ($scope, element, attr) {
        // Handle undefined gridOptions
        if (!$scope.gridOptions) {
            throw new Error('mGrid must configure gridOptions and there columns');
        }

        // local variables
        var searchTimer;
        var globalSearch = $scope.gridOptions.globalSearch || mGridConfig.globalSearch || 'globalSearch';
        var globalSearchListener;
        var gridSearchWatch;
        var gridUrlParamsWatch;
        var enableWatchEvent = false;
        var forceApplyPromise;
        var oldDisplayLimit = ($scope.gridOptions.config || {}).defaultPageLimit || mGridConfig.defaultPageLimit;
        var oldUrlParams = $scope.gridOptions.urlParams;

        // local scope variables
        $scope.predicate = '';
        $scope.reverse = false;
        $scope.displayLimitOptions = mGridConfig.displayLimitOptions;

        // pagination option
        $scope.startFrom = 0;
        $scope.currentPage = 1;
        $scope.displayLimit = ($scope.gridOptions.config || {}).defaultPageLimit || mGridConfig.defaultPageLimit;

        // options for async loading data
        $scope.gridData = {
            data: [], // data
            total: 0, // total record
            loading: false, // is we are fetching data from xhr request
            loadingFull: false, // only fetching a page. We show a small loding image in side of pagination control if we are not loading full
            firstLoaded: false
        };

        /***********************************************
         * Initilization
         **********************************************/

        if ($scope.gridOptions.enableSearch) {
            // watch for search only if we want to enable search
            // increasing watcher decrease performance
            // we only use watcher if we need
            globalSearchListener = $scope.$on(globalSearch, function (event, value) {
                _search(value);
            });

            gridSearchWatch = $scope.$watch('gridOptions.search', function (newValue, oldValue) {
                _search(newValue);
            });
        }

        if ($scope.gridOptions.urlParams) {
            oldUrlParams = JSON.stringify($scope.gridOptions.urlParams);
            gridUrlParamsWatch = $scope.$watchCollection('gridOptions.urlParams', function (newValue, oldValue) {
                if (enableWatchEvent && oldUrlParams !== JSON.stringify($scope.gridOptions.urlParams)) {
                    oldUrlParams = JSON.stringify($scope.gridOptions.urlParams);
                    if ($scope.gridOptions.async) {
                        _refreshAsyncData();
                    }
                }
            });
        }

        var displayLimitWatch = $scope.$watch('displayLimit', function () {
            $scope.gridData.loadingFull = false;

            if (enableWatchEvent && oldDisplayLimit !== $scope.displayLimit) {
                oldDisplayLimit = $scope.displayLimit;
                if ($scope.gridOptions.async) {
                    _refreshAsyncData();
                }
            }
        });

        $scope.$on('$destroy', function () {
            if ($scope.gridOptions.enableSearch) {
                globalSearchListener();
                gridSearchWatch();
            }

            displayLimitWatch();

            if (gridUrlParamsWatch) {
                gridUrlParamsWatch();
            }
        });

        // compile html
        (function () {
            var html = mGridService.getGridTemplate($scope.gridOptions, mGridConfig);

            element.html(html);

            $compile(element.contents())($scope);
        })();

        /***********************************************
         * Scope functions
         **********************************************/

        // make a external scope
        // it will retrun a object from `$parent` scope.
        // default it take `states` obejct from `$parent` scope
        $scope.getExternalScope = function () {
            return $scope.$parent[$scope.gridOptions.externalScope || 'states'] || {};
        };

        /**
         * Set order predicate
         */
        $scope.order = function (predicate, sorting) {
            if (!sorting) {
                return;
            }

            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;

            $scope.currentPage = 1;
            $scope.currentPageChange();
        };

        // get conditionaly page count
        $scope.getRecordCount = function () {
            if ($scope.gridOptions.async) {
                return $scope.gridData.total || 0;
            }

            var data = $scope.gridOptions.data || [];

            if ($scope.gridOptions.enableSearch === true) {
                data = _getFilteredData(data, $scope.search);
            }

            return data.length;
        };

        // get conditionaly data
        $scope.getData = function () {
            if ($scope.gridOptions.async) {
                return $scope.gridData.data || [];
            }

            var data = $scope.gridOptions.data || [];

            if ($scope.gridOptions.enableSearch === true) {
                data = _getFilteredData(data, $scope.search);
            }

            if ($scope.predicate) {
                data = _getSortedData(data, $scope.predicate, $scope.reverse);
            }

            if ($scope.gridOptions.disablePagination !== true) {
                data = _getSkippedData(data, $scope.startFrom);
                data = _getLimitedData(data, $scope.displayLimit);
            }

            return data;
        };

        // refresh data on page change
        $scope.currentPageChange = function () {
            $scope.startFrom = ($scope.currentPage - 1) * $scope.displayLimit;

            if (enableWatchEvent && $scope.gridOptions.async) {
                $scope.gridData.loadingFull = false;
                $scope.gridData.loading = true;

                var options = _asyncOptions();

                $scope.asyncData(options).then(function (data) {
                    $scope.gridData.data = $scope.gridOptions.data = data;
                    $scope.gridData.loading = false;
                    $scope.gridData.firstLoaded = true;
                    _forceApply();
                }, function (error) {
                    $scope.gridData.loading = false;
                    $scope.gridData.firstLoaded = true;
                    $log.error(error);
                });
            }
        };

        // get status string
        $scope.getStatusString = function () {
            // 1 - 10 of 327 items
            var len = $scope.getRecordCount();

            return ($scope.startFrom + 1) + ' - ' + Math.min(($scope.startFrom + $scope.displayLimit), len) + ' of ' + len + ' items';
        };

        /**
         * Recompile grid when some column level property change
         * @param {Boolean} force flag for recompile force fully grid
         */
        $scope.recompile = function (force) {
            if (force) {
                var html = mGridService.getGridTemplate($scope.gridOptions, mGridConfig);
                element.html(html);
                $compile(element.contents())($scope);
            } else {
                var tbody = element.find('tbody');
                tbody.html(mGridService.getBodyTemplate($scope.gridOptions, mGridConfig));
                $compile(tbody.contents())($scope);
            }
        };

        /***********************************************
         * Helper functions
         **********************************************/

        /**
         * Update search term
         */
        var _search = function (value) {
            $timeout.cancel(searchTimer);

            // search on finish typing
            searchTimer = $timeout(function () {
                if ($scope.search !== value) {
                    $scope.startFrom = 0;
                    $scope.currentPage = 1;
                    $scope.search = value;
                    if ($scope.gridOptions.async) {
                        _refreshAsyncData();
                    }
                }
            }, 1000);
        };

        /**
         * Get sorted data
         * @return {any[]}
         */
        var _getSortedData = function (data, predicate, reverse) {
            return $filter('orderBy')(data, predicate, reverse);
        };

        var _getSkippedData = function (data, skip) {
            return $filter('mGridStartFrom')(data, skip);
        };

        var _getLimitedData = function (data, limit) {
            return $filter('limitTo')(data, limit);
        };

        var _getFilteredData = function (data, search) {
            return $filter('filter')(data, search);
        };

        /**
         * Create async data fetcher function
         * @param {String} url
         */
        var _asyncRequest = function (url) {
            return function (options) {
                var _url = url;
                angular.forEach(options, function (value, key) {
                    if (angular.isUndefined(value)) {
                        value = '';
                    }
                    _url = _url.replace('{' + key + '}', value);
                });

                return $http.get(_url)
                    .then(function (res) {
                        return res.data;
                    }).catch(function (res) {
                        return $q.reject(res.data);
                    });
            };
        };

        var _initAsync = function () {
            if (
                (typeof $scope.gridOptions.asyncData !== 'function' && typeof $scope.gridOptions.asyncData !== 'string') ||
                (typeof $scope.gridOptions.asyncDataCount !== 'function' && typeof $scope.gridOptions.asyncDataCount !== 'string')
             ) {
                throw new Error('asyncData and asyncCount must a function or string');
            }

            if (typeof $scope.gridOptions.asyncData === 'function') {
                $scope.asyncData = $scope.gridOptions.asyncData;
            } else {
                $scope.asyncData = _asyncRequest($scope.gridOptions.asyncData);
            }

            if (typeof $scope.gridOptions.asyncDataCount === 'function') {
                $scope.asyncDataCount = $scope.gridOptions.asyncDataCount;
            } else {
                $scope.asyncDataCount = _asyncRequest($scope.gridOptions.asyncDataCount);
            }
        };

        var _asyncOptions = function () {
            var orderby = '';
            var sortby = '';
            var sortorder = '';
            if ($scope.predicate) {
                orderby = ($scope.reverse ? '-' : '') + $scope.predicate;
                sortby = $scope.predicate;
                sortorder = $scope.reverse ? 'desc' : 'asc';
            }

            var options = {};

            if ($scope.gridOptions.urlParams && angular.isObject($scope.gridOptions.urlParams)) {
                for (var key in $scope.gridOptions.urlParams) {
                    options[key] = $scope.gridOptions.urlParams[key];
                }
            }

            angular.extend(options, {
                term: $scope.search,
                orderby: orderby,
                sortby: sortby,
                sortorder: sortorder,
                skip: $scope.startFrom,
                take: $scope.displayLimit,
                page: $scope.currentPage,
                limit: $scope.displayLimit
            });

            return options;
        };

        var _refreshAsyncData = function () {
            $scope.startFrom = 0;
            $scope.currentPage = 1;

            var options = _asyncOptions();

            $scope.gridData.loading = true;
            $scope.gridData.loadingFull = true;
            $scope.asyncDataCount(options).then(function (count) {
                $scope.gridData.total = count;
                _forceApply();

                $scope.asyncData(options).then(function (data) {
                    $scope.gridData.data = $scope.gridOptions.data = data;
                    $scope.gridData.loading = false;
                    $scope.gridData.firstLoaded = true;
                    $scope.gridData.loadingFull = false;
                    _forceApply();
                }, function (error) {
                    $scope.gridData.loading = false;
                    $scope.gridData.firstLoaded = true;
                    $scope.gridData.loadingFull = false;
                    $log.error(error);
                });
            }, function (error) {
                $scope.gridData.loading = false;
                $scope.gridData.loadingFull = false;
                $log.error(error);
            });
        };

        var _forceApply = function () {
            if (forceApplyPromise !== undefined) {
                return;
            }

            forceApplyPromise = $timeout(function () {
                forceApplyPromise = undefined;
                if (!$scope.$$phase) {
                    $scope.$apply();
                } else {
                    _forceApply();
                }
            }, 500);
        };

        /***********************************************
         * Export methods
         **********************************************/

        $scope.gridOptions.refresh = $scope.recompile;  // refresh grid

        /***********************************************
         * Final execution
         **********************************************/

        // set default order by
        if ($scope.gridOptions.defaultSorting) {
            var _fieldname = $scope.gridOptions.defaultSorting;

            if (_fieldname.indexOf('-') === 0) { // reverse sorting
                _fieldname = _fieldname.substring(1);
                $scope.predicate = _fieldname;
            }

            $scope.order(_fieldname, true);
        }

        // async data
        if ($scope.gridOptions.async) {
            _initAsync();
            _refreshAsyncData();
        }

        enableWatchEvent = true;
    }

    return {
        scope: {
            gridOptions: '='
        },
        replace: true,
        restrict: 'E',
        template: '<div class="m-grid"></div>',
        link: linkFn
    };
}]);
