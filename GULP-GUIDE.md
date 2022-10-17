# Краткоe описание работы gulp

Запустив команду `npm i` на проект установятся все зависимости, необходимые для работы.

Основные таски сборки представлены в виде модулей и сложены в папку gulp находящуюся в корне проекта

В gulpfile.js мы импортируем зависимости.

```js
  import gulp from 'gulp'; // основа gulp
  import browserSync from 'browser-sync'; // дополнительный плагин
  import del from 'del'; // дополнительный плагин
```

Далее мы импортируем таски из модулей.

```js
  import styles from './gulp/compileStyles.mjs'; // стили
  import { copy, copyImages, copySvg } from './gulp/copyAssets.mjs'; // копирование
  import js from './gulp/compileScripts.mjs'; // js
  import { svgo, sprite, createWebp, optimizeImages } from './gulp/optimizeImages.mjs'; // работа с графикой
  import pug from './gulp/compilePug.mjs'; // pug
```

Пример модуля с таской

Сначала мы импортируем все необходимые зависимости.

```js
  import gulp from 'gulp';
  import plumber from 'gulp-plumber';
  import dartSass from 'sass';
  import gulpSass from 'gulp-sass';
  import postcss from 'gulp-postcss';
  import autoprefixer from 'autoprefixer';
  import csso from 'gulp-csso';
  import gcmq from 'gulp-group-css-media-queries';
  import rename from 'gulp-rename';
```

Далее создаём функцию.

```js
  const sass = gulpSass(dartSass);

  const compileStyles = () =>
    gulp.src('source/sass/style.scss', {sourcemaps: true})
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer({
          grid: true,
        })]))
        .pipe(gcmq()) // выключите, если в проект импортятся шрифты через ссылку на внешний источник
        .pipe(gulp.dest('build/css'))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css', {sourcemaps: '.'}));
```
Далее экспортим функцию.

```js
  export default compileStyles;
```

В gulpfile.js оставдены только базовые таски.

```js
  const server = browserSync.create();
  const streamStyles = () => styles().pipe(server.stream());
  const clean = () => del('build');
  const refresh = (done) => {
    server.reload();
    done();
  };

  const syncServer = () => {
    server.init({
      server: 'build/',
      index: 'sitemap.html',
      notify: false,
      open: true,
      cors: true,
      ui: false,
    });

    gulp.watch('source/pug/**/*.pug', gulp.series(pug, refresh));
    gulp.watch('source/sass/**/*.{scss,sass}', streamStyles);
    gulp.watch('source/js/**/*.{js,json}', gulp.series(js, refresh));
    gulp.watch('source/data/**/*.{js,json}', gulp.series(copy, refresh));
    gulp.watch('source/img/**/*.svg', gulp.series(copySvg, sprite, pug, refresh));
    gulp.watch('source/img/**/*.{png,jpg,webp}', gulp.series(copyImages, pug, refresh));

    gulp.watch('source/favicon/**', gulp.series(copy, refresh));
    gulp.watch('source/video/**', gulp.series(copy, refresh));
    gulp.watch('source/downloads/**', gulp.series(copy, refresh));
    gulp.watch('source/*.php', gulp.series(copy, refresh));
  };
```

Создание и экспорт комманд.

```js
  const build = gulp.series(clean, svgo, copy, styles, sprite, js, pug);
  const start = gulp.series(build, syncServer);

  export { optimizeImages as imagemin, createWebp as webp, build, start };
```
