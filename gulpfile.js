/**
 * Project Oblique
 * Developer: Prashant Shrestha
 */

var gulp = require('gulp')
    , sass = require('gulp-sass')
    , connect = require('gulp-connect')
    , browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', gulp.parallel(['sass'], function(){
    browserSync.init({
        server: "."
    });

    gulp.watch("sass/main.scss", gulp.parallel("serve"));
    gulp.watch("js/main.js").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
}));

gulp.task("default", 
gulp.series('serve'));