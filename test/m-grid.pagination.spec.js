/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable one-var */
/* eslint-disable space-before-function-paren */

'use strict';

describe('pagination directive', function () {
    var $compile, $rootScope, $document, $templateCache, body, element;
    beforeEach(module('m-grid.pagination'));
    beforeEach(inject(function (_$compile_, _$rootScope_, _$document_, _$templateCache_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $rootScope.total = 47; // 5 pages
        $rootScope.currentPage = 3;
        $rootScope.disabled = false;
        $document = _$document_;
        $templateCache = _$templateCache_;
        body = $document.find('body');
        element = $compile('<m-grid-pagination total-items="total" ng-model="currentPage"></m-grid-pagination>')($rootScope);
        $rootScope.$digest();
    }));

    function getPaginationBarSize () {
        return element.find('li').length;
    }

    function getPaginationEl (index) {
        return element.find('li').eq(index);
    }

    // Returns a comma-separated string that represents the pager, like: "Prev, 1, 2, 3, Next"
    function getPaginationAsText () {
        var len = getPaginationBarSize(), outItems = [];
        for (var i = 0; i < len; i++) {
            outItems.push(getPaginationEl(i).text());
        }
        return outItems.join(', ');
    }

    function clickPaginationEl (index) {
        getPaginationEl(index).find('a').click();
    }

    function getPaginationLinkEl (elem, index) {
        return elem.find('li').eq(index).find('a');
    }

    function updateCurrentPage (value) {
        $rootScope.currentPage = value;
        $rootScope.$digest();
    }

    function setDisabled (value) {
        $rootScope.disabled = value;
        $rootScope.$digest();
    }

    it('has a "pagination" css class', function () {
        expect(element.hasClass('pagination')).toBe(true);
    });
});
