import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import browsersync from 'browser-sync';
import del from 'del';
import ejs from 'gulp-ejs';
import htmlhint from 'gulp-htmlhint';
import sassGlob from 'gulp-sass-glob';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssdeclsort from 'css-declaration-sorter';
import beautify from 'gulp-beautify';
import imagemin from 'gulp-imagemin';
import { rollup } from 'rollup';
import rollupConfig from './rollup.config.js';
import rename from 'gulp-rename';

const isPrd = (process.env.NODE_ENV === 'production')

const paths = {
  dist: './dist',
  src: './src',
}

// Browsersync Tasks
const browser = (cb) => {
  browsersync.init({
    server: paths.dist
  });
  cb();
}

const clear = () => {
  return del(paths.dist)
}
const copy = () => {
  return src(`${paths.src}/static/**/*`).pipe(dest(`${paths.dist}/`))
}

const buildHTML = () => {
  return src([
    `${paths.src}/ejs/**/*.ejs`,
    `!${paths.src}/ejs/**/_*.ejs`
  ])
    .pipe(ejs({ title: 'gulp-ejs' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(beautify.html({
      indent_size: 2,
      // indent_with_tabs: true,
      max_preserve_newlines: 1,
      end_with_newline: true
    }))
    .pipe(dest(paths.dist))
    .pipe(browsersync.stream())
}

const lintHTML = () => {
  return src(`${paths.dist}/**/*.html`)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
}

/* CSS */
const buildCSS = () => {
  return src([
    `${paths.src}/styles/**/*.scss`,
    `!${paths.src}/styles/**/--*.scss`
  ])
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({
      outputStyle: 'expanded',
    }))
    .pipe(postcss([
      cssdeclsort({ order: 'smacss' }),
      autoprefixer({
        "overrideBrowserslist": ["last 2 versions", "ie >= 11", "Android >= 4"],
        cascade: false
      }),
    ]))
    .pipe(sourcemaps.write())
    .pipe(dest(`${paths.dist}/assets/styles/`))
    .pipe(browsersync.stream())
}

/* JS */
const rollupJS = (cb) => {
  return rollup(rollupConfig)
    .then(bundle => {
      bundle.write(rollupConfig.output)
    })
    .then(() => {
      if (cb) cb();
    })
    .catch(error => {
      if (cb) cb();
      console.error(error);
    })
}

/* IMAGES */
const imgMin = () => {
  return src(`${paths.src}/images/**/*`)
		.pipe(imagemin())
		.pipe(dest(`${paths.dist}/assets/images/`))
}


/* WATCHING */
const watchFiles = (cb) => {
  function reload(cb2) {
    browsersync.reload()
    cb2()
  }
  watch(`${paths.src}/static/**/*`, series(copy, reload))
  watch(`${paths.src}/images/**/*`, series(imgMin, reload))
  watch(`${paths.src}/scripts/*.js`, series(rollupJS, reload))
  watch(`${paths.src}/styles/**/*.scss`, series(buildCSS))
  watch(`${paths.src}/ejs/**/*.ejs`, series(buildHTML))
  cb()
}

/* INIT */
export const lint = parallel(lintHTML)
export const build = series(clear, copy, parallel(buildHTML, buildCSS, rollupJS, imgMin))
export const dev = series(build, parallel(browser, watchFiles))
