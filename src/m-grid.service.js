'use strict';

angular.module('m-grid.service', [])

.service('mGridService', ['$log', function ($log) {
    /**
     * Generate template for grid
     * @public
     * @param {*} gridOptions
     * @param {*} mGridConfig
     * @return {String} Grid template
     */
    function getGridTemplate (gridOptions, mGridConfig) {
        var html = '';

        html += '<div style="overflow-x:auto;width: 100%;">';
        html += '<table class="' + mGridConfig.tableClass + '">';
        html += '<thead>';
        html += '<tr>';
        html += '<th ng-repeat="column in gridOptions.columns" class="' + mGridConfig.thClass + '">';
        html += '<span ng-bind="column.name">Name</a>';
        html += '</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '<tr ng-repeat="item in gridOptions.data">';

        angular.forEach(gridOptions.columns, function (item) {
            html += getCellTemplate(item);
        });

        html += '</tr>';
        html += '</tbody>';
        html += '</thead>';
        html += '</table>';
        html += '</div>';

        return html;
    }

    /**
     * Generate template for cell
     * @private
     * @param {*} column
     * @return {String} Cell template
     */
    function getCellTemplate (column) {
        var cellTemplate = '<td>';

        if (column.cellTemplate) {
            cellTemplate += '<div ng-init="row={\'entity\':item}">' + column.cellTemplate + '</div>';
        } else {
            cellTemplate += '<span ng-bind="item[\'' + column.field + '\']' + (column.format ? ' | ' + column.format : '') + '"></span>';
        }

        cellTemplate += '</td>';

        return cellTemplate;
    }

    return {
        getGridTemplate: getGridTemplate,
        getCellTemplate: getCellTemplate
    };
}]);
