//Gulp functions
const { src, dest, watch, series, parallel } = require("gulp");
//Gulp plugin imports
const sass = require("gulp-sass");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const browsersync = require("browser-sync").create();
const notify = require("gulp-notify");
//Files
const files = {
  stylesPath: "./src/scss/**/*.scss",
  scriptsPath: [
    "./src/js/main.js",
  ],
  imgWatchPath: "./src/images/*",
  scriptsWatchPath: "./src/js/**/*.js",
};
//Gulp Tasks

function cssTask() {
  return src(files.stylesPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([cssnano(), autoprefixer()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/scss"))
    .pipe(notify("CSS Task Done"));
}

//JS
function jsTask() {
  return src(files.scriptsPath)
    .pipe(concat("app.js"))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist/js"))
    .pipe(notify("JS Task Done"));
}

//Assets

function optImages() {
  return src(files.imgWatchPath)
    .pipe(imagemin())
    .pipe(dest("./dist/images"))
    .pipe(notify("Image Task Done"));
}
//Browsersync
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "./",
    },
  });
  cb();
}
function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}
//Watcher

function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    [files.stylesPath],
    {
      interval: 1000,
      usePolling: true,
    },
    series(cssTask, browsersyncReload)
  );
  watch(
    [files.scriptsWatchPath],
    {
      interval: 1000,
      usePolling: true,
    },
    series(jsTask, browsersyncReload)
  );
  watch(
    [files.imgWatchPath],
    {
      interval: 1000,
      usePolling: true,
    },
    series(optImages, browsersyncReload)
  );
}

//Individual tasks
exports.css = series(parallel(cssTask));
exports.js = series(parallel(jsTask));
exports.images = series(parallel(optImages));
exports.watch = series(browsersyncServe, watchTask);
//Default task
exports.default = series(
  parallel(cssTask, jsTask),
  browsersyncServe,
  watchTask
);
