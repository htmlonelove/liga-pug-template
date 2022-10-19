import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import cached from 'gulp-cached';

const compilePug = () => {
  return gulp
      .src('source/pug/pages/*.pug')
      .pipe(plumber())
      .pipe(pug({pretty: true}))
      .pipe(cached('pug'))
      .pipe(gulp.dest('build'));
};

export default compilePug;
