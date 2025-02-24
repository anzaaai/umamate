'use strict';
const webroot = 'webroot/';

global.$ = {
    path: {
        task: require('./gulp/path/tasks.js'),
        src: {
            root: 'resources/',
            es: 'resources/es/',
            scss: 'resources/sass/',
            pug: 'resources/pug/',
            img: 'resources/img/'
        },
        dev: {
            root: webroot,
            assets: webroot+'assets/',
            html: webroot+'',
            css: webroot+'assets/css/',
            js: webroot+'assets/js/',
            img: webroot+'assets/img/',
            fonts: webroot+'assets/fonts/'
        },
        prod: {
            root: 'product/',
            assets: 'product/assets/',
            html: 'product/',
            css: 'product/assets/css/',
            js: 'product/assets/js/',
            img: 'product/assets/img/',
            fonts: 'product/assets/fonts/'
        }
    },
    gulp: require('gulp'),
    // browserSync: require('browser-sync').create(),
    browserSync: require('browser-sync'),
    plumber: require('gulp-plumber'),
    debug: require('gulp-debug'),
    notify: require('gulp-notify'),
    cache: require('gulp-cache'),
    arg: (argList => {
        let arg = {}, a, opt, thisOpt, curOpt;
        for (a = 0; a < argList.length; a++) {
      
          thisOpt = argList[a].trim();
          opt = thisOpt.replace(/^\-+/, '');
      
          if (opt === thisOpt) {
      
            // argument value
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
      
          }
          else {
      
            // argument name
            curOpt = opt;
            arg[curOpt] = true;
      
          }
        }
        return arg;
    })(process.argv)
};


$.path.task.forEach(taskPath => {
    require(taskPath)();
});

$.gulp.task('test', done => {
    console.log('test');
    done();
});

$.gulp.task(
    'default',
    $.gulp.series(
        $.gulp.parallel('pug', 'scripts', 'styles', 'images'),
        'watch',
        'serve',
        done => {
            done();
        }
    )
);

$.gulp.task(
    'dev',
    $.gulp.series(
        $.gulp.parallel('pug', 'scripts', 'styles', 'images'),
        done => {
            done();
        }
    )
);

$.gulp.task(
    'prod',
    $.gulp.series(
        'clean:prod',
        $.gulp.parallel(
            'pug:prod',
            'scripts:prod',
            'styles:prod',
            'images:prod'
        ),
        done => {
            done();
        }
    )
);

$.gulp.task(
    'build',
    $.gulp.series(
        $.gulp.parallel('clean', 'clean:prod'),
        $.gulp.parallel('pug', 'scripts', 'styles', 'images'),
        $.gulp.parallel(
            'pug:prod',
            'scripts:prod',
            'styles:prod',
            'images:prod'
        ),
        done => {
            done();
        }
    )
);