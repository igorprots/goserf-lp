let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer');


gulp.task('clean', async function () {
  del.sync('dist')
})

gulp.task('scss', function () {
  return gulp.src('docs/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 8 versions']
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('docs/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css', function () {
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/animate.css/animate.compat.css',
  ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('docs/scss'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('html', function () {
  return gulp.src('docs/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('script', function () {
  return gulp.src('docs/js/*.js')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function () {
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('docs/js'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "docs/"
    }
  });
});

gulp.task('export', function () {
  let buildHtml = gulp.src('docs/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('docs/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('docs/js/**/*.js')
    .pipe(gulp.dest('dist/js'));

  let BuildFonts = gulp.src('docs/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('docs/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function () {
  gulp.watch('docs/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('docs/*.html', gulp.parallel('html'))
  gulp.watch('docs/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'))

gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));