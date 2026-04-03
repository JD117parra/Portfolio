// === COMPARADOR M365 (recursos-tecnicos.html) ===
if (document.getElementById('cmpQuestion')) {
  (function () {
    try {

    // ─── DATA ────────────────────────────────────────────────────────

    const QUESTIONS = [
      {
        id: 'q1_size',
        text: '¿Cuántos usuarios tiene la organización?',
        options: [
          { label: '1 – 10 usuarios',     value: 'micro',  icon: 'fa-user' },
          { label: '11 – 50 usuarios',    value: 'small',  icon: 'fa-user-friends' },
          { label: '51 – 300 usuarios',   value: 'medium', icon: 'fa-users' },
          { label: 'Más de 300 usuarios', value: 'large',  icon: 'fa-city' },
        ]
      },
      {
        id: 'q2_desktop',
        text: '¿Los usuarios necesitan Office instalado en su PC o Mac?',
        options: [
          { label: 'Sí, todos necesitan Office instalado',  value: 'yes',      icon: 'fa-laptop' },
          { label: 'No, solo usan la versión web y móvil', value: 'web_only', icon: 'fa-globe' },
          { label: 'Algunos sí, otros no',                  value: 'mixed',    icon: 'fa-random' },
        ]
      },
      {
        id: 'q3_mdm',
        text: '¿Necesitás gestión centralizada de dispositivos (Intune / MDM)?',
        options: [
          { label: 'Sí, quiero controlar los equipos corporativos', value: 'yes',     icon: 'fa-lock' },
          { label: 'No es necesario por ahora',                      value: 'no',      icon: 'fa-unlock' },
          { label: 'No lo sé todavía',                               value: 'unknown', icon: 'fa-question' },
        ]
      },
      {
        id: 'q4_regulated',
        text: '¿El sector maneja datos sensibles o está regulado?',
        options: [
          { label: 'Sí — finanzas, salud, legal u otro sector regulado', value: 'yes', icon: 'fa-balance-scale' },
          { label: 'No, es una empresa estándar',                         value: 'no',  icon: 'fa-building' },
        ]
      },
      {
        id: 'q5_frontline',
        text: '¿Hay usuarios sin PC fija (campo, almacén, tienda)?',
        options: [
          { label: 'Sí, hay trabajadores de primera línea', value: 'yes', icon: 'fa-hard-hat' },
          { label: 'No, todos trabajan desde PC o Mac',      value: 'no',  icon: 'fa-desktop' },
        ]
      },
      {
        id: 'q6_compliance',
        text: '¿Necesitás cumplimiento avanzado, eDiscovery o retención legal?',
        options: [
          { label: 'Sí, para toda la organización',                     value: 'all',  icon: 'fa-shield-alt' },
          { label: 'Solo para algunos roles (legal, RRHH, dirección)',  value: 'some', icon: 'fa-user-tie' },
          { label: 'No tenemos esos requisitos',                         value: 'no',   icon: 'fa-times-circle' },
        ]
      },
    ];

    const PLANS_DATA = {
      F1:               { label: 'M365 F1',           color: '#38bdf8', tag: 'Primera línea' },
      F3:               { label: 'M365 F3',           color: '#34d399', tag: 'Primera línea' },
      BusinessBasic:    { label: 'Business Basic',    color: '#94a3b8', tag: 'PYME · hasta 300 usuarios' },
      BusinessStandard: { label: 'Business Standard', color: '#60a5fa', tag: 'PYME · hasta 300 usuarios' },
      BusinessPremium:  { label: 'Business Premium',  color: '#c084fc', tag: 'PYME · hasta 300 usuarios' },
      E3:               { label: 'M365 E3',           color: '#fb923c', tag: 'Enterprise' },
      E5:               { label: 'M365 E5',           color: '#f472b6', tag: 'Enterprise' },
    };

    // Fuente: https://learn.microsoft.com/office365/servicedescriptions/
    const FEATURES = [
      { category: 'Office',       label: 'Office Web Apps (Word, Excel, PowerPoint online)',              F1: false,        F3: true,    BusinessBasic: true,   BusinessStandard: true,   BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Office',       label: 'Office instalado en PC/Mac (hasta 5 dispositivos)',             F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: true,   BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Email',        label: 'Exchange Online — buzón corporativo',                           F1: '2 GB (Kiosk)', F3: '2 GB', BusinessBasic: '50 GB', BusinessStandard: '50 GB', BusinessPremium: '50 GB', E3: '100 GB',  E5: '100 GB' },
      { category: 'Email',        label: 'Archivo ilimitado (Exchange Plan 2)',                           F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: false,  E3: true,        E5: true },
      { category: 'Colaboración', label: 'Microsoft Teams',                                               F1: true,         F3: true,    BusinessBasic: true,   BusinessStandard: true,   BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Colaboración', label: 'SharePoint Online',                                             F1: true,         F3: true,    BusinessBasic: true,   BusinessStandard: true,   BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Colaboración', label: 'OneDrive — almacenamiento personal',                            F1: '2 GB',       F3: '1 TB',  BusinessBasic: '1 TB', BusinessStandard: '1 TB', BusinessPremium: '1 TB', E3: '1 TB+',     E5: '1 TB+' },
      { category: 'Dispositivos', label: 'Microsoft Intune (MDM / MAM)',                                  F1: true,         F3: true,    BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Identidad',    label: 'Microsoft Entra ID',                                            F1: 'Free',       F3: 'Free',  BusinessBasic: 'Free', BusinessStandard: 'Free', BusinessPremium: 'P1',   E3: 'P1',        E5: 'P2' },
      { category: 'Identidad',    label: 'Acceso Condicional (Conditional Access)',                        F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Identidad',    label: 'Identity Protection / PIM (Entra ID P2)',                       F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: false,  E3: false,       E5: true },
      { category: 'Seguridad',    label: 'Defender for Office 365 Plan 1 (Safe Links, Safe Attachments)', F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: true,   E3: 'Add-on',    E5: true },
      { category: 'Seguridad',    label: 'Defender for Office 365 Plan 2 (Threat Explorer)',              F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: false,  E3: 'Add-on',    E5: true },
      { category: 'Cumplimiento', label: 'DLP básico (Exchange, SharePoint, OneDrive)',                   F1: false,        F3: false,   BusinessBasic: true,   BusinessStandard: true,   BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Cumplimiento', label: 'Etiquetas de confidencialidad (Sensitivity Labels)',             F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: true,   E3: true,        E5: true },
      { category: 'Cumplimiento', label: 'eDiscovery y retención legal',                                  F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: 'Limitado', E3: 'Estándar', E5: 'Premium' },
      { category: 'Cumplimiento', label: 'DLP para Teams Chat y comunicaciones',                          F1: false,        F3: false,   BusinessBasic: false,  BusinessStandard: false,  BusinessPremium: false,  E3: false,       E5: true },
      { category: 'Límites',      label: 'Máximo de usuarios',                                            F1: 'Sin límite', F3: 'Sin límite', BusinessBasic: '300', BusinessStandard: '300', BusinessPremium: '300', E3: 'Sin límite', E5: 'Sin límite' },
    ];

    const RECOMMENDATIONS = {
      E5: {
        subtitle: 'Cumplimiento avanzado y seguridad de nivel enterprise para toda la organización',
        why: 'E5 es el plan más completo de Microsoft 365. Incluye Defender for Office 365 Plan 2, Microsoft Entra ID P2 (PIM, Identity Protection), eDiscovery Premium y Microsoft Purview completo. Es el plan indicado cuando la organización requiere cumplimiento avanzado en toda su estructura.',
        whyNot: 'E3 no incluye Defender Plan 2 ni Entra ID P2 de forma nativa. Los planes Business están limitados a 300 usuarios y no incluyen las herramientas de cumplimiento avanzado que E5 provee.',
      },
      E3: {
        subtitle: 'Enterprise sin límite de usuarios, con Intune y Entra ID P1 incluidos',
        why: 'E3 es el plan Enterprise de referencia. Incluye Office instalado en 5 dispositivos, Exchange Online con buzón de 100 GB y archivo ilimitado, Intune para gestión de dispositivos, Entra ID P1 (acceso condicional) y eDiscovery estándar.',
        whyNot: 'Los planes Business tienen un tope de 300 licencias. E5 agrega Defender Plan 2 y Entra ID P2, pero solo se justifica cuando se requieren sus capacidades específicas de cumplimiento avanzado.',
        addon: { label: 'Defender for Office 365 Plan 1', icon: 'fa-shield-alt', why: 'E3 no incluye Defender for Office 365 de forma nativa — requiere add-on. Para sectores regulados es prácticamente obligatorio: cubre Safe Links, Safe Attachments y protección avanzada contra phishing.' },
      },
      BusinessPremium: {
        subtitle: 'El plan más completo para PYMEs: Intune + Defender P1 + Entra ID P1 incluidos',
        why: 'Business Premium incluye todo lo de Business Standard más Microsoft Intune, Entra ID P1 (acceso condicional, MFA avanzado) y Defender for Office 365 Plan 1. Es el plan más elegido para sectores regulados dentro del límite de 300 usuarios.',
        whyNot: 'Business Standard no incluye Intune ni Defender for Office 365 Plan 1, lo que lo hace insuficiente para sectores regulados. E3 ofrece capacidades similares pero sin el tope de 300 usuarios y con Exchange Plan 2 incluido.',
      },
      BusinessStandard: {
        subtitle: 'Office instalado + colaboración completa sin necesidad de MDM',
        why: 'Business Standard incluye Office instalado en hasta 5 dispositivos por usuario, Teams, SharePoint, Exchange Online con 50 GB de buzón y OneDrive con 1 TB. Es el equilibrio entre funcionalidad y costo para organizaciones sin requisitos de MDM.',
        whyNot: 'Business Basic no incluye Office instalado. Business Premium agrega Intune y Defender P1 con un costo adicional que solo se justifica si hay requisitos de MDM o sector regulado.',
      },
      BusinessBasic: {
        subtitle: 'Colaboración cloud completa sin Office instalado',
        why: 'Business Basic cubre Teams, SharePoint, Exchange Online con 50 GB y OneDrive con 1 TB. Incluye las versiones web de Office, suficientes para la mayoría de tareas de oficina.',
        whyNot: 'Business Standard agrega Office instalado, necesario para archivos complejos o macros. Business Premium añade Intune y Defender P1 para organizaciones con requisitos de seguridad más estrictos.',
      },
      BusinessBasic_F1: {
        subtitle: 'Modelo mixto: M365 F1 para primera línea + Business Basic para trabajadores del conocimiento',
        why: 'Tu organización tiene dos perfiles de usuario. M365 F1 cubre a los trabajadores de primera línea (sin PC fija) con Teams y acceso móvil a un costo menor. Business Basic cubre al resto con colaboración cloud completa.',
        whyNot: 'Asignar Business Basic a toda la organización sobrelicenciaría a los trabajadores de primera línea. F3 es alternativa a F1 si esos usuarios necesitan crear documentos con Office web.',
      },
      BusinessStandard_F3: {
        subtitle: 'Modelo mixto: M365 F3 para primera línea + Business Standard para trabajadores del conocimiento',
        why: 'M365 F3 cubre a los trabajadores de primera línea con Office Web Apps completo y 1 TB en OneDrive. Business Standard cubre al resto con Office instalado y colaboración completa.',
        whyNot: 'F1 no incluye Office Web Apps completo. Asignar Business Standard a todos sería sobrelicenciar a usuarios sin PC fija.',
      },
    };

    const PLAN_ORDER = ['F1', 'F3', 'BusinessBasic', 'BusinessStandard', 'BusinessPremium', 'E3', 'E5'];

    // ─── STATE ───────────────────────────────────────────────────────

    const state = {
      currentStep:    0,
      answers:        {},
      recommendation: null,
      hiddenPlans:    {},
      collapsedCats:  {},
      searchQuery:    ''
    };

    // ─── DOM REFS ────────────────────────────────────────────────────

    const questionEl   = document.getElementById('cmpQuestion');
    const progressFill = document.getElementById('cmpProgressFill');
    const progressBar  = document.getElementById('cmpProgressBar');
    const stepsEl      = document.getElementById('cmpSteps');
    const resultEl     = document.getElementById('cmpResult');
    const planBadgeEl  = document.getElementById('cmpPlanBadge');
    const planSubtitle = document.getElementById('cmpPlanSubtitle');
    const justifEl     = document.getElementById('cmpJustification');
    const addonsEl     = document.getElementById('cmpAddons');
    const tableEl      = document.getElementById('cmpTable');

    // ─── SIDEBAR NAVIGATION ──────────────────────────────────────────

    function initSidebar() {
      document.querySelectorAll('.sidebar-item[data-panel]').forEach(function (btn) {
        btn.addEventListener('click', function () { switchPanel(this.dataset.panel); });
      });
    }

    function switchPanel(panelId) {
      document.querySelectorAll('.app-panel').forEach(function (p) {
        p.classList.toggle('app-panel--hidden', p.id !== 'panel-' + panelId);
      });
      document.querySelectorAll('.sidebar-item[data-panel]').forEach(function (btn) {
        btn.classList.toggle('sidebar-item--active', btn.dataset.panel === panelId);
      });
      const main = document.getElementById('appMain');
      if (main) main.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── DIAGRAMAS DE ARQUITECTURA ───────────────────────────────────

    function initDiagramas() {
      const filterBtns = document.querySelectorAll('#diagFilters .diag-filter-btn');
      const cards      = document.querySelectorAll('#diagGrid .diag-card');
      const modal      = document.getElementById('diagModal');
      if (!filterBtns.length || !modal) return;

      const modalTitle    = document.getElementById('diagModalTitle');
      const modalDesc     = document.getElementById('diagModalDesc');
      const modalBadge    = document.getElementById('diagModalBadge');
      const modalDiagram  = document.getElementById('diagModalDiagram');
      const modalClose    = document.getElementById('diagModalClose');
      const modalBackdrop = document.getElementById('diagModalBackdrop');

      // Filtros
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) { b.classList.remove('diag-filter-btn--active'); });
          btn.classList.add('diag-filter-btn--active');
          const filter = btn.dataset.filter;
          cards.forEach(function (card) {
            card.style.display = (filter === 'all' || card.dataset.area === filter) ? '' : 'none';
          });
        });
      });

      // Abrir modal
      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          const badge = card.querySelector('.diag-badge');
          const title = card.querySelector('.diag-card__title');
          const desc  = card.querySelector('.diag-card__desc');

          modalBadge.className = badge ? badge.className : 'diag-badge';
          modalBadge.innerHTML = badge ? badge.innerHTML : '';
          modalTitle.textContent = title ? title.textContent : '';
          modalDesc.textContent  = desc  ? desc.textContent  : '';
          modalDiagram.innerHTML = card.querySelector('.diag-card__preview').innerHTML;
          modal.classList.add('diag-modal--visible');
          document.body.style.overflow = 'hidden';
        });
      });

      // Cerrar modal
      function closeModal() {
        modal.classList.remove('diag-modal--visible');
        document.body.style.overflow = '';
      }
      modalClose.addEventListener('click', closeModal);
      modalBackdrop.addEventListener('click', closeModal);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('diag-modal--visible')) closeModal();
      });
    }

    // ─── INIT ────────────────────────────────────────────────────────

    function init() {
        initSidebar();
      initDiagramas();
      buildStepDots();
      renderStep(0);
      buildColToggles();
      renderTable();

      document.getElementById('cmpRestart').addEventListener('click', restart);
      document.getElementById('cmpGoToTable').addEventListener('click', function () {
        switchPanel('tabla');
      });

      const searchInput = document.getElementById('tblSearch');
      const searchClear = document.getElementById('tblSearchClear');

      searchInput.addEventListener('input', function () {
        state.searchQuery = this.value.trim().toLowerCase();
        searchClear.hidden = !state.searchQuery;
        renderTable();
      });

      searchClear.addEventListener('click', function () {
        searchInput.value = '';
        state.searchQuery = '';
        this.hidden = true;
        searchInput.focus();
        renderTable();
      });
    }

    // ─── STEP DOTS ───────────────────────────────────────────────────

    function buildStepDots() {
      stepsEl.innerHTML = QUESTIONS.map(function (_, i) {
        return '<div class="cmp-step-dot" id="cmpDot' + i + '" aria-label="Paso ' + (i + 1) + '">' + (i + 1) + '</div>';
      }).join('');
    }

    function updateStepDots(active) {
      QUESTIONS.forEach(function (_, i) {
        const dot = document.getElementById('cmpDot' + i);
        dot.className = 'cmp-step-dot';
        if (i < active)   dot.classList.add('cmp-step-dot--done');
        if (i === active) dot.classList.add('cmp-step-dot--active');
      });
    }

    // ─── PROGRESS ────────────────────────────────────────────────────

    function updateProgress(step) {
      progressFill.style.width = (step / QUESTIONS.length * 100) + '%';
      progressBar.setAttribute('aria-valuenow', step);
    }

    // ─── RENDER STEP ─────────────────────────────────────────────────

    function renderStep(stepIndex, direction) {
      direction = direction || 'forward';
      state.currentStep = stepIndex;
      const q         = QUESTIONS[stepIndex];
      const exitClass  = direction === 'forward' ? 'cmp-question--exit-left'  : 'cmp-question--exit-right';
      const enterClass = direction === 'forward' ? 'cmp-question--enter-right' : 'cmp-question--enter-left';

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
        const backBtn = questionEl.querySelector('#cmpBack');
        if (backBtn) backBtn.addEventListener('click', function () { renderStep(stepIndex - 1, 'back'); });
        updateStepDots(stepIndex);
        updateProgress(stepIndex);
      }, 220);
    }

    function buildQuestionHTML(q, stepIndex) {
      const options = q.options.map(function (opt) {
        return '<button class="cmp-option" data-value="' + opt.value + '" type="button">' +
          '<span class="cmp-option-icon"><i class="fas ' + opt.icon + '"></i></span>' +
          '<span class="cmp-option-label">' + opt.label + '</span>' +
          '</button>';
      }).join('');
      const backBtn = stepIndex > 0
        ? '<button class="cmp-back-btn" id="cmpBack" type="button"><i class="fas fa-arrow-left"></i> Anterior</button>'
        : '';
      return '<p class="cmp-question-num">Pregunta ' + (stepIndex + 1) + ' de ' + QUESTIONS.length + '</p>' +
        '<h2 class="cmp-question-text">' + q.text + '</h2>' +
        '<div class="cmp-options" role="group" aria-label="' + q.text + '">' + options + '</div>' +
        '<div class="cmp-nav-row">' + backBtn + '</div>';
    }

    // ─── OPTION CLICK ────────────────────────────────────────────────

    function handleOptionClick(questionId, value) {
      state.answers[questionId] = value;
      if (state.currentStep < QUESTIONS.length - 1) {
        renderStep(state.currentStep + 1, 'forward');
      } else {
        updateProgress(QUESTIONS.length);
        updateStepDots(QUESTIONS.length);
        computeAndShowResult();
      }
    }

    // ─── RECOMMENDATION ENGINE ───────────────────────────────────────

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

    // ─── SHOW RESULT ─────────────────────────────────────────────────

    function computeAndShowResult() {
      const recKey = computeRecommendation(state.answers);
      state.recommendation = recKey;
      const rec   = RECOMMENDATIONS[recKey];
      const parts = recKey.split('_');
      const plan  = PLANS_DATA[parts[0]];

      let badgeHTML = '<span style="background:linear-gradient(135deg,' + plan.color + '22,' + plan.color + '44);color:' + plan.color + ';border:1px solid ' + plan.color + '55">' + plan.label + '</span>';
      if (parts[1]) {
        const plan2 = PLANS_DATA[parts[1]];
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
      renderTable();
    }

    // ─── COLUMN TOGGLES ──────────────────────────────────────────────

    function buildColToggles() {
      const container = document.getElementById('tblColToggles');
      let html = '';
      PLAN_ORDER.forEach(function (planKey) {
        const plan = PLANS_DATA[planKey];
        html += '<button class="tbl-col-toggle tbl-col-toggle--active" data-plan="' + planKey + '" type="button">' +
          '<span class="tbl-col-toggle__dot" style="background:' + plan.color + '"></span>' +
          plan.label +
          '</button>';
      });
      container.innerHTML = html;
      container.querySelectorAll('.tbl-col-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const planKey = this.dataset.plan;
          state.hiddenPlans[planKey] = !state.hiddenPlans[planKey];
          this.classList.toggle('tbl-col-toggle--active', !state.hiddenPlans[planKey]);
          renderTable();
        });
      });
    }

    function getVisiblePlans() {
      return PLAN_ORDER.filter(function (p) { return !state.hiddenPlans[p]; });
    }

    // ─── TABLE ───────────────────────────────────────────────────────

    function renderTable() {
      const plans  = getVisiblePlans();
      const parts  = state.recommendation ? state.recommendation.split('_') : [];
      const isRec  = function (p) { return parts.indexOf(p) !== -1; };
      const query  = state.searchQuery;

      const categories = [];
      FEATURES.forEach(function (f) {
        if (categories.indexOf(f.category) === -1) categories.push(f.category);
      });

      if (!plans.length) {
        tableEl.innerHTML = '<tbody><tr><td class="tbl-no-results" colspan="99">Seleccioná al menos un plan para comparar.</td></tr></tbody>';
        return;
      }

      let html = '<thead><tr><th>Característica</th>';
      plans.forEach(function (p) {
        const plan = PLANS_DATA[p];
        const rec  = isRec(p);
        html += '<th class="' + (rec ? 'cmp-th--rec' : '') + '" style="' + (rec ? 'color:' + plan.color : '') + '">' +
          plan.label +
          (rec ? '<br><small style="font-weight:400;font-size:0.65rem;opacity:0.75;text-transform:none;letter-spacing:0">' + plan.tag + '</small>' : '') +
          '</th>';
      });
      html += '</tr></thead><tbody>';

      let anyVisible = false;

      categories.forEach(function (cat) {
        const catFeatures = FEATURES.filter(function (f) { return f.category === cat; });
        const matches = query
          ? catFeatures.filter(function (f) { return f.label.toLowerCase().indexOf(query) !== -1; })
          : catFeatures;

        if (!matches.length) return;
        anyVisible = true;

        const collapsed = !!state.collapsedCats[cat];
        html += '<tr class="cmp-cat-row' + (collapsed ? ' cmp-cat-row--collapsed' : '') + '" data-cat="' + cat + '">' +
          '<td colspan="' + (plans.length + 1) + '">' +
          '<div class="cmp-cat-row-inner">' +
          '<span>' + cat + '</span>' +
          '<i class="fas fa-chevron-down cmp-cat-chevron"></i>' +
          '</div></td></tr>';

        matches.forEach(function (f) {
          html += '<tr class="' + (collapsed ? 'cmp-feature-row--hidden' : '') + '">';
          html += '<td class="tbl-feature-label">' + f.label + '</td>';
          plans.forEach(function (p) {
            const val = f[p];
            const rec = isRec(p);
            let cell;
            if (val === true)          cell = '<span class="cmp-check"><i class="fas fa-check"></i></span>';
            else if (val === false)    cell = '<span class="cmp-cross"><i class="fas fa-minus"></i></span>';
            else if (val === 'Add-on') cell = '<span class="cmp-partial">Add-on</span>';
            else                       cell = '<span class="cmp-text">' + val + '</span>';
            html += '<td class="' + (rec ? 'cmp-col--rec' : '') + '">' + cell + '</td>';
          });
          html += '</tr>';
        });
      });

      if (!anyVisible) {
        html += '<tr><td class="tbl-no-results" colspan="' + (plans.length + 1) + '">No se encontraron características con "<strong>' + query + '</strong>"</td></tr>';
      }

      tableEl.innerHTML = html + '</tbody>';

      // Category collapse listeners
      tableEl.querySelectorAll('.cmp-cat-row').forEach(function (row) {
        row.addEventListener('click', function () {
          const cat = this.dataset.cat;
          state.collapsedCats[cat] = !state.collapsedCats[cat];
          this.classList.toggle('cmp-cat-row--collapsed', !!state.collapsedCats[cat]);
          let next = this.nextElementSibling;
          while (next && !next.classList.contains('cmp-cat-row')) {
            next.classList.toggle('cmp-feature-row--hidden', !!state.collapsedCats[cat]);
            next = next.nextElementSibling;
          }
        });
      });
    }

    // ─── RESTART ─────────────────────────────────────────────────────

    function restart() {
      state.currentStep = 0;
      state.answers = {};
      state.recommendation = null;
      resultEl.setAttribute('hidden', '');
      renderStep(0);
      updateProgress(0);
      updateStepDots(0);
      renderTable();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── START ───────────────────────────────────────────────────────

    init();

    } catch(e) { console.error('[CMP] init error:', e.message); }
  })();
}
