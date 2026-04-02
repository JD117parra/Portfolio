// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // === NAV LINK ACTIVO SEGÚN PÁGINA ACTUAL ===
    (function () {
      const raw = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
      const current = raw.replace(/\.html$/, '');
      document.querySelectorAll('.nav-links a').forEach(function (link) {
        const href = link.getAttribute('href').split('/').pop().replace(/\.html$/, '');
        if (href === current || (current === '' && href === 'index')) {
          link.classList.add('nav-link--active');
        }
      });
    })();

    // === NAVEGACIÓN SUAVE ===
    // Obtener todos los enlaces del menú de navegación
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el ID de la sección objetivo
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calcular la posición considerando la altura del navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Scroll suave hacia la sección
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === NAVBAR RESPONSIVE ===
    // Crear botón hamburguesa para móvil
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');
    const navLinksContainer = document.querySelector('.nav-links');
    
    // Crear botón hamburguesa
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-btn';
    hamburgerBtn.type = 'button';
    hamburgerBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Insertar el botón después del logo
    navContainer.insertBefore(hamburgerBtn, navContainer.firstChild);
     
    // Funcionalidad del menú móvil
    hamburgerBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('nav-active');
        
        // Cambiar icono
        const icon = this.querySelector('i');
        if (navLinksContainer.classList.contains('nav-active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Cerrar menú al hacer click en un enlace (móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('nav-active');
                hamburgerBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    });
    
    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !navContainer.contains(e.target) && 
            navLinksContainer.classList.contains('nav-active')) {
            navLinksContainer.classList.remove('nav-active');
            hamburgerBtn.querySelector('i').className = 'fas fa-bars';
        }
    });

    // === EFECTO DE SCROLL EN NAVBAR ===
    let lastScrollTop = 0;
    const navbarElement = document.querySelector('.navbar');
    
   window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    navbarElement.classList.add('scrolled');
  } else {
    navbarElement.classList.remove('scrolled');
  }
});

    // === ANIMACIONES DE ENTRADA ===
    // Configurar el Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .about, .contact');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // === TYPING EFFECT EN EL HERO ===
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero .subtitle');
    
    function createTypingEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        typeWriter();
    }
    
    // Iniciar el efecto de escritura después de un pequeño delay
    setTimeout(() => {
    if (heroTitle) {
        const titleText = heroTitle.textContent;
        createTypingEffect(heroTitle, titleText, 150);
    }
    if (heroSubtitle) {
        const subtitleText = heroSubtitle.textContent;
        setTimeout(() => {
            createTypingEffect(heroSubtitle, subtitleText, 80);
        }, 2000);
    }
    }, 500);

    // === EASTER EGG ===
    // Agregar un pequeño easter egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        konamiCode = konamiCode.slice(-konamiSequence.length);
        
        if (konamiCode.join('') === konamiSequence.join('')) {
            // Activar efecto especial
            document.body.style.animation = 'rainbow 2s infinite';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.animation = '';
                style.remove();
            }, 4000);
        }
    });

    // === FILTROS DE CASOS TÉCNICOS ===
    const hubCards = document.querySelectorAll('.hub-card');
    if (hubCards.length) {
        const casoCards = document.querySelectorAll('.caso[data-area]');

        // Estado inicial: ningún caso visible
        casoCards.forEach(c => { c.style.display = 'none'; });

        function applyFilter(filter) {
            hubCards.forEach(c => c.classList.remove('active'));
            const activeHub = document.querySelector(`.hub-card[data-filter="${filter}"]`);
            if (activeHub) activeHub.classList.add('active');

            casoCards.forEach(caso => {
                caso.style.display = caso.dataset.area === filter ? 'grid' : 'none';
            });
        }

        hubCards.forEach(card => card.addEventListener('click', () => applyFilter(card.dataset.filter)));
    }

    console.log('🚀 ¡JavaScript cargado correctamente! Página web de Juan David Parra lista.');
});


// === MANEJO DE ERRORES ===
window.addEventListener('error', function(e) {
    console.log('Error detectado:', e.error);
    // Aquí podrías enviar el error a un servicio de monitoreo
});

// === PERFORMANCE MONITORING ===
// Monitorear el rendimiento de la página
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Página cargada en ${Math.round(loadTime)} ms`);

    // Si el tiempo de carga es muy alto, mostrar sugerencia
    if (loadTime > 3000) {
        console.log('💡 Sugerencia: Considera optimizar las imágenes y recursos para mejorar la velocidad de carga');
    }
});

// === COMPARADOR M365 (recursos-tecnicos.html) ===
if (document.getElementById('cmpQuestion')) {
  (function () {
    try {

    // ─── DATA ────────────────────────────────────────────────────────

    var QUESTIONS = [
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

    var PLANS_DATA = {
      F1:               { label: 'M365 F1',           color: '#38bdf8', tag: 'Primera línea' },
      F3:               { label: 'M365 F3',           color: '#34d399', tag: 'Primera línea' },
      BusinessBasic:    { label: 'Business Basic',    color: '#94a3b8', tag: 'PYME · hasta 300 usuarios' },
      BusinessStandard: { label: 'Business Standard', color: '#60a5fa', tag: 'PYME · hasta 300 usuarios' },
      BusinessPremium:  { label: 'Business Premium',  color: '#c084fc', tag: 'PYME · hasta 300 usuarios' },
      E3:               { label: 'M365 E3',           color: '#fb923c', tag: 'Enterprise' },
      E5:               { label: 'M365 E5',           color: '#f472b6', tag: 'Enterprise' },
    };

    // Fuente: https://learn.microsoft.com/office365/servicedescriptions/
    var FEATURES = [
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

    var RECOMMENDATIONS = {
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

    var PLAN_ORDER = ['F1', 'F3', 'BusinessBasic', 'BusinessStandard', 'BusinessPremium', 'E3', 'E5'];

    // ─── STATE ───────────────────────────────────────────────────────

    var state = {
      currentStep:    0,
      answers:        {},
      recommendation: null,
      hiddenPlans:    {},
      collapsedCats:  {},
      searchQuery:    ''
    };

    // ─── DOM REFS ────────────────────────────────────────────────────

    var questionEl   = document.getElementById('cmpQuestion');
    var progressFill = document.getElementById('cmpProgressFill');
    var progressBar  = document.getElementById('cmpProgressBar');
    var stepsEl      = document.getElementById('cmpSteps');
    var resultEl     = document.getElementById('cmpResult');
    var planBadgeEl  = document.getElementById('cmpPlanBadge');
    var planSubtitle = document.getElementById('cmpPlanSubtitle');
    var justifEl     = document.getElementById('cmpJustification');
    var addonsEl     = document.getElementById('cmpAddons');
    var tableEl      = document.getElementById('cmpTable');

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
      var main = document.getElementById('appMain');
      if (main) main.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ─── INIT ────────────────────────────────────────────────────────

    function init() {
        initSidebar();
      buildStepDots();
      renderStep(0);
      buildColToggles();
      renderTable();

      document.getElementById('cmpRestart').addEventListener('click', restart);
      document.getElementById('cmpGoToTable').addEventListener('click', function () {
        switchPanel('tabla');
      });

      var searchInput = document.getElementById('tblSearch');
      var searchClear = document.getElementById('tblSearchClear');

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
        var dot = document.getElementById('cmpDot' + i);
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
      var q         = QUESTIONS[stepIndex];
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
      var recKey = computeRecommendation(state.answers);
      state.recommendation = recKey;
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
      renderTable();
    }

    // ─── COLUMN TOGGLES ──────────────────────────────────────────────

    function buildColToggles() {
      var container = document.getElementById('tblColToggles');
      var html = '';
      PLAN_ORDER.forEach(function (planKey) {
        var plan = PLANS_DATA[planKey];
        html += '<button class="tbl-col-toggle tbl-col-toggle--active" data-plan="' + planKey + '" type="button">' +
          '<span class="tbl-col-toggle__dot" style="background:' + plan.color + '"></span>' +
          plan.label +
          '</button>';
      });
      container.innerHTML = html;
      container.querySelectorAll('.tbl-col-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var planKey = this.dataset.plan;
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
      var plans  = getVisiblePlans();
      var parts  = state.recommendation ? state.recommendation.split('_') : [];
      var isRec  = function (p) { return parts.indexOf(p) !== -1; };
      var query  = state.searchQuery;

      var categories = [];
      FEATURES.forEach(function (f) {
        if (categories.indexOf(f.category) === -1) categories.push(f.category);
      });

      if (!plans.length) {
        tableEl.innerHTML = '<tbody><tr><td class="tbl-no-results" colspan="99">Seleccioná al menos un plan para comparar.</td></tr></tbody>';
        return;
      }

      var html = '<thead><tr><th>Característica</th>';
      plans.forEach(function (p) {
        var plan = PLANS_DATA[p];
        var rec  = isRec(p);
        html += '<th class="' + (rec ? 'cmp-th--rec' : '') + '" style="' + (rec ? 'color:' + plan.color : '') + '">' +
          plan.label +
          (rec ? '<br><small style="font-weight:400;font-size:0.65rem;opacity:0.75;text-transform:none;letter-spacing:0">' + plan.tag + '</small>' : '') +
          '</th>';
      });
      html += '</tr></thead><tbody>';

      var anyVisible = false;

      categories.forEach(function (cat) {
        var catFeatures = FEATURES.filter(function (f) { return f.category === cat; });
        var matches = query
          ? catFeatures.filter(function (f) { return f.label.toLowerCase().indexOf(query) !== -1; })
          : catFeatures;

        if (!matches.length) return;
        anyVisible = true;

        var collapsed = !!state.collapsedCats[cat];
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
            var val = f[p];
            var rec = isRec(p);
            var cell;
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
          var cat = this.dataset.cat;
          state.collapsedCats[cat] = !state.collapsedCats[cat];
          this.classList.toggle('cmp-cat-row--collapsed', !!state.collapsedCats[cat]);
          var next = this.nextElementSibling;
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

// === FOOTER DETAILS: abrir en desktop, acordeón en móvil ===
(function () {
  var details = document.querySelectorAll('.footer-section details');
  if (!details.length) return;

  function toggle() {
    var desktop = window.innerWidth > 768;
    details.forEach(function (d) {
      if (desktop) d.setAttribute('open', '');
      else d.removeAttribute('open');
    });
  }

  toggle();
  window.addEventListener('resize', toggle);
})();

// === LOGO CAROUSEL ===
(function () {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  let pos = 0;
  const speed = 0.6; // px por frame

  function step() {
    {
      pos -= speed;
      // Cuando se ha desplazado la mitad (los 5 originales), reiniciar
      if (Math.abs(pos) >= track.scrollWidth / 2) {
        pos = 0;
      }
      track.style.transform = 'translateX(' + pos + 'px)';
    }
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
})();

document.querySelectorAll('.swiper').forEach(function(el) {
  new Swiper(el, {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 24,
    pagination: {
      el: el.querySelector('.swiper-pagination'),
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: el.querySelector('.swiper-button-next'),
      prevEl: el.querySelector('.swiper-button-prev'),
    },
  });
});
