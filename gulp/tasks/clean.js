const del = require('del');

module.exports = () => {
    $.gulp.task('clean', () => {
        return del([$.path.dev.root]);
    });
    $.gulp.task('clean:prod', () => {
        return del([$.path.prod.root]);
    });
};
