const imagemin = require('gulp-imagemin');
const imageminOptions = [
    imagemin.gifsicle({ interlaced: true }),
    imagemin.mozjpeg({ quality: 75, progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
        plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
    })
];

module.exports = () => {
    $.gulp.task('images', () => {
        return $.gulp
            .src($.path.src.img + '**/*.+(png|jpg|jpeg|svg)')
            .pipe($.debug())
            .pipe(
                $.cache(imagemin(imageminOptions), {
                    name: 'images_cache'
                })
            )
            .pipe($.gulp.dest($.path.dev.img));
    });
    $.gulp.task('images:prod', () => {
        return $.gulp
            .src($.path.dev.img + '**/*.+(png|jpg|jpeg|svg)')
            .pipe($.debug())
            .pipe(
                $.cache(imagemin(imageminOptions), {
                    name: 'images_cache'
                })
            )
            .pipe($.gulp.dest($.path.prod.img));
    });
};
