// es
const babel = require('gulp-babel');
const browserify = require('browserify');
const through2 = require('through2');
const eslint = require('gulp-eslint');

module.exports = () => {
    //babel
    $.gulp.task('scripts', done => {
        const browserified = through2.obj((file, encode, callback) => {
            browserify(file.path)
             .bundle((error, response) => {
              if(error) {
               return callback(error);
              }
              file.contents = response;
              callback(null, file);
             });
            });
        return $.gulp
            .src($.path.src.es + '**/*.js')
            .pipe(browserified)
            .pipe($.debug())
            .pipe(
                $.plumber({
                    errorHandler: $.notify.onError(
                        'Error BABEL: <%= error.message %>'
                    )
                })
            )
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
            .pipe(babel())
            .pipe($.plumber.stop())
            .pipe($.gulp.dest($.path.dev.js))
            .pipe(
                $.browserSync.reload({
                    stream: true
                })
            );
    });

    $.gulp.task('scripts:prod', () => {
        return $.gulp
            .src($.path.dev.js + '**/*.js')
            .pipe($.debug())
            .pipe($.plumber())
            .pipe($.plumber.stop())
            .pipe($.gulp.dest($.path.prod.js));
    });
};
