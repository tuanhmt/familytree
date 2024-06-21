let gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  $ = require('gulp-load-plugins')(),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  postcssInlineSvg = require('postcss-inline-svg'),
  browserSync = require('browser-sync').create()
pxtorem = require('postcss-pxtorem'),
  postcssProcessors = [
    postcssInlineSvg({
      removeFill: true,
      paths: ['./node_modules/bootstrap-icons/icons']
    }),
    pxtorem({
      propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
      mediaQuery: false
    })
  ];

const paths = {
  scss: {
    src: './scss/style.scss',
    dest: './css',
    watch: './scss/**/*.scss',
    bootstrap: './node_modules/bootstrap/scss/bootstrap.scss',
  },
  js: {
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    jquery: './node_modules/jquery/dist/jquery.min.js',
    popper: './node_modules/popper.js/dist/umd/popper.min.js',
    poppermap: './node_modules/popper.js/dist/umd/popper.min.js.map',
    custom: './js/scripts.js',
    dest: './js'
  }
}

// Compile sass into CSS & auto-inject into browsers
function styles () {
  return gulp.src([paths.scss.watch])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        './node_modules/bootstrap/scss',
      ]
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream())
}

// Move the javascript files into our js folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.js.jquery, paths.js.popper, paths.js.poppermap])
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream())
}

// Static Server + watching scss/html files
function serve () {
  browserSync.init({
    proxy: 'https://thanhlinhd10.local.test',
  })

  gulp.watch([paths.scss.watch, paths.scss.bootstrap], styles).on('change', browserSync.reload)
}

const build = gulp.series(styles, gulp.parallel(js, serve))

exports.styles = styles
exports.js = js
exports.serve = serve

exports.default = build
