var gulp = require('gulp');
var Server = require('karma').Server;
var path = require('path');
var eslint = require('gulp-eslint');

gulp.task('test:lint', function (done) {
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test:karma', function (done) {
    console.log(path.join(__dirname, '/karma.conf.js'));
    new Server({
        configFile: path.join(__dirname, '/karma.conf.js'),
        singleRun: true
    }, done).start();
});

gulp.task('test', ['test:lint', 'test:karma']);

gulp.task('default', ['test']);
