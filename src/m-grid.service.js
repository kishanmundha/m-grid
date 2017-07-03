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

        if (gridOptions.disablePagination !== true) {
            html += getPaginationTemplate(gridOptions, mGridConfig);
        }

        html += '</div>';

        return html;
    }

    /**
     * Generate template for cell
     * @private
     * @param {*} column
     * @return {String} Cell template
     */
    function getCellTemplate (column, rowItemAlias) {
        var cellStyle = '';

        if (column.style) {
            var style = column.style;
            cellStyle = ' ng-style="{\'text-align\':\'' + (style.textAlign || 'left') + '\',\'display\':' + (style.visible !== false ? '\'table-cell\'' : '\'none\'') + '}"';
        }

        var cellTemplate = '<td' + cellStyle + '>';

        if (column.cellTemplate) {
            if (rowItemAlias) {
                cellTemplate += '<div ng-init="' + rowItemAlias + '=item">' + column.cellTemplate + '</div>';
            } else {
                cellTemplate += '<div>' + column.cellTemplate + '</div>';
            }
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
            bodyTemplate += getCellTemplate(item, gridOptions.rowItemAlias);
        });

        bodyTemplate += '</tr>';

        bodyTemplate += '<tr ng-show="getRecordCount() == 0"><td colspan="' + gridOptions.columns.length + '"><div style="text-align:center; margin: 20px auto 20px;"><h3>No record found</h3></div></td></tr>';

        return bodyTemplate;
    }

    /**
     * Generate pagination template
     * @param {*} gridOptions
     * @param {*} mGridConfig
     * @return {String} pagination template
     */
    function getPaginationTemplate (gridOptions, mGridConfig) {
        var html = '';
        html += '<div ng-hide="getRecordCount() == 0" class="panel-footer ' + mGridConfig.footerClass + '">';
        html += '<m-grid-pagination class="pull-left" style="margin: 0px;" total-items="getRecordCount()" max-size="3" ng-model="currentPage" items-per-page="displayLimit" rotate="false" ng-change="currentPageChange()"></m-grid-pagination>';
        html += '<div class="pull-left" style=" margin-left: 10px;">';
        html += '<select class="form-control input-sm hidden-xs" style="display:inline-block; width: 70px; height: 29px;" type="text" ng-model="displayLimit" ng-options="o.value as o.text for o in displayLimitOptions"></select>';
        html += '<span class="hidden-xs"> items per page</span>';
        html += '<span ng-if="gridData.loading && !gridData.loadingFull && gridData.firstLoaded" style="display:inline-block; vertical-align: middle; margin-left: 10px; height:22px;">';
        html += '<progress-circular size="sm"></progress-circular>';
        html += '</span>';
        html += '</div>';
        html += '<div class="pull-right hidden-xs" ng-bind="getStatusString()" style="margin-top:5px;"></div>';
        html += '<div class="clearfix"></div>';
        html += '</div>';
        return html;
    }

    return {
        getGridTemplate: getGridTemplate,
        getCellTemplate: getCellTemplate,
        getBodyTemplate: getBodyTemplate,
        getPaginationTemplate: getPaginationTemplate
    };
}]);
