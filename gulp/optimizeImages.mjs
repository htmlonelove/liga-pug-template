import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';
import pngQuant from 'imagemin-pngquant';
import mozJpeg from 'imagemin-mozjpeg';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';

const sprite = () =>
  gulp
    .src('source/img/sprite/*.svg')
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/img'));

const optimizeSvg = () =>
  gulp
      .src(['build/img/**/*.svg', '!build/img/sprite.svg'])
      .pipe(svgo())
      .pipe(gulp.dest('build/img'));

const optimizeJpg = () =>
  gulp
      .src('build/img/**/*.{jpg,jpeg}')
      .pipe(imagemin([mozJpeg({quality: 90, progressive: true})]))
      .pipe(gulp.dest('build/img'));

const optimizePng = () =>
  gulp
      .src('build/img/**/*.png')
      .pipe(
          imagemin([
            pngQuant({
              speed: 1,
              strip: true,
              dithering: 1,
              quality: [0.8, 0.9],
            })]))
      .pipe(gulp.dest('build/img'));

/*
  Optional tasks
  ---------------------------------

  Используйте отличное от дефолтного значение root, если нужно обработать отдельную папку в img,
  а не все изображения в img во всех папках.

  root = '' - по дефолту webp добавляются и обновляются во всех папках в source/img/
  root = 'content/' - webp добавляются и обновляются только в source/img/content/
*/

const createWebp = () => {
  const root = '';
  return gulp
      .src(`source/img/${root}**/*.{png,jpg}`)
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest(`source/img/${root}`));
};

const createAvif = () => {
  const root = '';
  return gulp
      .src(`source/img/${root}**/*.{png,jpg}`)
      .pipe(avif())
      .pipe(gulp.dest(`source/img/${root}`));
};

export {sprite, createWebp, createAvif, optimizeSvg, optimizePng, optimizeJpg};
