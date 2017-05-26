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
        html += '<th ng-repeat="column in gridOptions.columns" class="' + mGridConfig.thClass + '" ng-style="{\'width\':column.style.width||\'auto\',\'min-width\':column.style.minWidth||\'auto\',\'text-align\':column.style.textAlign||\'left\',\'display\':(column.style.visible!==false?\'table-cell\':\'none\')}">';
        html += '<a href="" ng-click="order(column.field, (column.sorting !== undefined ? column.sorting : gridOptions.sorting))" ng-bind="column.name">Name</a>';
        html += '<span class="m-grid-sortorder" ng-show="predicate === column.field" ng-class="{\'m-grid-sortorder-reverse\':reverse}"></span>';
        html += '</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += getBodyTemplate(gridOptions);
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
        var cellStyle = '';

        if (column.style) {
            var style = column.style;
            cellStyle = ' ng-style="{\'text-align\':\'' + (style.textAlign || 'left') + '\',\'display\':' + (style.visible !== false ? '\'table-cell\'' : '\'none\'') + '}"';
        }

        var cellTemplate = '<td' + cellStyle + '>';

        if (column.cellTemplate) {
            cellTemplate += '<div ng-init="row={\'entity\':item}">' + column.cellTemplate + '</div>';
        } else {
            cellTemplate += '<span ng-bind="item[\'' + column.field + '\']' + (column.format ? ' | ' + column.format : '') + '"></span>';
        }

        cellTemplate += '</td>';

        return cellTemplate;
    }

    /**
     * Generate <tbody> template
     * @param {*} gridOptions
     * @return {String} <tbody> template
     */
    function getBodyTemplate (gridOptions, mGridConfig) {
        var bodyTemplate = '';

        bodyTemplate += '<tr ng-repeat="item in getData()">';

        angular.forEach(gridOptions.columns, function (item) {
            bodyTemplate += getCellTemplate(item);
        });

        bodyTemplate += '</tr>';

        return bodyTemplate;
    }

    return {
        getGridTemplate: getGridTemplate,
        getCellTemplate: getCellTemplate,
        getBodyTemplate: getBodyTemplate
    };
}]);
