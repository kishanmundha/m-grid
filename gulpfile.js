var gulp = require('gulp');
var Server = require('karma').Server;
var path = require('path');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var indent = require('gulp-indent');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concatCSS = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');

gulp.task('test:lint', function (done) {
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**', '!dist/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test:karma', function (done) {
    console.log(path.join(__dirname, '/karma.conf.js'));
    new Server({
        configFile: path.join(__dirname, '/karma.conf.js')
    }, done).start();
});

function getConcatedStream () {
    return gulp.src([
        './src/m-grid.module.js',
        './src/m-grid.config.js',
        './src/m-grid.directive.js',
        './src/m-grid.pagination.js',
        './src/m-grid.service.js',
        './src/m-grid.start-from.filter.js',
        './src/m-grid.progress-circular.directive.js'
    ])
    .pipe(concat('m-grid.js'))
    .pipe(indent({amount: 4}))
    .pipe(wrap('(function () {\n<%= data.contents %>})();\n\n', {}, { variable: 'data' }));
}

function getConcatedCSSStream () {
    return gulp.src([
        './src/m-grid.css'
    ])
    .pipe(concatCSS('m-grid.css'));
}

gulp.task('concat', function (done) {
    return getConcatedStream()
    .pipe(wrap('\'use strict\';\n\n<%= data.contents %>', {}, { variable: 'data' }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function (done) {
    return getConcatedStream()
    .pipe(uglify())
    .pipe(rename('m-grid.min.js'))
    .pipe(wrap('\'use strict\';\n<%= data.contents %>', {}, { variable: 'data' }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('concatCSS', function (done) {
    return getConcatedCSSStream()
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minifyCSS', function (done) {
    return getConcatedCSSStream()
    .pipe(cleanCSS())
    .pipe(rename('m-grid.min.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['test:lint', 'test:karma']);

gulp.task('build', ['concat', 'minify', 'concatCSS', 'minifyCSS']);

gulp.task('default', ['test']);
