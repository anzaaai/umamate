'use strict';
// select2設定
$('[js-select2]').select2({
    minimumResultsForSearch: -1,
    allowClear: true,
    dropdownAutoWidth: true,
    width: 'resolve',
}).on('select2:select', function(){
    //ajaxzip3対策
    $(this).trigger('change');
}).on('select2:close', function(){
    //バリデーション対策
    $(this).trigger('change');
    $(this).trigger('blur');
});

// バリデーションエラーメッセージ設定
$.extend( $.validator.messages, {
    required: "入力してください",
    remote: "このフィールドを修正してください。",
    email: "有効なEメールアドレスを入力してください。",
    url: "有効なURLを入力してください。",
    date: "有効な日付を入力してください。",
    dateISO: "有効な日付（ISO）を入力してください。",
    number: "有効な数字を入力してください。",
    digits: "数字のみを入力してください。",
    creditcard: "有効なクレジットカード番号を入力してください。",
    equalTo: "同じ値をもう一度入力してください。",
    extension: "有効な拡張子を含む値を入力してください。",
    maxlength: $.validator.format( "{0} 文字以内で入力してください。" ),
    minlength: $.validator.format( "{0} 文字以上で入力してください。" ),
    rangelength: $.validator.format( "{0} 文字から {1} 文字までの値を入力してください。" ),
    range: $.validator.format( "{0} から {1} までの値を入力してください。" ),
    step: $.validator.format( "{0} の倍数を入力してください。" ),
    max: $.validator.format( "{0} 以下の値を入力してください。" ),
    min: $.validator.format( "{0} 以上の値を入力してください。" ),
    accept: "アップロードできるファイルはWord、Excel、PDFのみです。",
    filesize: $.validator.format( "アップロード可能なファイルサイズは{0} MBまでです。" ),
} );

/* 追加バリデーションルール */

//カタカナ入力
$.validator.addMethod("katakana", function(value, element) {
    return this.optional(element) || /^([ァ-ヶー 　]+)$/.test(value);
    }, "全角カタカナで入力してください"
);

// ファイルアップロードチェック（アップロードしたファイルのサイズや拡張子をチェック）
$.validator.addMethod("filesize", function(value, element, param) {
    param = param * 1048576;//byteへ変換
    if ( $( element ).attr( "type" ) === "file" ) {
        // Check if the element has a FileList before checking each file
        if ( element.files && element.files.length ) {
            for ( var i = 0; i < element.files.length; i++ ) {
                var file = element.files[ i ];
                // Grab the mimetype from the loaded file, verify it matches
                if ( file.size >  param) {
                    return false;
                }
            }
        }
    }
    return true;
});

//selectボックスの必須チェック
$.validator.addMethod("selectrequired", function(value, element){
    return value !== '';
}, $.validator.messages.required);

/* 追加バリデーションルールここまで */


// FormSettings
$.fn.setUpForm = function(){
new $.setUpSpiralForm(this);
}
$.setUpSpiralForm = function(form){
var self = this;
this.constructor(form);
};
$.setUpSpiralForm.prototype = {
    constructor: function(form){
        var self = this;
        self.$form = form;
        self.setForm();
        self.setValidation();
    },
    //フォーム初期設定
    setForm: function(){
        var self = this;
        //　送信ボタンが有効になったら動作
        self.$form.on('change', '*[type=submit]', function(){
        //送信ボタンのdisabled切替
            if($(this).prop('disabled')){
                $(this).val($(this).data('disabled'));
                $(this).text($(this).data('disabled'));
            }else{
                $(this).val($(this).data('send'));
                $(this).text($(this).data('send'));
            }
        })
        .on('click', '*[type=submit]', function(){
            // フォーム送信時に画面遷移アラートを解除
            $(window).off('beforeunload');
        })
        .on('change', 'input[type=file]', function(){//safari対策
            $(this).valid().blur();
        });

        // 各種入力補助の設定
        self.setAuxinput();
    },
    // バリデーションルールを設定
    setValidation: function(){
        var self = this;
        var rules = {};
        var data;
        var $required_field;
        var $required_list = $();

        //form上のバリデーション項目を抽出する
        self.$form.find('[js-validate]').each(function(){
            
            let elem = $(this).attr('name');
            rules[elem] = {};
            //必須項目
            if($(this).prop('required')) {
                $required_list = $required_list.add(this);
                //バリデーションルールを設定　※selectとtextarea,inputだと処理が異なるので別メソッドになる
                if($(this)[0].tagName == 'SELECT') {
                    rules[elem]['selectrequired'] = true;
                }else {
                    rules[elem]['required'] = true;
                }
            }
            //js-validateにルールが指定されている場合ルールを設定
            if($(this).attr('js-validate') && $(this).attr('js-validate') !== 'js-validate') {
                let name = $(this).attr('js-validate').split(',');
                for(let i = 0; i < name.length ; i++){
                    let ruleary = name[i].split(':');
                    if(ruleary.length > 1) {
                        let val = ruleary[1].split('|');
                        if(val.length > 1) {
                            rules[elem][ruleary[0]] = val;
                        }else {
                            rules[elem][ruleary[0]] = ruleary[1];
                        }
                    }else{
                        rules[elem][ruleary[0]] = true;
                    }
                }
            }
        });

        //ファイルアップロード
        //form上のtype=fileを抽出する
        var filetype = 'application/pdf,application/msword,application/excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        self.$form.find('input[type=file]').each(function(){
            if(typeof rules[$(this).attr('name')] == 'undefined'){
                rules[$(this).attr('name')] = {};
                rules[$(this).attr('name')]['file'] = {'accept': filetype, 'filesize': 10};
            }else{
                rules[$(this).attr('name')]['file'] = {'accept': filetype, 'filesize': 10};
            }
        });

        // エラーチェック
        self.$form.on('chkerr', function(){
        //必須項目をエラー無しで全て入力したら送信ボタンのdisabledを解除する
            var flg = false;
            $required_list.each(function(){
                if($(this).hasClass('input--error') || $(this).val() === ''){
                    flg = true;
                    return false;
                //チェックボックス
                }else if($(this).attr('type') == 'checkbox' && $('[name=' + $(this).attr('name') + ']:checked').length == 0){
                    flg = true;
                    return false;
                //ラジオボタン
                }else if($(this).attr('type') == 'radio' && $('[name=' + $(this).attr('name') + ']:checked').length == 0){
                    flg = true;
                    return false;
                }
            });

            self.$form.find('[type=submit]').attr('disabled', flg).trigger('change');

            
        }).on('reseterror', '.input--error', function(){
            //エラーをリセット
            $(this).removeClass('input--error').find('input,select,textarea').removeClass('input--error');
        }).on('click', 'input[type="radio"],input[type="checkbox"]', function(){
            //必須項目のラジオボタンやチェックボタンは押したタイミングでバリデーションを行う
            if($(this).prop('required')){
                self.$form.trigger('chkerr');
            }
        })
        .trigger('chkerr');//初回エラーチェック（history.back()対策）

        //設定したバリデーションルールをjQuery Validationへ適用
        self.val = self.$form.validate({
            //'debug': true,
            'onsubmit': function(){
                self.$form.valid();
            },
            'onkeyup': false,// 入力中はバリデーションしない（自動変換などある為）
            // focusout時
            'onfocusout': function(elem){
                // エラーが設定されていれば一旦解除
                $(elem).parents('.input--error').trigger('reseterror');
                //focusoutのタイミングで入力補助側で変換が行われる為バリデーションを一瞬遅らせる
                setTimeout(function(){
                    if($(elem).valid()){//バリデーション
                        $(elem).parents().trigger('reseterror');
                    };
                }, 100);
            },
            'rules' : rules,// バリデーションルール
            // エラー時のcallback
            'showErrors': function(errorMap, errorList) {
                this.defaultShowErrors();
                self.$form.trigger('chkerr');
            },
            'errorClass': 'input--error',// バリデーションエラー時に付与されるclass名
            'errorElement': 'span',// バリデーションエラーのタグ
            // 各バリデーションエラーの表示位置設定
            'errorPlacement': function(error, element) {
                // 親タグにもinput--errorを付与する
                $(element).parent().addClass('input--error');
                if($(element).attr('error-label')){
                    $('[data-error=' + $(element).attr('error-label') + '-error]').html(error);
                }else{
                    $('[data-error=' + error.prop('id') + ']').html(error);
                }

                // 一定時間でエラーフェードアウトさせる
                // setTimeout(function(){
                //     $(error).fadeOut(function(){
                //         $(this).remove();
                //     });
                // }, 4000);
            }
        });

        // 画面遷移時のアラート
        $(window).on('beforeunload', function(e) {
            return 'このページから移動しますか？ 入力したデータは保存されません。';
        });

    },
    // 入力補助色々
    setAuxinput: function(){
        var self = this;
        
        //郵便番号検索
        self.$form.on('keyup', '[js-ajaxzip]', function(){
            const fields = $(this).data('field').split(',');
            AjaxZip3.zip2addr(this,'', fields[0], fields[1]);
            setTimeout(function(){
                $('[name="'+ fields[0] +'"]').trigger('change');
            }, 100);
        });

        //フリガナ自動変換
        self.$form.find('[js-autoKana]').each(function(){
            const fields = $(this).data('field');
            $.fn.autoKana(this, '[name="'+ fields +'"]', { katakana: true });
        });

        // //ひらがなをカタカナへ変換
        // if('katakana' in field['rule']){
        //     var convHiraKana = function () {
        //         var val = $(this).val();
        //         val = val.replace(/[\u3041-\u3096]/g, function(match) {
        //             var chr = match.charCodeAt(0) + 0x60;
        //             return String.fromCharCode(chr);
        //         });
        //         $(this).val(val);
        //     }
        //     $field.on('blur', convHiraKana);
        // }

        // 全角英数字を半角へ変換（ついでにスペースもトルツメ）
        self.$form.on('blur', '[js-zenhan]', function () {
            let val = $(this).val();
            //スペース等を全て削除
            val = val.trim();
            val = val.replace(/\s+/g, "");
            val = val.replace(/[！-～]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            $(this).val(val);
        });

    },
}

// 全てのformに対してセット
$('form').setUpForm();
