/* eslint-disable no-undef */

'use strict';

describe('m-grid.progress-circular.directive', function () {
    var $compile, $rootScope;

    beforeEach(module('m-grid.progress-circular.direcitve'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('m-grid progress normal size', function () {
        var $scope = $rootScope.$new();
        var element = $compile('<progress-circular></progress-circular>')($scope);
        $scope.$digest();
        expect(element.html()).toContain('<svg style="animation: m-grid-progress-rotate 2s linear infinite; height: 100px; width: 100px; position: relative"><circle style="animation:m-grid-progress-dash 1.5s ease-in-out infinite, m-grid-progress-color 6s ease-in-out infinite" cx="50" cy="50" r="20" stroke-dasharray="1,200" stroke-dashoffset="0" stroke-linecap="round" fill="none" stroke-width="3" stroke-miterlimit="10"></circle></svg>');
    });

    it('m-grid progress small size', function () {
        var $scope = $rootScope.$new();
        var element = $compile('<progress-circular size="sm"></progress-circular>')($scope);
        $scope.$digest();
        expect(element.html()).toContain('<svg style="animation: m-grid-progress-rotate 2s linear infinite; height: 22px; width: 22px; position: relative"><circle style="animation:m-grid-progress-dash-sm 1.5s ease-in-out infinite, m-grid-progress-color 6s ease-in-out infinite" cx="11" cy="11" r="10" stroke-dasharray="1,200" stroke-dashoffset="0" stroke-linecap="round" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>');
    });
});
