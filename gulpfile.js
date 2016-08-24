var gulp         = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    cleanCSS     = require('gulp-clean-css'),
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){ // Создаем таск Sass
  return gulp.src('app/sass/**/*.sass') // Берем источник
    .pipe(sass({
    includePaths: require('node-bourbon').includePaths
  }).on('error', sass.logError))
  .pipe(rename({suffix: '.min', prefix : ''}))
  .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
  .pipe(cleanCSS())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.stream());
});

gulp.task('browser-sync',function () {
  browserSync({
    server : {
      baseDir : 'app'
    },
    notify : false
  });
});

gulp.task('scripts', function () {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    'app/libs/filterizr/dist/jquery.filterizr.min.js',
    'app/libs/mixitup-master/build/jquery.mixitup.min.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs',['sass'], function () {
  return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function () {
  gulp.watch('app/sass/**/*.sass',['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function () {
  return del.sync('dist/');
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*') // Берем все изображения из app
    .pipe(imagemin({ // Сжимаем их с наилучшими настройками
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});


gulp.task('build',['clean', 'sass', 'scripts'], function () {
  var buildCss = gulp.src([
    'app/css/main.min.css',
    'app/css/libs.min.css',
    'app/css/fonts.min.css',
    'app/css/header.min.css'
  ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var  buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});