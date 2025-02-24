# pugtemplate
gulp+pug+sass+babelで静的サイトを効率よく構成する為のテンプレート一式です。

# 目次
1. [始め方](#anchor1)
2. [ファイル構成](#anchor2)
3. [画像変換機能について](#anchor3)
4. [npmを使ったプラグインのインストールについて](#anchor4)
5. [オリジナルjQueryプラグイン](#anchor5)
6. [sassの便利なmixin](#anchor6)
7. [pugの便利なmixin](#anchor7)
8. [フォームバリデーション](#anchor8)

<a id="anchor1"></a>
## 始め方
bitbacketからファイル一式をcloneし、新しくディレクトリを作成し、コピーして使用してください。

`npm install --save-dev`で必要なプラグインが読み込まれます。あとは`npm run gulp`で動きます。


<a id="anchor2"></a>
## ファイル構成

### webroot
`npm run gulp`でブラウザに表示されるディレクトリです。

resourcesのcompile結果がここへ出力されます。

webroot自体は画像やJsのプラグインファイルを追加する際だけ編集し、その他は全てresourcesディレクトリ内で作業します。

### product
`npm run gulp build`で納品用ファイルとしてcssからmapファイルの指定を取り除いたり、ファイル類を圧縮したものが格納されます。

### resources
実際の作業ディレクトリです。

	■es...ページ全体で使用するjavascript
	└app.js
	
	■pug...最初に_が付くフォルダ及びファイルはhtmlにcompileされない
	├_partials...サイト設計に使用するtemplate類
	|	├_config.pug...サイト名やdescriptionなどサイト全体の設定を記述
	|	├_data.pug...サイト内で使用するまとまったデータ類を記述
	|	├_favicons.pug...head内に入るfavicon類の設定
	|	├_footer.pug...footerファイル
	|	├_ga.pug...GoogleAnalyticsのscript
	|	├_head.pug...サイト全体のheadタグの中身を記述
	|	├_header.pug...headerファイル
	|	├_layout-page.pug...下層ページに使用するtemplate
	|	├_layout.pug...サイト全体のtemplate
	|	├_localmixin.pug...サイト固有で使用するmixin
	|	└_mixin.pug...汎用mixin(OGPタグなど)
	|
	└sample...実際にhtmlとして出力されるファイル類(この場合webroot下にsampleディレクトリが生成される)
		├page_sample.pug
		└page_sample2.pug


	■sass...最初に_が付くフォルダ及びファイルはcssにcompileされない
	├top.scss...トップページでのみ使用するスタイルを記述
	├app.scss...下記全てのsassのまとめ及びタグそのものへのスタイル、cssハックなどを記述
	|
	├_components...ページまたは要素のスタイルを記述
	|	├_content.scss...別途ファイルを分ける程でも無いページごとのスタイルを記述
	|	├_button.scss...ボタン
	|	├_footer.scss...フッタ
	|	├_form.scss...フォーム周り
	|	├_header.scss...ヘッダ
	|	├_icon.scss...アイコン
	|	├_layout.scss...全体のレイアウト
	|	├_list.scss...リスト
	|	├_nav.scss...ナビゲーション(グローバルナビ、ローカルナビ)
	|	├_page.scss...サイト内汎用スタイル
	|	├_tab.scss...タブ
	|	├_table.scss...テーブル
	|	└_tag.scss...タグ
	|
	└_library...色設定や関数などscssの構成に使用するプログラム類を記述
		├_animation.scss...使用するアニメーションタイムラインを記述
		├_colors.scss...使用する色を変数として記述
		├_fonts.scss...フォントファイルの読み込み
		├_mixin.scss...sass内で使用する関数や変数などを記述
		└_typo.scss...テキストスタイルの設定を記述


--
<a id="anchor3"></a>
## 画像変換機能について
gulp上でpngの圧縮及びwebpへの変換が可能です。

### png圧縮
#### resource/img配下のpngを圧縮してwebroot配下へ書き出します。
> npm run gulp png

任意のディレクトリのみ対象に処理を行う事も可能です。

>npm run gulp png -- --dir ディレクトリ名
>
>例）resource/img/top/slideの画像を圧縮したい場合
>
>npm run gulp png -- --dir top/slide


tinypngの処理は重く、1ヶ月に圧縮可能なファイル数の制限があるため、是非積極的に使ってみてください。

-

### webp変換
#### resource/img配下のpng,jpg,jpeg,gifを圧縮してwebroot配下へ書き出します。
> npm run gulp webp

こちらもpng圧縮同様任意のディレクトリのみ対象に処理を行う事が可能です。

>npm run gulp webp -- --dir ディレクトリ名

変換したwebpを表示する際は[pugの便利なmixin](#anchor7)のpicture mixinを使うと便利です。


--
<a id="anchor4"></a>
## npmを使ったプラグインのインストールについて
JSやCSSのプラグインに関してnpmを使ったインストールにも対応しました。

今まで通りcdnを使っても良いですが、npmを使えば1つのjs/cssファイルにまとめる事が出来るのでリクエスト数が節約できます。

使い方は
npm(https://www.npmjs.com/)で使用したいプラグインを検索し、
> npm install プラグイン名

を実行し、app.jsやapp.css内でimportします。

JSの場合はそのままプラグイン名でrequire、CSSの場合はnode_modulesからのパスを頭に~を付ければimportされます。
> 例
> 
> const emergence = require('emergence.js');
> 
> @import '~modaal/dist/css/modaal.scss';

サンプル代わりにmodaal（モーダルプラグイン）とress（リセット用CSS）をInstallしてあります。
不要であれば記述を削除してください。


不明な点があれば小杉まで気軽に声かけてください。

--
<a id="anchor5"></a>
## オリジナルjQueryプラグイン
### pageScroll
#### ページ内リンク時にアニメーションでスクロールします
> $('a').pageScroll(option);

#### option
|プロパティ||説明|
|:---|:---|:---|
|**potision**|number|アニメーションの停止位置を調整します。（固定ヘッダなどがある場合に使用）|
|**speed**|number|アニメーションの再生速度（デフォルトは500）|
|**beforeScroll**|function|スクロール開始前に実行される関数|
|**afterScroll**|function|スクロール終了後に実行される関数|

### fixedElement
#### 要素を画面に固定し、一定要素まで来たらそこでストップさせます（トップへ戻るボタンなどに使用）
> $('固定させたい要素').fixedElement(option);

#### option

|プロパティ||説明|
|:---|:---|:---|
|**fixedelement**|selector|固定先の要素（.footerなど）|
|**potision**|top/center/bottom|fixedelementのどの位置で固定するか（デフォルトはbottom）|

### scrollAfterLoading
#### URLにハッシュ（#）が付いている場合、アニメーションスクロールしながら表示
pageScrollを使用しています。
>(() => {
>new scrollAfterLoading();
>});

### tabContent
#### タブ切り替え
JS未使用でCSSオンリーの実装に変更しました。index.pug内にsampleがあります。


### changeFontSize
#### 文字サイズ変更


### spMenu
#### スマホメニューを表示する
 a data-spmenuをクリックするとbody class="activemenu"がtoggleClassするので後はcssでお好みに。
activemenuが付与されるとspMenu.open、削除されるとspMenu.closeイベントトリガーがbodyに対して発行されます。
>new spMenu();


--
## 便利なmixin
scssやpug内の_mixinファイルにはちょっと便利な関数を入れています。

<a id="anchor6"></a>
## SCSS編
### mq($size(sm/md/lg), $width: max(,min));
#### メディアクエリを生成します。
$sizeにはpxなどの数値を入れる事も出来ますが、sm,md,lgで規定値を呼び出して使う方が多いでしょう。

規定値は同じ_mixin.scssファイル内で以下の様に設定されていますので適宜変更してください。

	/// Breakpoint
	$screen: (
	  sm: 640px,
	  md: 960px,
	  lg: 1400px
	) !default;
	
 使用するときは次のように使います。
 
 	.sp-Only;
 		display: none;
	 	@include mq(sm, min){
	 		display: block;
	 	}
 	}
 
-


### _vw($px, $key: 'sm')
#### pxをvwへ変換します。
リキッドレイアウトなどで使用します。ブラウザ幅に対する可変値に変換します。<br>$keyに入る値はメディアクエリ生成と全く同じものが使用可能です。

以下の様に使う事で全ての値をvwに置き換える事が可能です。

	//例）
	// PCデザイン（1380px）時にタイトルの文字サイズが40px、ボックスの横幅が600px
	// SPデザイン（720px）時にタイトルの文字サイズが30px、ボックスの横幅が800px
	.title {
		font-size: _vw(40, 1380);
		@include mq(sm, max){
			font-size: _vw(30, 720);
		}
	}
	.box {
		width: _vw(600, 1380);
		@include mq(sm, max){
			width: _vw(800, 720);
		}
	}

-

### bgi-ratina($src);
#### background-imageのratina対応
画像を自動で生成するわけではないので、ファイル名@2x.png,ファイル名@3x.png...といった具合にルールに沿った名前の画像を用意する必要があります。

	.bg {
		@include bgi-ratina('/assets/img/bg.png');
	}
-


### lineHeightCrop($line-height);
#### line-heightで発生する上下の余白を相殺する
<a href="https://yuyakinoshita.com/blog/2020/01/20/line-height-crop/">https://yuyakinoshita.com/blog/2020/01/20/line-height-crop/</a>

詳しい説明は上記URL。そのまま持ってきているだけです。

LPなど要素の配置が決まっている、ピクセルパーフェクトを要求されるなどデザイン要素が高い案件に適しています。<br>逆に要素の組み合わせで画面が構成されるようなシステム案件には不向きです。<br>適応した要素で:after、:beforeが使えなくなる、きちんとmargin管理をしないと返って見た目が悪くなるなどデメリットを理解した上で使用してください。

-

### getArw($color, $weight(light,medium,bold,bla), $rotate(top,bottom,right,left), $round(true/false));
#### 色や太さ、角丸を設定したsvgの矢印データを返します。
以下のようにcontentやbackground-imageに使用できます。(疑似要素はサイズ指定が出来ない為、background-imageで指定してbackground-size: contain;で調整する方が使いやすいです。)
	
	.arw{
	    background-image: getArw(#FFCC00, bla, left);
	    background-repeat: no-repeat;
	    background-size: 20px;
	    background-position: 0 50%;
	    padding-left: 25px;
	}
	.arw-2{
	    background: rgb(177, 81, 81);
	    padding: 10px;
	    display: flex;
	    justify-content: space-between;
	    color: #fff;
	    &:after{
	        content: getArw(rgb(255, 255, 255), light, right);
	        display: inline-block;
	        width: 15px;
	        height: 15px;
	    }
	}
-

### getblankicon($color: #000000, $round: true)
#### 色を設定した別窓アイコンを返します。

	

-

<a id="anchor7"></a>
## pug編
### imgsrcset({src: $String, [alt: $String, class: $String, id: $String]}, set2x=false);
#### ratina用画像を設定したimgタグを出力します。
srcのみ必須で残りは任意で指定可能です。

画像を自動で生成するわけではないので、retina用の画像をファイル名@2x.pngという名前で用意しておく必要があります。

	p
		+imgsrcset({src:"/assets/img/img_creditcard.png", alt:"クレジットカード一覧", class: "card"})
		
これをhtmlに変換すると以下のタグが出力されます

	<p>
		<img src="/assets/img/img_creditcard.png" srcset="/assets/img/img_creditcard@2x.png 2x" alt="クレジットカード一覧" class="card" />
	</p>

--
	
### picture({src: $String, [alt: $String, class: $String, id: $String]}, set3x=false, sp=true);
#### picture要素を出力します。retina対応。webp対応。
srcのみ必須で残りは任意で指定可能です。<br><span style="color:red">webpを有効にするには \_partials/_config.pugからwebpをtrueにしてください。（デフォルトはfalse）</span>

画像を自動で生成するわけではないので、
retina用の画像　ファイル名@2x.png,ファイル名@3x.png
SP用画像　ファイル名--sp@2x.png,ファイル名--sp@3x.png
などルールに沿った命名でファイルを用意する必要があります。

	+picture({src:"/assets/img/img_creditcard.png", alt:"クレジットカード一覧", class: "card"})
		
これをhtmlに変換すると以下のタグが出力されます

	<picture>
		<source media="(min-width: 769px)" src="/assets/img/img_creditcard.png" srcset="/assets/img/img_creditcard@2x.png 2x">
		<source media="(max-width: 768px)" src="/assets/img/img_creditcard--sp.png" srcset="/assets/img/img_creditcard--sp.png 1x,/assets/img/img_creditcard--sp@2x.png 2x,/assets/img/img_creditcard--sp@3x.png 3x">
		<img class="only-pc card" src="/assets/img/img_creditcard.png" alt="クレジットカード一覧">
		<img class="only-sp card" src="/assets/img/img_creditcard--sp.png" alt="クレジットカード一覧">
	</picture>
	
webpを有効にした場合は全てファイルの拡張子が.webpへ変換されます。<br>
※最後のimgタグはIE用なので変換されません。
	
	<picture>
		<source media="(min-width: 769px)" src="/assets/img/img_creditcard.webp" srcset="/assets/img/img_creditcard@2x.webp 2x">
		<source media="(max-width: 768px)" src="/assets/img/img_creditcard--sp.webp" srcset="/assets/img/img_creditcard--sp.webp 1x,/assets/img/img_creditcard--sp@2x.webp 2x,/assets/img/img_creditcard--sp@3x.webp 3x">
		<img class="only-pc card" src="/assets/img/img_creditcard.png" alt="クレジットカード一覧">
		<img class="only-sp card" src="/assets/img/img_creditcard--sp.png" alt="クレジットカード一覧">
	</picture>

-

<a id="anchor7"></a>
## フォームバリデーション
### npm gulp runしてhttp://locahost:xxxx/validation.html
jQuery validationを使ったバリデーション機能を作りました。
郵便番号自動入力、全角英数字の自動変換、フリガナ自動入力など一通り入っています。