
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks   = document.querySelector('.nav-links');
    const navItems   = document.querySelectorAll('.nav-links a');
    const header     = document.querySelector('header');
  
    // 1. Toggle del menú al hacer clic en el icono
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  
    // 2. Cerrar menú al hacer clic en un enlace (útil en móvil)
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  
    // 3. Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  });