// === DOCUMENTACIÓN TÉCNICA — Sidebar navigation + Lazy-loaded panels ===
(function () {
  'use strict';

  // === SIDEBAR NAVIGATION ===
  var sidebarItems = document.querySelectorAll('.sidebar-item:not([disabled])');
  if (!sidebarItems.length) return;

  // Cache de paneles cargados: 'azure-data' ya está inline
  var loaded = { 'azure-data': true };

  // Registry de funciones init por panel
  var PANEL_INIT = {
    'azure-data':      initExpandableCards,
    'azure-rbac':      initExpandableCards,
    'azure-shared':    initExpandableCards,
    'azure-arch':      initLoadBalancer,
    'm365-comparador': initComparador,
    'm365-guide':      initM365Guide,
    'pp-guide':        initPPGuide,
    'azure-compare':   initAzureCompare
  };

  function switchDoc(docId) {
    // Ocultar todos los slots
    document.querySelectorAll('.dt-panel-slot').forEach(function (s) {
      s.classList.add('dt-panel--hidden');
    });

    // Actualizar sidebar
    sidebarItems.forEach(function (s) { s.classList.remove('sidebar-item--active'); });
    var btn = document.querySelector('.sidebar-item[data-doc="' + docId + '"]');
    if (btn) btn.classList.add('sidebar-item--active');

    var slot = document.getElementById('slot-' + docId);
    if (!slot) return;
    slot.classList.remove('dt-panel--hidden');

    // Cargar partial si no se ha cargado
    if (!loaded[docId]) {
      loaded[docId] = 'loading';
      fetch(slot.getAttribute('data-partial'))
        .then(function (res) { return res.text(); })
        .then(function (html) {
          slot.innerHTML = html;
          loaded[docId] = true;
          // Quitar clase hidden del panel interior
          var innerPanel = slot.querySelector('.dt-panel');
          if (innerPanel) innerPanel.classList.remove('dt-panel--hidden');
          var initFn = PANEL_INIT[docId];
          if (initFn) initFn(slot);
        })
        .catch(function () {
          loaded[docId] = false;
          slot.innerHTML = '<div class="dt-panel-loader" style="color:#f472b6"><i class="fas fa-exclamation-triangle"></i> Error al cargar el contenido.</div>';
        });
    }
  }

  sidebarItems.forEach(function (item) {
    item.addEventListener('click', function () {
      switchDoc(item.dataset.doc);
    });
  });

  // === INIT: EXPANDABLE CARDS (accordion — one at a time) ===
  function initExpandableCards(container) {
    var expandableCards = container.querySelectorAll('.dt-card[data-expandable]');
    expandableCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var wasExpanded = card.classList.contains('dt-card--expanded');

        // Close all other cards in this container
        expandableCards.forEach(function (other) {
          if (other !== card && other.classList.contains('dt-card--expanded')) {
            other.classList.remove('dt-card--expanded');
            var otherLabel = other.querySelector('.dt-card__toggle');
            if (otherLabel) otherLabel.lastChild.textContent = ' Ver detalles';
          }
        });

        // Toggle clicked card
        card.classList.toggle('dt-card--expanded', !wasExpanded);
        var label = card.querySelector('.dt-card__toggle');
        if (label) {
          label.lastChild.textContent = !wasExpanded ? ' Ocultar detalles' : ' Ver detalles';
        }
      });
    });
  }

  // === INIT: M365 GUIDE (column toggles + feature descriptions + swiper) ===
  function initM365Guide(container) {
    var M365_PLANS = [
      { key: 'F1', label: 'F1', color: '#38bdf8' },
      { key: 'F3', label: 'F3', color: '#34d399' },
      { key: 'BB', label: 'Business Basic', color: '#94a3b8' },
      { key: 'BS', label: 'Business Standard', color: '#60a5fa' },
      { key: 'BP', label: 'Business Premium', color: '#c084fc' },
      { key: 'E3', label: 'E3', color: '#fb923c' },
      { key: 'E5', label: 'E5', color: '#f472b6' }
    ];

    var m365Panel = container.querySelector('.dt-panel') || container;
    var toggleContainer = container.querySelector('#m365tToggles') || document.getElementById('m365tToggles');

    if (toggleContainer && m365Panel) {
      M365_PLANS.forEach(function (plan) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tbl-col-toggle tbl-col-toggle--active';
        btn.dataset.plan = plan.key;
        btn.innerHTML = '<span class="tbl-col-toggle__dot" style="background:' + plan.color + '"></span>' + plan.label;

        btn.addEventListener('click', function () {
          var isActive = this.classList.toggle('tbl-col-toggle--active');
          if (isActive) {
            m365Panel.classList.remove('m365t-hide-' + plan.key);
          } else {
            m365Panel.classList.add('m365t-hide-' + plan.key);
          }
          updateSubheaderColspans();
        });

        toggleContainer.appendChild(btn);
      });

      function updateSubheaderColspans() {
        var visibleCount = 1 + toggleContainer.querySelectorAll('.tbl-col-toggle--active').length;
        m365Panel.querySelectorAll('.m365t-subheader td[colspan]').forEach(function (td) {
          td.setAttribute('colspan', visibleCount);
        });
      }
    }

    // Feature descriptions
    fetch('data/feature-descriptions.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        initFeatureDescriptions(m365Panel, data.featureDescriptions, data.defenderIncluded);
      });

    // Swiper
    if (typeof Swiper !== 'undefined') {
      var swiperEl = container.querySelector('.m365t-swiper');
      if (swiperEl) {
        new Swiper(swiperEl, {
          slidesPerView: 1,
          spaceBetween: 24,
          navigation: {
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev')
          },
          pagination: {
            el: swiperEl.querySelector('.swiper-pagination'),
            clickable: true
          }
        });
      }
    }
  }

  function initFeatureDescriptions(m365Panel, FEATURE_DESC, DEFENDER_INCLUDED) {
    var tables = m365Panel ? m365Panel.querySelectorAll('.m365t-table') : [];
    tables.forEach(function (table) {
      // Walk all rows including subheaders to track context
      var currentSubheader = '';
      var allRows = table.querySelectorAll('tbody tr');
      allRows.forEach(function (row) {
        if (row.classList.contains('m365t-subheader')) {
          currentSubheader = row.textContent.trim();
          return;
        }

        var firstTd = row.querySelector('td:first-child');
        if (!firstTd) return;

        var featureName = firstTd.textContent.trim();
        var desc = FEATURE_DESC[featureName];

        // Handle generic "Plan incluido" / "Incluido" names using subheader context
        if (!desc && (featureName === 'Plan incluido' || featureName === 'Incluido')) {
          desc = DEFENDER_INCLUDED[currentSubheader] || null;
        }

        if (!desc) return;

        // Add info button
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'm365t-info-btn';
        btn.setAttribute('aria-label', 'Ver descripción');
        btn.innerHTML = '<i class="fas fa-info-circle"></i>';

        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var parentRow = this.closest('tr');
          var existing = parentRow.nextElementSibling;

          // Close if already open
          if (existing && existing.classList.contains('m365t-desc-row')) {
            existing.classList.remove('m365t-desc-row--open');
            setTimeout(function () { existing.remove(); }, 250);
            btn.classList.remove('m365t-info-btn--active');
            return;
          }

          // Close any other open description in this table
          var openRows = table.querySelectorAll('.m365t-desc-row');
          openRows.forEach(function (r) {
            r.classList.remove('m365t-desc-row--open');
            setTimeout(function () { r.remove(); }, 250);
          });
          table.querySelectorAll('.m365t-info-btn--active').forEach(function (b) {
            b.classList.remove('m365t-info-btn--active');
          });

          // Create description row
          var colCount = parentRow.querySelectorAll('td').length;
          var descRow = document.createElement('tr');
          descRow.className = 'm365t-desc-row';
          var descTd = document.createElement('td');
          descTd.colSpan = colCount;
          descTd.className = 'm365t-desc-cell';
          descTd.innerHTML = '<i class="fas fa-lightbulb m365t-desc-icon"></i> ' + desc;
          descRow.appendChild(descTd);

          parentRow.after(descRow);
          btn.classList.add('m365t-info-btn--active');

          // Trigger animation
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              descRow.classList.add('m365t-desc-row--open');
            });
          });
        });

        firstTd.appendChild(btn);
      });
    });
  }

  // === INIT: POWER PLATFORM GUIDE (feature descriptions + swiper) ===
  function initPPGuide(container) {
    var ppPanel = container.querySelector('.dt-panel') || container;

    // Feature descriptions
    fetch('data/pp-feature-descriptions.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        initFeatureDescriptions(ppPanel, data.featureDescriptions, {});
      });

    // Swiper
    if (typeof Swiper !== 'undefined') {
      var swiperEl = container.querySelector('.m365t-swiper');
      if (swiperEl) {
        new Swiper(swiperEl, {
          slidesPerView: 1,
          spaceBetween: 24,
          navigation: {
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev')
          },
          pagination: {
            el: swiperEl.querySelector('.swiper-pagination'),
            clickable: true
          }
        });
      }
    }
  }

  // === INIT: AZURE COMPARE (feature descriptions + swiper) ===
  function initAzureCompare(container) {
    var azPanel = container.querySelector('.dt-panel') || container;

    // Feature descriptions
    fetch('data/azure-feature-descriptions.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        initFeatureDescriptions(azPanel, data.featureDescriptions, {});
      });

    // Swiper
    if (typeof Swiper !== 'undefined') {
      var swiperEl = container.querySelector('.m365t-swiper');
      if (swiperEl) {
        new Swiper(swiperEl, {
          slidesPerView: 1,
          spaceBetween: 24,
          navigation: {
            nextEl: swiperEl.querySelector('.swiper-button-next'),
            prevEl: swiperEl.querySelector('.swiper-button-prev')
          },
          pagination: {
            el: swiperEl.querySelector('.swiper-pagination'),
            clickable: true
          }
        });
      }
    }
  }

  // === INIT: COMPARADOR DE LICENCIAS M365 ===
  function initComparador(container) {
    var cmpQuestion = container.querySelector('#cmpQuestion') || document.getElementById('cmpQuestion');
    if (!cmpQuestion) return;

    var QUESTIONS = [
      {
        id: 'q1_size',
        text: '¿Cuántos usuarios tiene la organización?',
        options: [
          { label: '1 – 10 usuarios',     value: 'micro',  icon: 'fa-user' },
          { label: '11 – 50 usuarios',    value: 'small',  icon: 'fa-user-friends' },
          { label: '51 – 300 usuarios',   value: 'medium', icon: 'fa-users' },
          { label: 'Más de 300 usuarios', value: 'large',  icon: 'fa-city' }
        ]
      },
      {
        id: 'q2_desktop',
        text: '¿Los usuarios necesitan Office instalado en su PC o Mac?',
        options: [
          { label: 'Sí, todos necesitan Office instalado',  value: 'yes',      icon: 'fa-laptop' },
          { label: 'No, solo usan la versión web y móvil', value: 'web_only', icon: 'fa-globe' },
          { label: 'Algunos sí, otros no',                  value: 'mixed',    icon: 'fa-random' }
        ]
      },
      {
        id: 'q3_mdm',
        text: '¿Necesitas gestión centralizada de dispositivos (Intune / MDM)?',
        options: [
          { label: 'Sí, quiero controlar los equipos corporativos', value: 'yes',     icon: 'fa-lock' },
          { label: 'No es necesario por ahora',                      value: 'no',      icon: 'fa-unlock' },
          { label: 'No lo sé todavía',                               value: 'unknown', icon: 'fa-question' }
        ]
      },
      {
        id: 'q4_regulated',
        text: '¿El sector maneja datos sensibles o está regulado?',
        options: [
          { label: 'Sí — finanzas, salud, legal u otro sector regulado', value: 'yes', icon: 'fa-balance-scale' },
          { label: 'No, es una empresa estándar',                         value: 'no',  icon: 'fa-building' }
        ]
      },
      {
        id: 'q5_frontline',
        text: '¿Hay usuarios sin PC fija (campo, almacén, tienda)?',
        options: [
          { label: 'Sí, hay trabajadores de primera línea', value: 'yes', icon: 'fa-hard-hat' },
          { label: 'No, todos trabajan desde PC o Mac',      value: 'no',  icon: 'fa-desktop' }
        ]
      },
      {
        id: 'q6_compliance',
        text: '¿Necesitas cumplimiento avanzado, eDiscovery o retención legal?',
        options: [
          { label: 'Sí, para toda la organización',                     value: 'all',  icon: 'fa-shield-alt' },
          { label: 'Solo para algunos roles (legal, RRHH, dirección)',  value: 'some', icon: 'fa-user-tie' },
          { label: 'No tenemos esos requisitos',                         value: 'no',   icon: 'fa-times-circle' }
        ]
      }
    ];

    var PLANS_DATA = {
      F1:               { label: 'M365 F1',           color: '#38bdf8', tag: 'Primera línea' },
      F3:               { label: 'M365 F3',           color: '#34d399', tag: 'Primera línea' },
      BusinessBasic:    { label: 'Business Basic',    color: '#94a3b8', tag: 'PYME · hasta 300 usuarios' },
      BusinessStandard: { label: 'Business Standard', color: '#60a5fa', tag: 'PYME · hasta 300 usuarios' },
      BusinessPremium:  { label: 'Business Premium',  color: '#c084fc', tag: 'PYME · hasta 300 usuarios' },
      E3:               { label: 'M365 E3',           color: '#fb923c', tag: 'Enterprise' },
      E5:               { label: 'M365 E5',           color: '#f472b6', tag: 'Enterprise' }
    };

    var RECOMMENDATIONS = {
      E5: {
        subtitle: 'Cumplimiento avanzado y seguridad de nivel enterprise para toda la organización',
        why: 'E5 es el plan más completo de Microsoft 365. Incluye Defender for Office 365 Plan 2, Microsoft Entra ID P2 (PIM, Identity Protection), eDiscovery Premium y Microsoft Purview completo. Es el plan indicado cuando la organización requiere cumplimiento avanzado en toda su estructura.',
        whyNot: 'E3 no incluye Defender Plan 2 ni Entra ID P2 de forma nativa. Los planes Business están limitados a 300 usuarios y no incluyen las herramientas de cumplimiento avanzado que E5 provee.'
      },
      E3: {
        subtitle: 'Enterprise sin límite de usuarios, con Intune y Entra ID P1 incluidos',
        why: 'E3 es el plan Enterprise de referencia. Incluye Office instalado en 5 dispositivos, Exchange Online con buzón de 100 GB y archivo ilimitado, Intune para gestión de dispositivos, Entra ID P1 (acceso condicional) y eDiscovery estándar.',
        whyNot: 'Los planes Business tienen un tope de 300 licencias. E5 agrega Defender Plan 2 y Entra ID P2, pero solo se justifica cuando se requieren sus capacidades específicas de cumplimiento avanzado.',
        addon: { label: 'Defender for Office 365 Plan 1', icon: 'fa-shield-alt', why: 'E3 no incluye Defender for Office 365 de forma nativa — requiere add-on. Para sectores regulados es prácticamente obligatorio: cubre Safe Links, Safe Attachments y protección avanzada contra phishing.' }
      },
      BusinessPremium: {
        subtitle: 'El plan más completo para PYMEs: Intune + Defender P1 + Entra ID P1 incluidos',
        why: 'Business Premium incluye todo lo de Business Standard más Microsoft Intune, Entra ID P1 (acceso condicional, MFA avanzado) y Defender for Office 365 Plan 1. Es el plan más elegido para sectores regulados dentro del límite de 300 usuarios.',
        whyNot: 'Business Standard no incluye Intune ni Defender for Office 365 Plan 1, lo que lo hace insuficiente para sectores regulados. E3 ofrece capacidades similares pero sin el tope de 300 usuarios y con Exchange Plan 2 incluido.'
      },
      BusinessStandard: {
        subtitle: 'Office instalado + colaboración completa sin necesidad de MDM',
        why: 'Business Standard incluye Office instalado en hasta 5 dispositivos por usuario, Teams, SharePoint, Exchange Online con 50 GB de buzón y OneDrive con 1 TB. Es el equilibrio entre funcionalidad y costo para organizaciones sin requisitos de MDM.',
        whyNot: 'Business Basic no incluye Office instalado. Business Premium agrega Intune y Defender P1 con un costo adicional que solo se justifica si hay requisitos de MDM o sector regulado.'
      },
      BusinessBasic: {
        subtitle: 'Colaboración cloud completa sin Office instalado',
        why: 'Business Basic cubre Teams, SharePoint, Exchange Online con 50 GB y OneDrive con 1 TB. Incluye las versiones web de Office, suficientes para la mayoría de tareas de oficina.',
        whyNot: 'Business Standard agrega Office instalado, necesario para archivos complejos o macros. Business Premium añade Intune y Defender P1 para organizaciones con requisitos de seguridad más estrictos.'
      },
      BusinessBasic_F1: {
        subtitle: 'Modelo mixto: M365 F1 para primera línea + Business Basic para trabajadores del conocimiento',
        why: 'Tu organización tiene dos perfiles de usuario. M365 F1 cubre a los trabajadores de primera línea (sin PC fija) con Teams y acceso móvil a un costo menor. Business Basic cubre al resto con colaboración cloud completa.',
        whyNot: 'Asignar Business Basic a toda la organización sobrelicenciaría a los trabajadores de primera línea. F3 es alternativa a F1 si esos usuarios necesitan crear documentos con Office web.'
      },
      BusinessStandard_F3: {
        subtitle: 'Modelo mixto: M365 F3 para primera línea + Business Standard para trabajadores del conocimiento',
        why: 'M365 F3 cubre a los trabajadores de primera línea con Office Web Apps completo y 1 TB en OneDrive. Business Standard cubre al resto con Office instalado y colaboración completa.',
        whyNot: 'F1 no incluye Office Web Apps completo. Asignar Business Standard a todos sería sobrelicenciar a usuarios sin PC fija.'
      }
    };

    var cmpState = {
      currentStep:    0,
      answers:        {},
      recommendation: null
    };

    var questionEl   = cmpQuestion;
    var progressFill = container.querySelector('#cmpProgressFill') || document.getElementById('cmpProgressFill');
    var progressBar  = container.querySelector('#cmpProgressBar') || document.getElementById('cmpProgressBar');
    var stepsEl      = container.querySelector('#cmpSteps') || document.getElementById('cmpSteps');
    var resultEl     = container.querySelector('#cmpResult') || document.getElementById('cmpResult');
    var planBadgeEl  = container.querySelector('#cmpPlanBadge') || document.getElementById('cmpPlanBadge');
    var planSubtitle = container.querySelector('#cmpPlanSubtitle') || document.getElementById('cmpPlanSubtitle');
    var justifEl     = container.querySelector('#cmpJustification') || document.getElementById('cmpJustification');
    var addonsEl     = container.querySelector('#cmpAddons') || document.getElementById('cmpAddons');

    function buildStepDots() {
      stepsEl.innerHTML = QUESTIONS.map(function (_, i) {
        return '<div class="cmp-step-dot" id="cmpDot' + i + '" aria-label="Paso ' + (i + 1) + '">' + (i + 1) + '</div>';
      }).join('');
    }

    function updateStepDots(active) {
      QUESTIONS.forEach(function (_, i) {
        var dot = document.getElementById('cmpDot' + i);
        dot.className = 'cmp-step-dot';
        if (i < active)   dot.classList.add('cmp-step-dot--done');
        if (i === active) dot.classList.add('cmp-step-dot--active');
      });
    }

    function updateProgress(step) {
      progressFill.style.width = (step / QUESTIONS.length * 100) + '%';
      progressBar.setAttribute('aria-valuenow', step);
    }

    function renderStep(stepIndex, direction) {
      direction = direction || 'forward';
      cmpState.currentStep = stepIndex;
      var q          = QUESTIONS[stepIndex];
      var exitClass  = direction === 'forward' ? 'cmp-question--exit-left'  : 'cmp-question--exit-right';
      var enterClass = direction === 'forward' ? 'cmp-question--enter-right' : 'cmp-question--enter-left';

      questionEl.classList.remove('cmp-question--visible');
      questionEl.classList.add(exitClass);

      setTimeout(function () {
        questionEl.innerHTML = buildQuestionHTML(q, stepIndex);
        questionEl.classList.remove(exitClass);
        questionEl.classList.add(enterClass);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            questionEl.classList.remove(enterClass);
            questionEl.classList.add('cmp-question--visible');
          });
        });
        questionEl.querySelectorAll('.cmp-option').forEach(function (btn) {
          btn.addEventListener('click', function () { handleOptionClick(q.id, this.dataset.value); });
        });
        var backBtn = questionEl.querySelector('#cmpBack');
        if (backBtn) backBtn.addEventListener('click', function () { renderStep(stepIndex - 1, 'back'); });
        updateStepDots(stepIndex);
        updateProgress(stepIndex);
      }, 220);
    }

    function buildQuestionHTML(q, stepIndex) {
      var options = q.options.map(function (opt) {
        return '<button class="cmp-option" data-value="' + opt.value + '" type="button">' +
          '<span class="cmp-option-icon"><i class="fas ' + opt.icon + '"></i></span>' +
          '<span class="cmp-option-label">' + opt.label + '</span>' +
          '</button>';
      }).join('');
      var backBtn = stepIndex > 0
        ? '<button class="cmp-back-btn" id="cmpBack" type="button"><i class="fas fa-arrow-left"></i> Anterior</button>'
        : '';
      return '<p class="cmp-question-num">Pregunta ' + (stepIndex + 1) + ' de ' + QUESTIONS.length + '</p>' +
        '<h2 class="cmp-question-text">' + q.text + '</h2>' +
        '<div class="cmp-options" role="group" aria-label="' + q.text + '">' + options + '</div>' +
        '<div class="cmp-nav-row">' + backBtn + '</div>';
    }

    function handleOptionClick(questionId, value) {
      cmpState.answers[questionId] = value;
      if (cmpState.currentStep < QUESTIONS.length - 1) {
        renderStep(cmpState.currentStep + 1, 'forward');
      } else {
        updateProgress(QUESTIONS.length);
        updateStepDots(QUESTIONS.length);
        computeAndShowResult();
      }
    }

    function computeRecommendation(a) {
      if (a.q1_size === 'large' || a.q6_compliance === 'all') {
        return a.q6_compliance === 'all' ? 'E5' : 'E3';
      }
      if (a.q4_regulated === 'yes' || a.q3_mdm === 'yes') {
        return a.q6_compliance === 'some' ? 'E3' : 'BusinessPremium';
      }
      if (a.q6_compliance === 'some') return 'BusinessPremium';
      if (a.q2_desktop === 'yes' || a.q2_desktop === 'mixed') {
        return a.q5_frontline === 'yes' ? 'BusinessStandard_F3' : 'BusinessStandard';
      }
      return a.q5_frontline === 'yes' ? 'BusinessBasic_F1' : 'BusinessBasic';
    }

    function computeAndShowResult() {
      var recKey = computeRecommendation(cmpState.answers);
      cmpState.recommendation = recKey;
      var rec   = RECOMMENDATIONS[recKey];
      var parts = recKey.split('_');
      var plan  = PLANS_DATA[parts[0]];

      var badgeHTML = '<span style="background:linear-gradient(135deg,' + plan.color + '22,' + plan.color + '44);color:' + plan.color + ';border:1px solid ' + plan.color + '55">' + plan.label + '</span>';
      if (parts[1]) {
        var plan2 = PLANS_DATA[parts[1]];
        badgeHTML += '<span class="cmp-plus">+</span><span style="background:linear-gradient(135deg,' + plan2.color + '22,' + plan2.color + '44);color:' + plan2.color + ';border:1px solid ' + plan2.color + '55">' + plan2.label + '</span>';
      }
      planBadgeEl.innerHTML = badgeHTML;
      planSubtitle.textContent = rec.subtitle;

      justifEl.innerHTML =
        '<div class="cmp-just-block"><p class="cmp-just-title"><i class="fas fa-check-circle" style="color:var(--accent)"></i> Por qué este plan</p><p>' + rec.why + '</p></div>' +
        '<div class="cmp-just-block"><p class="cmp-just-title"><i class="fas fa-times-circle" style="color:#f472b6"></i> Por qué no los otros</p><p>' + rec.whyNot + '</p></div>';

      if (rec.addon) {
        addonsEl.innerHTML =
          '<p class="cmp-addons-title"><i class="fas fa-puzzle-piece"></i> Add-on recomendado</p>' +
          '<div class="cmp-addon-card"><div class="cmp-addon-icon"><i class="fas ' + rec.addon.icon + '"></i></div><div><p class="cmp-addon-name">' + rec.addon.label + '</p><p class="cmp-addon-why">' + rec.addon.why + '</p></div></div>';
        addonsEl.style.display = 'block';
      } else {
        addonsEl.style.display = 'none';
      }

      resultEl.removeAttribute('hidden');
    }

    function restart() {
      cmpState.currentStep = 0;
      cmpState.answers = {};
      cmpState.recommendation = null;
      resultEl.setAttribute('hidden', '');
      renderStep(0);
      updateProgress(0);
      updateStepDots(0);
    }

    buildStepDots();
    renderStep(0);
    var restartBtn = container.querySelector('#cmpRestart') || document.getElementById('cmpRestart');
    var goToTableBtn = container.querySelector('#cmpGoToTable') || document.getElementById('cmpGoToTable');
    if (restartBtn) restartBtn.addEventListener('click', restart);
    if (goToTableBtn) goToTableBtn.addEventListener('click', function () {
      switchDoc('m365-guide');
    });
  }

  // === INIT: INTERACTIVE LOAD BALANCER ===
  function initLoadBalancer(container) {
    var LB_DATA = {
      users: {
        icon: '<i class="fas fa-user"></i>',
        title: 'Internet Users',
        badge: 'Cliente · Origen',
        ov: '<p class="lb-slbl">¿Qué es?</p><p class="lb-dtxt">Cualquier cliente externo que genera tráfico hacia la solución: usuarios finales, apps móviles, sistemas externos o servicios de terceros que consumen la API.</p><p class="lb-slbl">Flujo de tráfico</p><p class="lb-dtxt">El cliente hace una petición HTTP/S hacia la IP pública del Frontend. Esa IP es la única dirección expuesta — las VMs del backend nunca son accesibles directamente desde internet.</p><p class="lb-slbl">Seguridad</p><p class="lb-dtxt">El tráfico pasa primero por el NSG antes de llegar al Load Balancer, filtrando puertos y protocolos no autorizados antes de cualquier procesamiento.</p>',
        cf: [
          { k: 'Protocolo', v: 'HTTP / HTTPS / TCP' },
          { k: 'Destino', v: 'IP Pública Frontend' },
          { k: 'DNS', v: 'Azure DNS configurable' },
          { k: 'IPv6', v: 'Soportado (Standard)' },
          { k: 'DDoS básico', v: 'Incluido en IP pública', hl: true }
        ],
        uc: [
          { t: 'Aplicaciones web públicas', d: 'APIs REST, portales de cliente, SaaS accesibles desde cualquier navegador en internet.' },
          { t: 'Servicios móviles', d: 'Backend para apps iOS/Android con alta disponibilidad y distribución geográfica.' }
        ]
      },
      nsg: {
        icon: '<i class="fas fa-shield-alt"></i>',
        title: 'Network Security Group',
        badge: 'Seguridad · Filtrado',
        ov: '<p class="lb-slbl">¿Qué es?</p><p class="lb-dtxt">El NSG es un firewall de red en Azure. Contiene reglas que permiten o deniegan tráfico entrante y saliente hacia recursos en la red virtual.</p><p class="lb-slbl">Obligatorio en Standard SKU</p><p class="lb-dtxt">A diferencia del Basic SKU, el Standard Load Balancer requiere NSG explícito. Sin él, todo el tráfico es denegado por defecto — cambio crítico al migrar de Basic a Standard.</p><p class="lb-slbl">Evaluación de reglas</p><p class="lb-dtxt">Las reglas se evalúan por prioridad (100–4096). La primera coincidencia se aplica y se detiene la evaluación. Número menor = mayor prioridad.</p>',
        cf: [
          { k: 'Prioridad rango', v: '100 – 4096' },
          { k: 'Protocolo', v: 'TCP / UDP / ICMP / Any' },
          { k: 'Dirección', v: 'Inbound / Outbound' },
          { k: 'Acción', v: 'Allow / Deny' },
          { k: 'Scope', v: 'Subnet o NIC' },
          { k: 'Reglas default', v: '3 in + 3 out', hl: true }
        ],
        uc: [
          { t: 'Permitir solo puertos necesarios', d: 'Regla Allow 80/443 + Deny * al final. Solo tráfico web pasa al Load Balancer.' },
          { t: 'SSH restringido', d: 'Allow TCP 22 solo desde IPs corporativas. Bloquea acceso SSH desde internet.' },
          { t: 'Aislar entornos', d: 'Reglas que separan tráfico entre subnets de dev, staging y producción.' }
        ]
      },
      fip: {
        icon: '<i class="fas fa-globe"></i>',
        title: 'Frontend IP Configuration',
        badge: 'Entrada · IP Pública',
        ov: '<p class="lb-slbl">¿Qué es?</p><p class="lb-dtxt">La configuración de IP del frontend es el punto de entrada al Load Balancer — la dirección IP pública a la que los clientes se conectan.</p><p class="lb-slbl">IP Pública estática</p><p class="lb-dtxt">Se asigna una IP pública estática (Standard SKU). Esta IP no cambia aunque se reinicie el LB, permitiendo registros DNS tipo A estables y sin cambios de configuración.</p><p class="lb-slbl">Múltiples frontends</p><p class="lb-dtxt">Un único LB puede tener múltiples IPs de frontend, permitiendo servir varias aplicaciones con distintas IPs y reglas desde la misma instancia, reduciendo costos.</p>',
        cf: [
          { k: 'Tipo IP', v: 'Pública o Privada' },
          { k: 'Asignación', v: 'Static (Standard)', hl: true },
          { k: 'SKU IP', v: 'Standard (obligatorio)' },
          { k: 'Múltiples IPs', v: 'Soportado' },
          { k: 'IPv6', v: 'Dual-stack' },
          { k: 'DDoS', v: 'Basic incluido' }
        ],
        uc: [
          { t: 'Single IP, múltiples servicios', d: 'Una IP con reglas por puerto: HTTP(80), HTTPS(443), API(8080) hacia distintos backends.' },
          { t: 'Multi-tenant', d: 'Múltiples IPs de frontend para aislar clientes enterprise en el mismo Load Balancer.' }
        ]
      },
      lb: {
        icon: '<i class="fas fa-balance-scale"></i>',
        title: 'Standard Load Balancer',
        badge: 'Capa 4 · TCP/UDP',
        ov: '<p class="lb-slbl">¿Qué es?</p><p class="lb-dtxt">Opera en Capa 4 (transporte) del modelo OSI. Distribuye tráfico TCP y UDP sin inspeccionar el contenido — solo trabaja con IPs y puertos. No interpreta HTTP, cookies ni headers.</p><p class="lb-slbl">Algoritmo 5-tuple hash</p><p class="lb-dtxt">Calcula un hash usando: IP origen, IP destino, puerto origen, puerto destino y protocolo. Garantiza que una misma sesión siempre llega a la misma VM (afinidad de sesión implícita).</p><p class="lb-slbl">Standard vs Basic SKU</p><p class="lb-dtxt">Standard ofrece: zonas de disponibilidad, métricas en Azure Monitor, NSG obligatorio, SLA 99.99%, hasta 1.000 instancias en backend pool y outbound rules explícitas.</p>',
        cf: [
          { k: 'SKU', v: 'Standard', hl: true },
          { k: 'Capa OSI', v: 'Capa 4 (Transporte)' },
          { k: 'Protocolo', v: 'TCP / UDP' },
          { k: 'Algoritmo', v: '5-tuple hash' },
          { k: 'Max backend', v: '1.000 instancias', hl: true },
          { k: 'SLA', v: '99.99%', hl: true },
          { k: 'Zonas', v: 'Zone-redundant' },
          { k: 'Métricas', v: 'Azure Monitor' }
        ],
        uc: [
          { t: 'Alta disponibilidad web', d: 'Distribuir tráfico HTTP/S entre múltiples VMs, eliminando punto único de fallo con SLA 99.99%.' },
          { t: 'Load Balancer interno', d: 'LB privado para tráfico entre capas: web tier → app tier → DB tier.' },
          { t: 'Gaming y UDP', d: 'Balanceo de protocolos UDP para juegos online con baja latencia y alta throughput.' }
        ]
      },
      pool: {
        icon: '<i class="fas fa-server"></i>',
        title: 'Backend Pool',
        badge: 'VMSS · Servidores',
        ov: '<p class="lb-slbl">¿Qué es?</p><p class="lb-dtxt">El Backend Pool es el conjunto de recursos que reciben el tráfico distribuido. Puede contener VMs individuales, NICs o instancias de un VMSS (Virtual Machine Scale Set).</p><p class="lb-slbl">VMSS en este caso</p><p class="lb-dtxt">Las VMs D2s v3 están en un VMSS que escala automáticamente según CPU, memoria o tráfico. Al agregar una nueva instancia, el LB la detecta automáticamente vía Health Probe.</p><p class="lb-slbl">Estado de instancias</p><p class="lb-dtxt">El Health Probe determina qué instancias están sanas. Una VM que falla el probe es retirada del pool automáticamente hasta recuperarse, sin intervención manual.</p>',
        cf: [
          { k: 'Tipo', v: 'VMSS (Scale Set)' },
          { k: 'VM SKU', v: 'D2s v3', hl: true },
          { k: 'OS', v: 'Linux Ubuntu' },
          { k: 'vCPUs por VM', v: '2 vCPUs' },
          { k: 'RAM por VM', v: '8 GB' },
          { k: 'Instancias mín.', v: '2' },
          { k: 'Auto-scale', v: 'Habilitado' }
        ],
        uc: [
          { t: 'Auto-scaling horizontal', d: 'Agregar/quitar VMs automáticamente según demanda sin interrupción del servicio.' },
          { t: 'Rolling upgrades', d: 'Actualizar VMs de una en una sin downtime — cada instancia se retira del pool durante el update.' },
          { t: 'Multi-zona', d: 'Instancias distribuidas en Zona 1, 2 y 3 para sobrevivir la caída de un datacenter completo.' }
        ]
      },
      nat: {
        icon: '<i class="fas fa-random"></i>',
        title: 'Inbound NAT Rules',
        badge: 'Network Address Translation',
        ov: '<p class="lb-slbl">¿Qué son?</p><p class="lb-dtxt">Las Inbound NAT Rules crean un mapeo directo entre un puerto de la IP pública del frontend y un puerto en una VM específica del backend — sin pasar por el algoritmo de distribución del LB.</p><p class="lb-slbl">Caso de uso principal</p><p class="lb-dtxt">Acceso SSH o RDP a VMs individuales sin asignar una IP pública a cada una. Por ejemplo: puerto 50001 en la IP pública → SSH a VM-1, puerto 50002 → SSH a VM-2.</p><p class="lb-slbl">NAT Gateway vs NAT Rules</p><p class="lb-dtxt">Las NAT Rules son para tráfico entrante (inbound). Para tráfico saliente se usan Outbound Rules o un NAT Gateway independiente. Son conceptos distintos que no deben confundirse.</p>',
        cf: [
          { k: 'Dirección', v: 'Inbound' },
          { k: 'Mapeo', v: 'IP:Puerto → VM:Puerto' },
          { k: 'Protocolo', v: 'TCP / UDP' },
          { k: 'Tipo', v: 'Estático o dinámico' },
          { k: 'Uso típico', v: 'SSH (22) / RDP (3389)', hl: true },
          { k: 'Por VM', v: 'Una regla por instancia' }
        ],
        uc: [
          { t: 'SSH sin IP pública por VM', d: 'Puerto 50001 → VM-1:22, puerto 50002 → VM-2:22. Una sola IP pública para todas las VMs.' },
          { t: 'Acceso RDP administración', d: 'Mapear puertos altos (50100+) de la IP del LB a RDP(3389) de cada VM del pool.' },
          { t: 'Debug de instancia específica', d: 'Cuando necesitas conectarte directamente a una VM concreta para diagnosticar un problema.' }
        ]
      },
      lbr: {
        icon: '<i class="fas fa-cog"></i>',
        title: 'Load Balancing Rules',
        badge: 'Distribución · Reglas',
        ov: '<p class="lb-slbl">¿Qué son?</p><p class="lb-dtxt">Las LB Rules definen cómo distribuir el tráfico entrante desde la IP del frontend hacia el backend pool. Especifican protocolo, puerto de frontend y puerto de backend.</p><p class="lb-slbl">Las primeras 5 son gratuitas</p><p class="lb-dtxt">El precio base del Standard LB (~$18/mes) incluye 5 reglas. Cada regla adicional cuesta $0.008/hora (~$5.84/mes). Planificar las reglas evita costos inesperados en producción.</p><p class="lb-slbl">Session persistence</p><p class="lb-dtxt">Por defecto usa hash de 5 tuplas. Se puede configurar persistencia de sesión por IP de cliente (2-tuple) o por IP+Puerto (3-tuple) para aplicaciones que requieren afinidad de sesión.</p>',
        cf: [
          { k: '5 reglas incluidas', v: 'En precio base', hl: true },
          { k: 'Regla adicional', v: '$0.008/hora' },
          { k: 'Protocolo', v: 'TCP / UDP' },
          { k: 'Puerto frontend', v: 'Cualquier puerto' },
          { k: 'Puerto backend', v: 'Puede diferir' },
          { k: 'Session persist.', v: 'None / Client IP / 5-tuple' }
        ],
        uc: [
          { t: 'HTTP y HTTPS', d: 'Regla 1: TCP 80 → backend 80. Regla 2: TCP 443 → backend 443. Las más comunes en cualquier app web.' },
          { t: 'Múltiples aplicaciones', d: 'Un LB para app web (80/443), API REST (8080) y servicio interno (9000) en el mismo backend pool.' },
          { t: 'Redirección de puertos', d: 'Frontend puerto 443 → backend puerto 8443 cuando la app corre en puerto no estándar.' }
        ]
      },
      out: {
        icon: '<i class="fas fa-sign-out-alt"></i>',
        title: 'Outbound Rules',
        badge: 'Salida · SNAT',
        ov: '<p class="lb-slbl">¿Qué son?</p><p class="lb-dtxt">Las Outbound Rules controlan cómo las VMs del backend acceden a internet para tráfico saliente. Usan SNAT (Source Network Address Translation) para traducir la IP privada de la VM a la IP pública del LB.</p><p class="lb-slbl">Obligatorias en Standard SKU</p><p class="lb-dtxt">Con Standard LB, el tráfico saliente no es automático — debes configurar explícitamente cómo las VMs salen a internet. Cambio importante respecto al Basic SKU donde era automático.</p><p class="lb-slbl">Puertos SNAT</p><p class="lb-dtxt">Cada IP pública asignada al outbound tiene 64.512 puertos SNAT efímeros disponibles. Con muchas VMs y alto tráfico saliente, puede necesitarse más de una IP pública.</p>',
        cf: [
          { k: 'Tipo', v: 'SNAT outbound' },
          { k: 'Puertos por IP', v: '64.512', hl: true },
          { k: 'Protocolo', v: 'TCP / UDP / All' },
          { k: 'Timeout TCP', v: '4 min (configurable)' },
          { k: 'IPs asignables', v: 'Múltiples por regla' },
          { k: 'Idle reset', v: 'TCP reset en timeout' }
        ],
        uc: [
          { t: 'VMs actualizando paquetes', d: 'Las VMs necesitan salir a internet para apt-get, yum, o descargar artefactos de build pipeline.' },
          { t: 'Llamadas a APIs externas', d: 'App en VM hace llamadas a APIs de terceros (Stripe, SendGrid, etc.) — necesita IP pública de salida.' },
          { t: 'SNAT exhaustion', d: 'Si hay muchas conexiones salientes cortas, agregar más IPs públicas al outbound para aumentar el pool de puertos disponibles.' }
        ]
      },
      prb: {
        icon: '<i class="fas fa-heartbeat"></i>',
        title: 'Health Probe',
        badge: 'Monitoreo · Alta disponibilidad',
        ov: '<p class="lb-slbl">¿Qué es?</p><p class="lb-dtxt">El Health Probe monitorea continuamente el estado de cada VM en el backend pool. Si una VM no responde correctamente, el LB deja de enviarle tráfico hasta que se recupere.</p><p class="lb-slbl">Tipos de probe</p><p class="lb-dtxt">Probe TCP: intenta abrir una conexión TCP en el puerto especificado. Probe HTTP/HTTPS: hace una petición GET y espera respuesta 200. HTTP permite verificar lógica de negocio propia (BD, caché, dependencias).</p><p class="lb-slbl">Umbrales</p><p class="lb-dtxt">Una VM se marca como unhealthy después de 2 fallos consecutivos. Se marca healthy de nuevo tras 2 éxitos consecutivos. El intervalo por defecto es de 5 segundos.</p>',
        cf: [
          { k: 'Tipos', v: 'TCP / HTTP / HTTPS' },
          { k: 'Intervalo', v: '5 segundos (default)' },
          { k: 'Umbral unhealthy', v: '2 fallos consecutivos', hl: true },
          { k: 'Umbral healthy', v: '2 éxitos consecutivos' },
          { k: 'Puerto', v: 'Cualquier puerto' },
          { k: 'Path HTTP', v: '/health (recomendado)' }
        ],
        uc: [
          { t: 'Health endpoint propio', d: 'Exponer /health que verifica: BD accesible, caché disponible, dependencias OK. Retorna 200 solo si todo está bien.' },
          { t: 'Graceful shutdown', d: 'Al detener una VM, el health endpoint retorna 503 primero — el LB deja de enviarle tráfico antes de que el proceso termine.' },
          { t: 'Blue/Green deployments', d: 'Marcar instancias antiguas como unhealthy vía el health endpoint para drenar conexiones antes del deployment.' }
        ]
      }
    };

    var panel = container.querySelector('#lbDetailPanel') || document.getElementById('lbDetailPanel');
    if (!panel) return;

    var closeBtn = container.querySelector('#lbDetailClose') || document.getElementById('lbDetailClose');

    // View tabs (Diagrama / Configuración)
    container.querySelectorAll('.lb-vtab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var viewId = tab.getAttribute('data-lb-view');
        container.querySelectorAll('.lb-vtab').forEach(function (t) { t.classList.remove('lb-vtab--active'); });
        container.querySelectorAll('.lb-view').forEach(function (v) { v.classList.remove('lb-view--active'); });
        tab.classList.add('lb-vtab--active');
        var target = container.querySelector('#lb-view-' + viewId) || document.getElementById('lb-view-' + viewId);
        if (target) target.classList.add('lb-view--active');
      });
    });

    // Open detail panel
    function openLbPanel(key) {
      var d = LB_DATA[key];
      if (!d) return;

      // Deselect all nodes
      container.querySelectorAll('.lb-node, .lb-rule').forEach(function (n) {
        n.classList.remove('lb-node--selected');
      });

      // Select clicked node
      container.querySelectorAll('[data-lb-node="' + key + '"]').forEach(function (el) {
        el.classList.add('lb-node--selected');
      });

      // Fill panel content
      var iconEl = container.querySelector('#lbDetailIcon') || document.getElementById('lbDetailIcon');
      var titleEl = container.querySelector('#lbDetailTitle') || document.getElementById('lbDetailTitle');
      var badgeEl = container.querySelector('#lbDetailBadge') || document.getElementById('lbDetailBadge');
      iconEl.innerHTML = d.icon;
      titleEl.textContent = d.title;
      badgeEl.textContent = d.badge;

      // Overview tab
      var ovEl = container.querySelector('#lb-tc-ov') || document.getElementById('lb-tc-ov');
      ovEl.innerHTML = d.ov;

      // Config tab
      var cfEl = container.querySelector('#lb-tc-cf') || document.getElementById('lb-tc-cf');
      cfEl.innerHTML = d.cf.map(function (i) {
        return '<div class="lb-ci"><span class="lb-ck">' + i.k + '</span><span class="lb-cv' + (i.hl ? ' lb-hl' : '') + '">' + i.v + '</span></div>';
      }).join('');

      // Use cases tab
      var ucEl = container.querySelector('#lb-tc-uc') || document.getElementById('lb-tc-uc');
      ucEl.innerHTML = d.uc.map(function (i) {
        return '<div class="lb-uci"><div class="lb-uct">' + i.t + '</div><div class="lb-ucd">' + i.d + '</div></div>';
      }).join('');

      panel.classList.add('lb-detail--open');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Close detail section
    function closeLbPanel() {
      panel.classList.remove('lb-detail--open');
      container.querySelectorAll('.lb-node, .lb-rule').forEach(function (n) {
        n.classList.remove('lb-node--selected');
      });
    }

    closeBtn.addEventListener('click', closeLbPanel);

    // Node click handlers
    container.querySelectorAll('[data-lb-node]').forEach(function (el) {
      el.addEventListener('click', function () {
        openLbPanel(el.getAttribute('data-lb-node'));
      });
    });
  }

  // === INICIALIZAR PANEL POR DEFECTO (azure-data, ya inline) ===
  initExpandableCards(document.getElementById('slot-azure-data'));

})();
