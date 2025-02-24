// css
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const mmq = require('gulp-merge-media-queries');
const autoprefixer = require('autoprefixer');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const packageImporter = require('node-sass-package-importer');

const postcssOptions = [
    autoprefixer({
        //browsers: ['last 1 version']
    })
];
const scssOptions = {
    outputStyle: 'expanded',
    importer: packageImporter({
        extensions: ['.scss', '.css']
    })
};
const cssnanoOptions = {
    autoprefixer: false
};
module.exports = () => {
    $.gulp.task('styles', function(done) {
        return $.gulp
            .src($.path.src.scss + '**/*.scss')
            .pipe($.debug())
            .pipe($.plumber())
            .pipe(sourcemaps.init())
            .pipe(sass(scssOptions))
            .pipe(postcss(postcssOptions))
            .pipe(mmq())
            .pipe(cleanCss())
            .pipe(sourcemaps.write('.'))
            .pipe($.plumber.stop())
            .pipe($.gulp.dest($.path.dev.css))
            .pipe(
                $.browserSync.reload({
                    stream: true
                })
            );
    });
    $.gulp.task('styles:prod', () => {
        return $.gulp
            .src($.path.dev.css + '**/*.css')
            .pipe($.debug())
            .pipe($.plumber.stop())
            .pipe($.gulp.dest($.path.prod.css));
    });
};
