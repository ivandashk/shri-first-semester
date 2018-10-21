const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin')
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');

const browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

gulp.task('html', () => {
    return gulp.src('./src/index.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.stream())
})

gulp.task('html-video-page', () => {
    return gulp.src('./src/video.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.stream())
})

gulp.task('css', () => {
    return gulp.src('./src/styles.scss')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.stream())
})

gulp.task('js', () => {
    return gulp.src(['./src/blocks/card/*.js', './src/blocks/nav/*.js', './src/blocks/sidebar/*.js', './src/blocks/video-page/*.js'])
        .pipe(plumber())
        .pipe(gulp.dest('./docs/scripts'))
        .pipe(browserSync.stream())
})

gulp.task('images', () => {
    return gulp.src('./src/images/*.+(png|svg)')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('./docs/images'))
})

gulp.task('build', gulp.parallel('html', 'html-video-page', 'css', 'js', 'images'))

gulp.task('serve', () => {
    browserSync.init({
        server: './docs',
        browser: 'chrome',
        cors: true
    });
    watch('./src/**/*.pug', gulp.series('html', 'html-video-page', reload));
    watch('./src/**/*.scss', {readDelay: 100}, gulp.series('css'));
    watch('./src/**/*.js', gulp.series('js', reload));
    watch('./src/images/').on('add', gulp.series('images', reload));
})

gulp.task('default', gulp.series('build', 'serve'));