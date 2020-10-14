# Краткоe описание работы gulp

Запустив команду `npm i` на проект установятся все зависимости, необходимые для работы.

Превым делом, в gulp мы находим эти зависимости и присваиваем их переменным.

```js
  const gulp = require(`gulp`); // основа gulp
  const sass = require(`gulp-sass`); // дополнительный плагин
```

Далее мы описываем задачи gulp - `gulp.task()`

```js
  gulp.task(`css`, function () {
    return gulp.src(`source/sass/style.scss`) // указываем с каким файлом мы работаем
        .pipe(sass()) // преобразуем scss в css
        .pipe(gulp.dest(`build/css`)) // указываем куда положить результат преобразования
  });
```

## Краткое описание каждой таски.

1. Преобразовает pug в html.

```js
  gulp.task('pug', function () {
    return gulp.src('source/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({ pretty: true }))
        .pipe(cached('pug'))
        .pipe(gulp.dest('build'));
  });
```

2. Преобразовает sass в css. В build кладется как стандартная версия, так и минифицированная.

```js
  gulp.task(`css`, function () {
    return gulp.src(`source/sass/style.scss`)
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer({
          grid: true,
        })]))
        .pipe(gulp.dest(`build/css`))
        .pipe(csso())
        .pipe(rename(`style.min.css`))
        .pipe(sourcemap.write(`.`))
        .pipe(gulp.dest(`build/css`))
        .pipe(server.stream());
  });
```

3. Преобразовает js ES6 в ES5 и минифицирует его. 

```js
  gulp.task(`script`, function () {
    return gulp.src([`source/js/main.js`])
        .pipe(webpackStream(webpackConfig))
        .pipe(uglify())
        .pipe(gulp.dest(`build/js`));
  });
```

4. Оптимизирует svg.

```js
  gulp.task(`svgo`, function () {
    return gulp.src(`source/img/**/*.{svg}`)
        .pipe(imagemin([
          imagemin.svgo({
              plugins: [
                {removeViewBox: false},
                {removeRasterImages: true},
                {removeUselessStrokeAndFill: false},
              ]
            }),
        ]))
        .pipe(gulp.dest(`source/img`));
  });
```

5. Создает спрайт.

```js
  gulp.task(`sprite`, function () {
    return gulp.src(`source/img/sprite/*.svg`)
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename(`sprite_auto.svg`))
        .pipe(gulp.dest(`build/img`));
  });
```

6. Запускает локальный сервер, который отслеживает изменения в html, css, js, изображениях и автоматически обновляет себя при изменениях в этих файлах.

```js
  gulp.task(`server`, function () {
    server.init({
      server: `build/`,
      notify: false,
      open: true,
      cors: true,
      ui: false,
    });

    gulp.watch('source/pug/**/*.pug', gulp.series('pug', 'refresh'));
    gulp.watch(`source/sass/**/*.{scss,sass}`, gulp.series(`css`));
    gulp.watch(`source/js/**/*.js`, gulp.series(`script`, `refresh`));
    gulp.watch(`source/img/**/*.svg`, gulp.series(`copysvg`, `sprite`, `pug`, `refresh`));
    gulp.watch(`source/img/**/*.{png,jpg}`, gulp.series(`copypngjpg`, `pug`, `refresh`));
  });

  gulp.task(`refresh`, function (done) {
    server.reload();
    done();
  });

  gulp.task(`copysvg`, function () {
    return gulp.src(`source/img/**/*.svg`, {base: `source`})
        .pipe(gulp.dest(`build`));
  });

  gulp.task(`copypngjpg`, function () {
    return gulp.src(`source/img/**/*.{png,jpg}`, {base: `source`})
        .pipe(gulp.dest(`build`));
  });
```

7. Копирует файлы из source в build.

```js
  gulp.task(`copy`, function () {
    return gulp.src([
      `source/fonts/**/*.{woff,woff2}`,
      `source/favicon/**`,
      `source/img/**`,
      `source/video/**`,
      `source/downloads/**`,
    ], {
      base: `source`,
    })
        .pipe(gulp.dest(`build`));
  });
```

8. Очищает build.

```js
  gulp.task(`clean`, function () {
    return del(`build`);
  });
```

9. Запускает сборку и локальный сервер. При необходимости цепочку вызовов можно дополнить. 

❗ Порядок важен.

```js
  gulp.task(`build`, gulp.series(
      `clean`,
      `svgo`,
      `copy`,
      `sprite`,
      `css`,
      `script`,
      `pug`
  ));

  gulp.task(`start`, gulp.series(`build`, `server`));
```

---

### Опциональные таски. 
Запуск через `npm run taskName`.

10. Создает webp изображения в source.

```js
  gulp.task(`webp`, function () {
    return gulp.src(`source/img/**/*.{png,jpg}`)
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest(`source/img`));
  });
```

11. Оптимизирует изображения в build.

```js
  gulp.task(`imagemin`, function () {
    return gulp.src(`build/img/**/*.{png,jpg}`)
        .pipe(imagemin([
          imagemin.optipng({optimizationLevel: 3}),
          imagemin.mozjpeg({quality: 75, progressive: true}),
        ]))
        .pipe(gulp.dest(`build/img`));
  });
```
