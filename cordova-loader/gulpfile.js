var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var gm = require('gulp-gm');
var genRes = require('gulp-cordova-generate-resources');

gulp.task('generate-icons-ios', function() {
  return genRes.generateIconsIos(__dirname);
});

gulp.task('generate-icons-android', function() {
  return genRes.generateIconsAndroid(__dirname);
});

gulp.task('generate-splash-ios', function() {
  return genRes.generateSplashIos(__dirname);
});

gulp.task('generate-loader-image', function() {
  var icon1024 = path.join(__dirname, 'icon-1024.png');
  var folder = path.join(__dirname, 'www', 'img');

  return gulp.src(icon1024)
    .pipe(resize({ width: 512 }))
    .pipe(rename({ basename: 'logo' }))
    .pipe(gulp.dest(folder));
});

gulp.task('default', ['generate-icons-ios', 'generate-icons-android', 'generate-splash-ios', 'generate-loader-image']);

function resize(options) {
  var w = options.width;
  var h = w;

  return gm(function(gmfile) {
    return gmfile.resize(w, h);
  })
}