$(document).ready(function(){
	$('.hamburger').click(function(){
		// .hamburgerと.navにactiveクラスを付与/除外
		$(this).toggleClass('active');
		$('.nav').toggleClass('active');
	});
	$('.nav a').click(function(){
		$('.hamburger').removeClass('active');
		$('.nav').removeClass('active');
    });

	// スムーズスクロールの実装
	$('a[href^="#"]').click(function(event) {
        event.preventDefault(); // デフォルトのアンカー動作を無効化

        // クリックしたリンクのhref属性の値（ターゲットのID）を取得
        var target = $(this.getAttribute('href'));

        if (target.length) {
          // スムーズスクロール
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 800); // スクロールの時間（ミリ秒）
        }
    });

});