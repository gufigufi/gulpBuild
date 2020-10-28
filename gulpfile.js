const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const gcmq = require('gulp-group-css-media-queries');
const fileinclude = require('gulp-file-include');

// таск для сборки HTML и шаблонов
gulp.task('html', function (callback) {
    return gulp.src('./app/html/*.html')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'HTML include',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(fileinclude({prefix: '@@'}))
        .pipe(gulp.dest('./app/'))
    callback();
})

gulp.task('sass', function (callback) {
    return gulp.src('./app/sass/main.sass')

        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        }))

        .pipe(sourcemaps.init())
        .pipe(sass({
            indentType: 'tab',
            indentWidth: 1,
            outputStyle: 'expanded'
        }))
        .pipe(gcmq())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 version']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css/'))
    callback();
});

gulp.task('watch', function () {
    // слежение за HTML и css и обновление браузера
    watch(['./app/*.html', './app/css/**/*.css'], gulp.parallel(browserSync.reload));

    // слежение за SASS и компиляция в CSS
    watch('./app/sass/**/*.sass', gulp.parallel('sass'))

    // в случае если возникает проблема что gulp перезапускает сервер быстрее чем файл успевает сохраниться
    // watch('./app/sass/**/*.sass', function () {
    //     setTimeout(gulp.parallel('sass'), 1000)
    // })

    // слежение за HTML и сборка страниц
    watch('./app/html/**/*.html', gulp.parallel('html'))
});

// Задача для стратта сервера из папки app
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    });
});

gulp.task('default', gulp.parallel('server','watch', 'sass', 'html'))