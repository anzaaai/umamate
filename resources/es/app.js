$(document).ready(function() {
  const $modalOverlay = $('.modal-overlay:not(.release-note-modal)');
  const $cardOverlay = $('.card-overlay');
  const $releaseNoteModal = $('.release-note-modal');
  
  setupModal();
  setupProfileCreation();
  setupImageDownload();
  setupSelectPlaceholder();

  // プロフィール作成のセットアップ
  function setupProfileCreation() {
    // Uppyの初期化
    const uppy = new Uppy.Core({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/*']
      },
      autoProceed: false,
      locale: Uppy.locales.ja_JP // 日本語ロケールを設定
    })
    .use(Uppy.Dashboard, {
      target: '#uppy-dashboard',
      inline: true,
      proudlyDisplayPoweredByUppy: false,
      plugins: ['FileInput'],
      hideUploadButton: true,
      hideRetryButton: true,
      hidePauseResumeButton: true,
      showRemoveButtonAfterComplete: false
    });

    // ファイルが追加された時の処理
    uppy.on('file-added', (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        $('.card__icon img').attr('src', e.target.result);
      };
      reader.readAsDataURL(file.data);
    });

    // ファイルが削除された時の処理
    uppy.on('file-removed', (file) => {
      $('.card__icon img').attr('src', '/assets/img/icon_sample.svg');
    });

    $('.submit-btn').on('click', function() {
      const formData = getFormData();
      if (!validateForm(formData)) return;
      updateCard(formData);
      $modalOverlay.addClass('-hidden');
      $cardOverlay.removeClass('-hidden');
    });

    function getFormData() {
      return {
        name: $('.form__name').val(),
        xId: $('.form__x-id').val(),
        oshiUmaName: $('.form__oshi-uma-name').val(),
        bestRace: $('.form__best-race').val(),
        favoriteJockey: $('.form__favorite-jockey').val(),
        keibaHistory: $('.form__keiba-history').val(),
        homeRacecourse: $('.form__home-racecourse').val(),
        mainField: $('.form__main-field').val(),
        hobby: $('.form__hobby').val()
      };
    }

    function validateForm(formData) {
      const messageMap = {
        'name': 'お名前',
        'xId': 'X(旧Twitter)ID',
        'oshiUmaName': 'マイ推し馬',
        'bestRace': '最高のレース',
        'favoriteJockey': '推し騎手',
        'keibaHistory': '競馬歴',
        'homeRacecourse': 'ホーム競馬場',
        'mainField': '主戦場',
        'hobby': '競馬以外の趣味',
      };
    
      for (const key in formData) {
        if (formData[key] === '') {
          alert(`${messageMap[key]}を入力してください。`);
          return false;
        }
        if (formData[key].length > 10 && key !== 'xId') { // xId以外の項目を10文字制限
          alert(`${messageMap[key]}は10文字以内で入力してください。`);
          return false;
        }
        if (key === 'xId' && formData[key].length > 15) { // xIdを15文字制限
          alert(`${messageMap[key]}は15文字以内で入力してください。`);
          return false;
        }
      }
      return true;
    }

    function updateCard(formData) {
      $('.card__name').text(formData.name);
      $('.card__x').text('@' + formData.xId);
      $('.card__oshiuma-name').html(formData.oshiUmaName);
      $('.card__column-desc').eq(0).text(formData.bestRace);
      $('.card__column-desc').eq(1).text(formData.favoriteJockey);
      $('.card__column-desc').eq(2).text(formData.keibaHistory);
      $('.card__column-desc').eq(3).text(formData.homeRacecourse);
      $('.card__column-desc').eq(4).text(formData.mainField);
      $('.card__column-desc').eq(5).text(formData.hobby);

      $('.card-modal .card__name').text(formData.name);
      $('.card-modal .card__x').text('@' + formData.xId);
      $('.card-modal .card__oshiuma-name').html(formData.oshiUmaName);
      $('.card-modal .card__column-desc').eq(0).text(formData.bestRace);
      $('.card-modal .card__column-desc').eq(1).text(formData.favoriteJockey);
      $('.card-modal .card__column-desc').eq(2).text(formData.keibaHistory);
      $('.card-modal .card__column-desc').eq(3).text(formData.homeRacecourse);
      $('.card-modal .card__column-desc').eq(4).text(formData.mainField);
      $('.card-modal .card__column-desc').eq(5).text(formData.hobby);
    }
  }

  // モーダル関連のセットアップ
  function setupModal() {
    $('.title__btn').on('click', () => $modalOverlay.removeClass('-hidden'));
    $('.close-btn:not(.release-note-close-btn), .modal-overlay:not(.release-note-modal)').on('click', function(event) { // セレクタを修正
      if (event.target === this) {
        $modalOverlay.addClass('-hidden');
        $cardOverlay.addClass('-hidden');
      }
    });
  }

  // リリースノートモーダル
  $('.release-note-btn').on('click', function(e) {
    e.preventDefault();
    $releaseNoteModal.removeClass('-hidden');
  });

  $('.close-btn').on('click', function(event) {
    $releaseNoteModal.addClass('-hidden');
  });

  // リリースノートモーダル外をクリックで閉じる処理
  $releaseNoteModal.on('click', function(event) {
    if (event.target === this) {
      $releaseNoteModal.addClass('-hidden');
    }
  });

  // 他のモーダル
  $('.close-btn, .modal-overlay').on('click', function(event) {
    if (event.target === this) {
      $('.modal-overlay, .card-overlay').addClass('-hidden'); // 他のモーダルを閉じる
    }
  });
  // 画像ダウンロードのセットアップ
  function setupImageDownload() {
    $('.card__download-btn').on('click', function() {
      const $cardWrapper = $('.card__wrapper')[0];
      htmlToImage.toPng($cardWrapper)
        .then(dataUrl => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'umamate_profile_card.png';
          link.click();
        })
        .catch(error => console.error('エラー:', error));
    });
  }

  // select要素のプレースホルダーのセットアップ
  function setupSelectPlaceholder() {
    function updateSelectColor($select) {
      $select.css('color', $select.val() === '' ? 'rgba(38, 36, 16, 0.4)' : 'rgba(38, 36, 16, 1)');
    }

    $('select').each(function() {
      // 初期化時に実行
      updateSelectColor($(this));

      // 値が変更された時に実行
      $(this).on('change', function() {
        updateSelectColor($(this));
      });
    });
  }
});

const skinSelect = document.querySelector('.card__skin');
const card = document.querySelector('.card__wrapper');

// ローカルストレージからスキンを復元
const savedSkin = localStorage.getItem('cardSkin');
if (savedSkin) {
    card.dataset.skin = savedSkin;
    skinSelect.value = savedSkin;
}

// スキンが選択されたら、data-skin属性とローカルストレージを更新
skinSelect.addEventListener('change', (event) => {
    const selectedSkin = event.target.value;
    card.dataset.skin = selectedSkin;
    localStorage.setItem('cardSkin', selectedSkin);
});