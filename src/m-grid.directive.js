'use strict';

angular.module('m-grid.directive', ['m-grid.config'])

.directive('mGrid', ['$log', '$compile', 'mGridConfig', 'mGridService', function ($log, $compile, mGridConfig, mGridService) {
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

        // compile html
        (function () {
            var html = mGridService.getGridTemplate($scope.gridOptions, mGridConfig);

            element.append(html);

            $compile(element.contents())($scope);
        })();
    }

    return {
        scope: {
            gridOptions: '='
        },
        replace: true,
        restrict: 'E',
        template: '<div></div>',
        link: linkFn
    };
}]);
