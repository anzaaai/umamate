const webp = require('gulp-webp');
// fetch command line arguments


module.exports = () => {
    $.gulp.task('webp', () => {
        const path = typeof($.arg.dir) == 'undefined' ? $.path.src.img : $.path.src.img + $.arg.dir;
        const dirpath = typeof($.arg.dir) == 'undefined' ? $.path.dev.img : $.path.dev.img + $.arg.dir + '/';

        return $.gulp.src(path + '/**/*.+(png|jpg|jpeg|gif)')
            .pipe($.debug())
            .pipe(webp())
            .pipe($.gulp.dest(dirpath));
    });
};
