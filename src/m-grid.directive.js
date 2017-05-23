'use strict';

angular.module('m-grid.directive', ['m-grid.config'])

.directive('mGrid', ['$log', '$compile', 'config', function ($log, $compile, config) {
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
            var html = '';

            html += '<div style="overflow-x:auto;width: 100%;">';
            html += '<table class="' + config.tableClass + '">';
            html += '<thead>';
            html += '<tr>';
            html += '<th ng-repeat="column in gridOptions.columns" class="' + config.thClass + '">';
            html += '<span ng-bind="column.name">Name</a>';
            html += '</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            html += '<tr ng-repeat="item in gridOptions.data">';

            angular.forEach($scope.gridOptions.columns, function (item) {
                var cellTemplate = '<td>';

                cellTemplate += '<span ng-bind="item[\'' + item.field + '\']"></span>';

                cellTemplate += '</td>';

                html += cellTemplate;
            });

            html += '</tr>';
            html += '</tbody>';
            html += '</thead>';
            html += '</table>';
            html += '</div>';

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
