module.exports = () => {
    $.gulp.task('serve', () => {
        $.browserSync.init({
            //proxy: "127.0.0.1:8001"
            server: {
                baseDir: 'webroot/',
                middleware: [
                    pugMiddleWare
                ]
            },
            startPath: '/'
        });
    });
};

function pugMiddleWare (req, res, next) {
    const url = require('url');
    const path = require('path');
    const fs = require('fs');
    const pug = require('pug');
    const pugOptions = {
        pretty: true,
        basedir: $.path.src.pug
    };
    const requestPath = url.parse(req.url).pathname;
    // .html or / で終わるリクエストだけを対象とする
    if (!requestPath.match(/(\/|\.html)$/)) {
      return next();
    }
   
    // HTMLファイルが存在すれば、HTMLを返す（今は使わない）
    const htmlPath = path.parse(requestPath).ext == '' ? `${requestPath}index.html` : requestPath;
    // try {
    //     if (fs.statSync(path.join($.path.dev.html, htmlPath))) { 
    //         console.info(`HTML発見 ${htmlPath}`);
    //         return next();
    //     }
    //   } catch(err) {
    // }


    // pug のファイルパスに変換
    const pugPath = path.join($.path.src.pug, htmlPath.replace('.html', '.pug'));
    // pugファイルがなければ404を返す
    try {
        if (!fs.statSync(pugPath)) { 
            console.info(`Pugファイル見つかりません ${pugPath}`);
            return next();
        }
      } catch(err) {
    }
   
    // pugがファイルを見つけたのでコンパイルする
    const content = pug.renderFile(pugPath, pugOptions);
    
    // コンパイル結果をレスポンスに渡す
    res.end(Buffer.from(content));
  }