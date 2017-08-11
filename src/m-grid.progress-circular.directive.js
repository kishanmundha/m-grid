angular.module('m-grid.progress-circular.direcitve', [])

.directive('progressCircular', ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        scope: {
            size: '@'
        },
        replace: true,
        template: '<span></span>',
        link: function ($scope, element) {
            var cx = 50;
            var cy = 50;
            var r = 20;
            var animateClass = 'm-grid-progress-dash';
            var strokeWidth = 3;

            var width = 100;
            var height = 100;

            if ($scope.size === 'sm') {
                cx = 11;
                cy = 11;
                r = 10;
                animateClass = 'm-grid-progress-dash-sm';

                width = 22;
                height = 22;
                strokeWidth = 2;
            }

            var html = '<svg style="animation: m-grid-progress-rotate 2s linear infinite; height: ' + height + 'px; width: ' + width + 'px; position: relative">' +
                    '<circle style="animation:' + animateClass + ' 1.5s ease-in-out infinite, m-grid-progress-color 6s ease-in-out infinite" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-dasharray="1,200" stroke-dashoffset="0" stroke-linecap="round" fill="none" stroke-width="' + strokeWidth + '" stroke-miterlimit="10"/>' +
                    '</svg>';
            element.html(html);
            var c = $compile(html)($scope);
            element.replaceWith(c);
        }
    };
}]);
