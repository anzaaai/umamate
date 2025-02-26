$(document).ready(function() {
  // モーダル関連
  const $modalOverlay = $('.modal-overlay');
  const $profileForm = $('.profile-form');
  const $cardOverlay = $('.card-overlay'); // カード表示用オーバーレイ

  $('.title__btn').on('click', () => $modalOverlay.removeClass('-hidden'));

  $('.close-btn, .modal-overlay').on('click', function(event) {
    if (event.target === this) {
      $modalOverlay.addClass('-hidden');
      $cardOverlay.addClass('-hidden'); // カード表示用オーバーレイも閉じる
    }
  });

  // プロフィール作成
  $('.submit-btn').on('click', function() {
    const formData = {
      name: $('.form__name').val(),
      xId: $('.form__x-id').val(),
      description: $('.form__desc').val(),
      oshiUmaName: $('.form__oshi-uma-name').val(),
      oshiUmaDesc: $('.form__oshi-uma-desc').val(),
      bestRace: $('.form__best-race').val(),
      favoriteJockey: $('.form__favorite-jockey').val(),
      keibaHistory: $('.form__keiba-history').val(),
      turfDirt: $('.form__turf-dirt').val(),
      homeRacecourse: $('.form__home-racecourse').val(),
      mainField: $('.form__main-field').val(),
      horseOwner: $('.form__horse-owner').val(),
      hobby: $('.form__hobby').val()
    };

    $('.card__name').text(formData.name);
    $('.card__x').text('@' + formData.xId);
    $('.card__desc').text(formData.description);
    $('.card__oshiuma-name').html(formData.oshiUmaName + '✨<span class="card__oshiuma-desc">' + formData.oshiUmaDesc + '</span>');
    $('.card__column-desc').eq(0).text(formData.bestRace);
    $('.card__column-desc').eq(1).text(formData.favoriteJockey);
    $('.card__column-desc').eq(2).text(formData.keibaHistory);
    $('.card__column-desc').eq(3).text(formData.turfDirt);
    $('.card__column-desc').eq(4).text(formData.homeRacecourse);
    $('.card__column-desc').eq(5).text(formData.mainField);
    $('.card__column-desc').eq(6).text(formData.horseOwner);
    $('.card__column-desc').eq(7).text(formData.hobby);

    // カード表示用オーバーレイのカード内容を更新
    $('.card-modal .card__name').text(formData.name);
    $('.card-modal .card__x').text('@' + formData.xId);
    $('.card-modal .card__desc').text(formData.description);
    $('.card-modal .card__oshiuma-name').html(formData.oshiUmaName + '✨<span class="card__oshiuma-desc">' + formData.oshiUmaDesc + '</span>');
    $('.card-modal .card__column-desc').eq(0).text(formData.bestRace);
    $('.card-modal .card__column-desc').eq(1).text(formData.favoriteJockey);
    $('.card-modal .card__column-desc').eq(2).text(formData.keibaHistory);
    $('.card-modal .card__column-desc').eq(3).text(formData.turfDirt);
    $('.card-modal .card__column-desc').eq(4).text(formData.homeRacecourse);
    $('.card-modal .card__column-desc').eq(5).text(formData.mainField);
    $('.card-modal .card__column-desc').eq(6).text(formData.horseOwner);
    $('.card-modal .card__column-desc').eq(7).text(formData.hobby);

    $modalOverlay.addClass('-hidden');
    $cardOverlay.removeClass('-hidden'); // カード表示用オーバーレイを表示
  });

  // 画像ダウンロード (html-to-image)
  $('.card__download-btn').on('click', function() {
    const $cardWrapper = $('.card__wrapper');
    htmlToImage.toPng($cardWrapper[0])
      .then(dataUrl => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'profile_card_htmltoimage.png';
        link.click();
      })
      .catch(error => console.error('html-to-imageエラー:', error));
  });


  // select要素のプレースホルダー処理
  function updateSelectColor($select) {
    $select.css('color', $select.val() === '' ? 'rgba(38, 36, 16, 0.4)' : 'rgba(38, 36, 16, 1)');
  }

  $('select').each(function() {
    updateSelectColor($(this));
  }).on('change', function() {
    updateSelectColor($(this));
  });
});

// X API クライアントの初期化
const client = new TwitterApiSdk.Client({
  apiKey: 'OlGIxs7LkmviaD1GFUuntow2G',
  apiSecret: 'PUM1whD8sZtzWDpzxmSZ3PVcvi6l3P2dPwJfflD5irVPQKr9jW',
  accessToken: '17500409-GFQIUJqYVXrK64dcQOTR46k971yw5yYnQGLo2k260',
  accessTokenSecret: 'SxDz8Hdo49x9K52t3AXMsWZ1QjXkxDddZZWJw3HpUI5Qm',
});

// 画像アップロードとツイート投稿
async function shareOnTwitter(cardElement) {
  try {
    // html-to-image で画像を Blob 形式で取得
    const blob = await htmlToImage.toBlob(cardElement);
    const file = new File([blob], 'profile_card.png', { type: 'image/png' });

    // メディアのアップロード
    const mediaResponse = await client.tweets.uploadMedia({
      media: file,
    });
    const mediaId = mediaResponse.media_id_string;

    // ツイートの投稿
    const tweetResponse = await client.tweets.createTweet({
      text: '競馬好きプロフィールメーカー「umamate」でプロフィールを作成！',
      media: { media_ids: [mediaId] },
    });

    console.log('ツイートが投稿されました:', tweetResponse);
  } catch (error) {
    console.error('X API エラー:', error);
    alert('ツイートの投稿に失敗しました。'); // エラーメッセージをユーザーに表示
  }
}

// ボタンクリック時の処理
$('.card__share-btn').on('click', function() {
  const $cardWrapper = $('.card__wrapper')[0];
  shareOnTwitter($cardWrapper);
});