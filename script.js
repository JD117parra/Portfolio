// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
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
    const hamburgerBtn = document.createElement('div');
    hamburgerBtn.className = 'hamburger-btn';
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

    // === EFECTOS HOVER MEJORADOS ===
    // Efecto parallax suave en las tarjetas de proyecto
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
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
    const titleText = heroTitle.textContent; // Toma el texto del HTML
    const subtitleText = heroSubtitle.textContent; // Toma el texto del HTML
    
    createTypingEffect(heroTitle, titleText, 150);
    setTimeout(() => {
        createTypingEffect(heroSubtitle, subtitleText, 80);
    }, 2000);
    }, 500);

    // === CONTADOR ANIMADO PARA ESTADÍSTICAS ===
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            element.textContent = Math.floor(start);
            if (start < target) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // === SMOOTH SCROLL MEJORADO ===
    // Mejorar el comportamiento del scroll suave
    function smoothScrollTo(targetPosition, duration = 1000) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }

    // === VALIDACIÓN DE FORMULARIO DE CONTACTO ===
    // Si decides agregar un formulario de contacto más adelante
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // === PRELOADER (OPCIONAL) ===
    // Crear y mostrar preloader
    function createPreloader() {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.className = 'preloader';
        
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-spinner"></div>
                <p>Cargando...</p>
            </div>
        `;
        
        document.body.prepend(preloader);
        
        // Ocultar preloader después de que todo cargue
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 1000);
        });
    }
    
    // Activar preloader solo si la página se está cargando
    if (document.readyState === 'loading') {
        createPreloader();
    }

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

    console.log('🚀 ¡JavaScript cargado correctamente! Página web de Juan David Parra lista.');
});

new Swiper('.card-wrapper', {
  loop: true,
  loopedSlides: 3,         // slides duplicados necesarios para loop con slidesPerView: 'auto'
  observer: true,          // re-inicializar si el elemento estaba oculto al inicio
  observeParents: true,
  spaceBetween: 20,        // espacio entre tarjetas
  slidesPerView: 'auto',   // permite que se vean varias a la vez
  centeredSlides: true,    // centra la tarjeta activa

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// === FUNCIONES UTILITARIAS ===
// Función para detectar si el usuario está en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para obtener la posición de scroll
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Función para obtener la altura de la ventana
function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
}

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