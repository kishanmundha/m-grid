/* eslint-disable no-undef */

'use strict';

describe('m-grid.start-from.filter', function () {
    var $filter;
    beforeEach(module('m-grid.start-from.filter'));

    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('m-grid.start-from.filter mGridStartFrom', function () {
        var arr = {};
        expect($filter('mGridStartFrom')(arr, 1)).toBe(arr);

        arr = undefined;
        expect($filter('mGridStartFrom')(arr, 1)).toBeUndefined();

        arr = [1, 2, 3];
        expect($filter('mGridStartFrom')(arr, 1)).toEqual([2, 3]);
    });
});
