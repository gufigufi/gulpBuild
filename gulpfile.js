const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const gcmq = require('gulp-group-css-media-queries');
const pug = require('gulp-pug');

//таск для сборки Pug файлов
gulp.task('pug', function () {
    return gulp.src('./app/pug/pages/**/*.pug')

        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Pug',
                    sound: false,
                    message: err.message
                }
            })
        }))

        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./build/'))
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
        .pipe(gulp.dest('./build/css/'))
    callback();
});

gulp.task('watch', function () {
    // слежение за HTML и css и обновление браузера
    watch(['./build/*.html', './build/css/**/*.css'], gulp.parallel(browserSync.reload));

    // слежение за SASS и компиляция в CSS
    watch('./app/sass/**/*.sass', gulp.parallel('sass'))

    // в случае если возникает проблема что gulp перезапускает сервер быстрее чем файл успевает сохраниться
    // watch('./app/sass/**/*.sass', function () {
    //     setTimeout(gulp.parallel('sass'), 1000)
    // })

    // слежение за PUG и сборка
    watch('./app/pug/**/*.pug', gulp.parallel('pug'))
});

// Задача для стратта сервера из папки app
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('default', gulp.parallel('server','watch', 'sass', 'pug'))