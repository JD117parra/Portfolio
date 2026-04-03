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

        applyFilter('azure');
    }

    console.log('🚀 ¡JavaScript cargado correctamente! Página web de Juan David Parra lista.');
});

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
    pos -= speed;
    // Cuando se ha desplazado la mitad (los 5 originales), reiniciar
    if (Math.abs(pos) >= track.scrollWidth / 2) {
      pos = 0;
    }
    track.style.transform = 'translateX(' + pos + 'px)';
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
