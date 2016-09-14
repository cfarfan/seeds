var gulp = require('gulp')
var watch = require('gulp-watch')
var connect = require('gulp-connect')
var run = require('gulp-sequence')
var sass = require('gulp-sass')
var autoprefixer  = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var rename = require('gulp-rename')

var handleError = function (err) {
  console.clear()
  console.log(err)
  this.emit('end')
}

var fn = {
  sass: function () {
    return gulp.src('./scss/style.scss')
      .pipe(plumber({handleError: handleError}))
      .pipe(sass.sync())
      .pipe(autoprefixer({
          browsers: [
            "Android 2.3",
            "Android >= 4",
            "Chrome >= 20",
            "Firefox >= 24",
            "Explorer >= 8",
            "iOS >= 6",
            "Opera >= 12",
            "Safari >= 6"
          ],
          cascade: false
      }))
      .pipe(rename('style.css'))
      .pipe(gulp.dest('.'))
      .pipe(connect.reload())
  },
  html: function () {
    return gulp.src('./*.html')
      .pipe(connect.reload())
  },
  js: function () {
    return gulp.src('./*.js')
      .pipe(connect.reload())
  },
  localserver: function () {
    connect.server({
      livereload: true,
      root: '.',
      port: 9001
    })
  },
  watch: function () {
    watch('./**/*.scss', function () { gulp.start(['sass']) })
    watch('./**/*.html', function () { gulp.start(['html']) })
    watch('./**/*.js', function () { gulp.start(['js']) })
  }
}

gulp.task('sass',fn.sass)
gulp.task('js',fn.js)
gulp.task('html',fn.html)
gulp.task('localserver',fn.localserver)
gulp.task('watch',fn.watch)

gulp.task('default', run('sass','watch','localserver'))
