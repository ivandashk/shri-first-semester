const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin')
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
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
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.stream())
})

gulp.task('js', () => {
    return gulp.src(['./src/blocks/card/*.js', './src/blocks/nav/*.js', './src/blocks/sidebar/*.js'])
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(concat('scripts.min.js'))
        .pipe(babel({ presets: ['env'] }))
        .pipe(uglify())
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.stream())
})

gulp.task('js-video', () => {
    return gulp.src(['./src/blocks/video-page/*.js', './src/blocks/sidebar/*.js'])
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(concat('video.min.js'))
        .pipe(babel({ presets: ['env'] }))
        .pipe(uglify())
        .pipe(sourceMaps.write('./'))
        .pipe(gulp.dest('./docs/'))
        .pipe(browserSync.stream())
})

gulp.task('images', () => {
    return gulp.src('./src/images/*.+(png|svg)')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest('./docs/images'))
})

gulp.task('build', gulp.parallel('html', 'html-video-page', 'css', 'js', 'js-video', 'images'))

gulp.task('serve', () => {
    browserSync.init({
        server: './docs',
        browser: 'chrome',
        cors: true
    });
    watch('./src/**/*.pug', gulp.series('html', 'html-video-page', reload));
    watch('./src/**/*.scss', {readDelay: 100}, gulp.series('css'));
    watch('./src/**/*.js', gulp.series('js', 'js-video', reload));
    watch('./src/images/').on('add', gulp.series('images', reload));
})

gulp.task('default', gulp.series('build', 'serve'));