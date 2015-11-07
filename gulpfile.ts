var gulp = require('gulp');
var ts = require('gulp-typescript');
var rimraf = require('gulp-rimraf');
var nodemon = require('gulp-nodemon');

gulp.task('clearBackendDir', function(){
    return gulp.src('build_For_Backend').pipe(rimraf());
});

gulp.task('buildBackEnd' ,['clearBackendDir'] , function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({module: 'CommonJS'}));
    return tsResult.js.pipe(gulp.dest('build_For_Backend'));
});

gulp.task('nodemon', ['buildBackEnd','watch'], function(){
    nodemon({
        script: 'build_For_Backend/backend/server.js'

    }).on('restart', function(){
        console.log('nodemon restarted server.js');
    })
});
gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['buildBackEnd']);
});
gulp.task('default', ['buildBackEnd']);
