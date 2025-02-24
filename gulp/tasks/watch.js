module.exports = () => {
    // Watchers
    $.gulp.task('watch', done => {
        //htmlへの書き出し無し（pugのコンパイルが重くなってきたら使用してください）
        // $.gulp.watch($.path.src.pug + '**/*.pug', $.gulp.task('pug-nohtml'));
        //htmlへの書き出し有り
        $.gulp.watch($.path.src.pug + '**/*.pug', $.gulp.task('pug'));
        $.gulp.watch($.path.src.scss + '**/*.scss', $.gulp.task('styles'));
        $.gulp.watch($.path.src.es + '**/*.js', $.gulp.task('scripts'));
        done();
    });
};
