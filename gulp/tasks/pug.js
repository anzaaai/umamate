const pug = require('gulp-pug');
const pugOptions = {
    pretty: true,
    basedir: $.path.src.pug
};
module.exports = () => {
    // Pug
    $.gulp.task('pug', () => {
        return $.gulp
            .src([
                $.path.src.pug + '**/*.pug',
                '!' + $.path.src.pug + '**/_*.pug'
            ])
            .pipe($.debug())
            .pipe($.plumber())
            .pipe(pug(pugOptions))
            .pipe($.plumber.stop())
            .pipe($.gulp.dest($.path.dev.html))
            .pipe(
                $.browserSync.reload({
                    stream: true
                })
            );
    });
    // Pug-nohtml(webrootへの書き出し無し)
    $.gulp.task('pug-nohtml', () => {
        return $.gulp
        .src([
            $.path.src.pug + '**/*.pug',
            '!' + $.path.src.pug + '**/_*.pug',
            '!' + $.path.src.pug + '_**/*.pug'
        ]).pipe(
                $.browserSync.reload({
                    stream: true
                })
            );
    });
    //temporary html
    $.gulp.task('pug:prod', () => {
        return $.gulp
            .src($.path.dev.html + '**/*.html')
            .pipe($.debug())
            .pipe($.plumber())
            .pipe($.plumber.stop())
            .pipe($.gulp.dest($.path.prod.html));
    });
};
