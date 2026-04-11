// === DOCUMENTACIÓN TÉCNICA — Tab switching ===
(function () {
  'use strict';

  var tabs = document.querySelectorAll('.dt-tab:not([disabled])');
  var panels = document.querySelectorAll('.dt-panel');

  if (!tabs.length) return;

  function switchDoc(docId) {
    panels.forEach(function (p) { p.classList.add('dt-panel--hidden'); });
    var target = document.getElementById('doc-' + docId);
    if (target) target.classList.remove('dt-panel--hidden');

    tabs.forEach(function (t) { t.classList.remove('dt-tab--active'); });
    var btn = document.querySelector('.dt-tab[data-doc="' + docId + '"]');
    if (btn) btn.classList.add('dt-tab--active');
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      switchDoc(tab.dataset.doc);
    });
  });

  // === Swiper — M365 comparison tables ===
  if (typeof Swiper !== 'undefined' && document.querySelector('.m365t-swiper')) {
    new Swiper('.m365t-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '.m365t-swiper .swiper-button-next',
        prevEl: '.m365t-swiper .swiper-button-prev'
      },
      pagination: {
        el: '.m365t-swiper .swiper-pagination',
        clickable: true
      }
    });
  }
})();
