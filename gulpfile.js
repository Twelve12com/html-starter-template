// https://gist.github.com/leymannx/f7867942184d01aa2311

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sassLint = require('gulp-sass-lint'),
	sourcemaps = require('gulp-sourcemaps'),
	prefix = require('gulp-autoprefixer');

var pump = require("pump");
var phpinc = require("php-include-html");
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');


// SETTINGS
// ---------------

var sassOptions = {
	outputStyle: 'expanded'
};


// BUILD SUBTASKS
// ---------------

gulp.task("php", function (cb) {
	pump([
		gulp.src("./*.html"),
		phpinc({ verbose: true }),
		gulp.dest("./dist/")
	], cb);
});

gulp.task('styles', function () {
	return gulp.src('./style/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions))
		.pipe(prefix())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('sass-lint', function () {
	return gulp.src('./style/scss/**/*.scss')
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
});

gulp.task('scripts', function () {
	return gulp.src('./script/*.js')
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('images', function () {
	return gulp.src('./image/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/image/'));
});


// WATCHERS
// ---------------

gulp.task('watch', function () {
	gulp.watch('./*.html', gulp.series('php'));
	gulp.watch('./*.php', gulp.series('php'));

	gulp.watch('./style/style.scss', gulp.series('styles'));
	gulp.watch('./style/scss/**/*.scss', gulp.series('styles'));

	gulp.watch('./script/*.js', gulp.series('scripts'));
	gulp.watch('./script/**/*.js', gulp.series('scripts'));

	gulp.watch('./image/*', gulp.series('images'));
	gulp.watch('./image/**/*', gulp.series('images'));
});


// BUILD TASKS
// ------------

gulp.task('default', gulp.series('styles', 'scripts', 'images', 'php', 'watch'));
gulp.task('build', gulp.series('styles', 'scripts', 'images', 'php'));