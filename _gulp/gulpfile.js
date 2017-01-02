"use strict";

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  uncss = require('gulp-uncss'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require("gulp-rename"),
  plumber = require('gulp-plumber'),
  spritesmith = require('gulp.spritesmith'),
  buffer = require('vinyl-buffer'),
  merge = require('merge-stream'),
  cheerio = require('gulp-cheerio'),
  jadeInheritance = require('gulp-jade-inheritance'),
  jade = require('gulp-jade'),
  changed = require('gulp-changed'),
  cached = require('gulp-cached'),
  gulpif = require('gulp-if'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglifyjs'),
  concat = require('gulp-concat'),
  filter = require('gulp-filter');

var plugins = require("gulp-load-plugins")();

gulp.task('sprite-image', function () {
  var spriteData = gulp.src('./img/img-sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.sass',
    algorithm : 'top-down'
  }));
  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(gulp.dest('./dist/img/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(gulp.dest('./_sass/1-base/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('sass', function() {
  gulp.src('./_sass/main.sass')
    .pipe(plumber())
    .pipe(sass({
  		includePaths: require('node-bourbon').includePaths
  	}).on('error', sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: true }))
    .pipe(minifycss())
    .pipe(plugins.sourcemaps.write("./"))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({stream:true}));
});

// jade
gulp.task('jade', function() {
  gulp.src('./_jade/**/*.jade')
    .pipe(changed('./dist/', {extension: '.html'}))
    .pipe(gulpif(global.isWatching, cached('jade')))
    .pipe(jadeInheritance({basedir: './_jade/'}))
    .pipe(filter(function (file) {
      return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe(plumber())
    .pipe(jade({
      pretty: '    '
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('scripts', function() {
	return gulp.src([
		'./dist/js/libs/modernizr/modernizr.js',
		'./dist/js/libs/jquery/jquery-2.2.4.min.js',
		'./dist/js/libs/jquery/jquery-migrate-1.4.1.min.js',
		'./dist/js/libs/plugins-scroll/plugins-scroll.js',
		'./dist/js/libs/magnific-popup/jquery.magnific-popup.min.js'
		])
		.pipe(concat('libs.js'))
		// .pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('setWatch', function() {
  global.isWatching = true;
});

// Html
gulp.task('html', function(){
  gulp.src('./dist/*.html');
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    notify: false,
    reloadDelay: 3000
  });
});

gulp.task('watch', ['setWatch'], function () {
  gulp.watch('./_sass/**/*.sass', ['sass']);
  gulp.watch('./_jade/**/*.jade', ['jade']);
  gulp.watch('./dist/libs/**/*.js', ['scripts']);
  gulp.watch('./img/img-sprite/*.png', ['sprite-image']);
  gulp.watch('./img/svg-sprite/*.svg', ['sprite-svg']);
  gulp.watch('./dist/js/*.js').on("change", browserSync.reload);
	gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync','watch']);
