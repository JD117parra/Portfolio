// === DOCUMENTACIÓN TÉCNICA — Sidebar navigation ===
(function () {
  'use strict';

  const sidebarItems = document.querySelectorAll('.sidebar-item:not([disabled])');
  const panels = document.querySelectorAll('.dt-panel');

  if (!sidebarItems.length) return;

  function switchDoc(docId) {
    // Ocultar todos los paneles
    panels.forEach(function (p) { p.classList.add('dt-panel--hidden'); });
    const target = document.getElementById('doc-' + docId);
    if (target) target.classList.remove('dt-panel--hidden');

    // Actualizar sidebar activa
    sidebarItems.forEach(function (s) { s.classList.remove('sidebar-item--active'); });
    const btn = document.querySelector('.sidebar-item[data-doc="' + docId + '"]');
    if (btn) btn.classList.add('sidebar-item--active');
  }

  sidebarItems.forEach(function (item) {
    item.addEventListener('click', function () {
      switchDoc(item.dataset.doc);
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
