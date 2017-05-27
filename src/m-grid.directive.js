'use strict';

angular.module('m-grid.directive', ['m-grid.config'])

.directive('mGrid', ['$log', '$compile', '$filter', 'mGridConfig', 'mGridService', function ($log, $compile, $filter, mGridConfig, mGridService) {
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

        // local scope variables
        $scope.predicate = '';
        $scope.reverse = false;
        $scope.displayLimitOptions = mGridConfig.displayLimitOptions;

        // pagination option
        $scope.startFrom = 0;
        $scope.currentPage = 1;
        $scope.displayLimit = 10;

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
            var count = 0;
            count = _getSortedData().length;
            return count;
        };

        // get conditionaly data
        $scope.getData = function () {
            var data = _getSortedData();
            if ($scope.gridOptions.disablePagination !== true) {
                data = _getSkippedData(data, $scope.startFrom);
                data = _getLimitedData(data, $scope.displayLimit);
            }
            return data;
        };

        $scope.currentPageChange = function () {
            $scope.startFrom = ($scope.currentPage - 1) * $scope.displayLimit;
        };

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
         * Get sorted data
         * @return {any[]}
         */
        var _getSortedData = function () {
            var data = $scope.gridOptions.data || [];

            if ($scope.predicate) {
                data = $filter('orderBy')(data, $scope.predicate, $scope.reverse);
            }

            return data;
        };

        var _getSkippedData = function (data, skip) {
            return $filter('mGridStartFrom')(data, skip);
        };

        var _getLimitedData = function (data, limit) {
            return $filter('limitTo')(data, limit);
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
