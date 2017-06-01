angular.module('m-grid.start-from.filter', [])

.filter('mGridStartFrom', function () {
    // We already have a limitTo filter built-in to angular,
    // let's make a startFrom filter
    return function (input, start) {
        if (!angular.isArray(input)) {
            return input;
        }

        start = +start; // parse to int
        return input.slice(start);
    };
});
