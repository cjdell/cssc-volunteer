var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

var TARGET_PLATFORM = 'ios';

gulp.task('copy-www-folder', function() {
  var www = path.join(process.cwd(), 'www', '**', '*');
  var dest = path.join(process.cwd(), 'build', TARGET_PLATFORM);

  return gulp.src(www)
    .pipe(gulp.dest(dest));
});

gulp.task('copy-merges-folder', ['copy-www-folder'], function() {
  var merge = path.join(process.cwd(), 'merges', TARGET_PLATFORM, '**', '*');
  var dest = path.join(process.cwd(), 'build', TARGET_PLATFORM);

  return gulp.src(merge)
    .pipe(gulp.dest(dest));
});

gulp.task('update-manifest', ['copy-merges-folder'], function() {
  function checksum(filename){
    data = fs.readFileSync(filename, 'utf8');
    return crypto.createHash('sha1').update(data).digest('hex');
  }

  var rootDir = path.join(process.cwd(), 'build', TARGET_PLATFORM);
  var manifestFile = path.resolve(rootDir, 'manifest.json');

  console.log('root='+rootDir);
  console.log('manifest='+manifestFile);

  var manifest;

  try {
    manifest = fs.readFileSync(manifestFile,'utf8');
    manifest = JSON.parse(manifest);
    if(typeof manifest !== "object") throw new Error('Manifest not an object!');
    if(!manifest.files) throw new Error("Manifest has no files!");
  } catch(e){
    console.error('Invalid '+path.resolve(manifestFile),e,manifest);
    process.exit(1);
  }

  var versionChecksum = "";

  for(var key in manifest.files) {
    try {
      var filename = key;
      var version = checksum(path.resolve(rootDir,filename));
      versionChecksum += version;
      manifest.files[key].version = version;
    } catch(e){
      console.error('Could not hash file.',e);
    }
  }

  manifest.version = crypto.createHash('sha1').update(versionChecksum).digest('hex');

  try {
    fs.writeFileSync(
      manifestFile,
      JSON.stringify(manifest,null,2)
    );
  } catch(e) {
    console.error('Could not write manifest.json',e);
  }
});