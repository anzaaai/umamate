const tinypng = require('gulp-tinypng-compress');
const tinypngOptions = {
    key: 'CLg1MH0ysFhKFq4Bcl2zfzmDDFrddB8t',
    cached: true
};

module.exports = () => {
    $.gulp.task('png', () => {
        const path = typeof($.arg.dir) == 'undefined' ? $.path.src.img : $.path.src.img + $.arg.dir;
        const dirpath = typeof($.arg.dir) == 'undefined' ? $.path.dev.img : $.path.dev.img + $.arg.dir + '/';

        return $.gulp
            .src(path + '/**/*.png')
            .pipe($.debug())
            .pipe(tinypng(tinypngOptions))
            .pipe($.gulp.dest(dirpath));
    });
    $.gulp.task('png:prod', () => {
        const path = typeof($.arg.dir) == 'undefined' ? $.path.src.img : $.path.src.img + $.arg.dir;
        const dirpath = typeof($.arg.dir) == 'undefined' ? $.path.prod.img : $.path.prod.img + $.arg.dir + '/';

        return $.gulp
            .src(path + '**/*.png')
            .pipe($.debug())
            .pipe(tinypng(tinypngOptions))
            .pipe($.gulp.dest(dirpath));
    });
};
