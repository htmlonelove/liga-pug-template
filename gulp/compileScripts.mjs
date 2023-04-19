import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import browserify from 'browserify';
import uglify from 'gulp-uglify';
import vinylBuffer from 'vinyl-buffer';
import vinylSourceStream from 'vinyl-source-stream';

const compileMainMinScripts = () =>
  browserify('source/js/main.js', {debug: true})
      .transform('babelify', {presets: ['@babel/preset-env']})
      .bundle()
      .pipe(vinylSourceStream('main.js'))
      .pipe(vinylBuffer())
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest('build/js'));

const compileMainScripts = () =>
  browserify('source/js/main.js', {debug: true})
      .transform('babelify', {presets: ['@babel/preset-env']})
      .bundle()
      .pipe(vinylSourceStream('main.js'))
      .pipe(vinylBuffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('main.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/js'));

const compileVendorScripts = () =>
  browserify('source/js/vendor.js')
      .transform('babelify', {presets: ['@babel/preset-env']})
      .bundle()
      .pipe(vinylSourceStream('vendor.js'))
      .pipe(vinylBuffer())
      .pipe(uglify())
      .pipe(concat('vendor.min.js'))
      .pipe(gulp.dest('build/js'));

export {compileMainMinScripts, compileMainScripts, compileVendorScripts};
