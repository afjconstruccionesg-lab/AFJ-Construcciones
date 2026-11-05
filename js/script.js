document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // MENÚ RESPONSIVE (HEADER)
  // ==========================================
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('is-open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  // ==========================================
  // CONTROL DE FECHA EN FOOTER
  // ==========================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ==========================================
  // MENÚ FLOTANTE DE WHATSAPP
  // ==========================================
  const waBtn = document.getElementById('waBtn');
  const waFloat = document.getElementById('waFloat');

  if (waBtn && waFloat) {
    waBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = waFloat.classList.toggle('is-open');
      waBtn.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.js-wa-open').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        waFloat.classList.add('is-open');
        waBtn.setAttribute('aria-expanded', 'true');
      });
    });

    document.addEventListener('click', (e) => {
      if (!waFloat.contains(e.target)) {
        waFloat.classList.remove('is-open');
        waBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // FORMULARIO DE CONTACTO (SIMULACIÓN)
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'Procesando tu solicitud...';
      formNote.style.color = 'var(--gris-concreto)';

      setTimeout(() => {
        formNote.textContent = '¡Gracias por escribirnos! En breve nos pondremos en contacto.';
        formNote.style.color = '#25D366';
        contactForm.reset();
      }, 1500);
    });
  }

  // ==========================================
  // CAROUSEL AUTOMÁTICO Y MANUAL (PUNTITOS)
  // ==========================================
  const carousels = document.querySelectorAll('.project-carousel');

  carousels.forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const intervalTime = parseInt(carousel.getAttribute('data-interval')) || 1000;
    let currentIndex = 0;
    let slideInterval;

    // Función para renderizar la diapositiva activa
    function showSlide(index) {
      if (slides.length === 0) return;

      // Limitar rango
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      // Limpiar clases previas
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      // Activar elementos correspondientes
      slides[index].classList.add('active');
      if (dots[index]) {
        dots[index].classList.add('active');
      }

      currentIndex = index;
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function startInterval() {
      stopInterval();
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopInterval() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    }

    // Inicializar el carrusel en la primera foto
    showSlide(0);
    startInterval();

    // Evento de clic manual en los puntitos
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        stopInterval();      // Frena el avance automático momentáneamente
        showSlide(dotIndex); // Muestra la foto elegida de inmediato
        startInterval();     // Reinicia el contador de 1 segundo
      });
    });

    // Detener animación al pasar el mouse por encima (evita que cambie si querés observarla)
    carousel.addEventListener('mouseenter', stopInterval);
    carousel.addEventListener('mouseleave', startInterval);
  });

  // Fichas de servicios: voltear al hacer click o con Enter/Espacio
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

});

// ==========================================
// HERO: carrusel de fondo (3 s)
// ==========================================
(function(){
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('#heroDots span');
  if (slides.length < 2) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active'); dots[i] && dots[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active'); dots[i] && dots[i].classList.add('active');
  }, 3000);
})();


// ==========================================
// CARRUSELES INFINITOS (obras y clientes)
// ==========================================
(function(){
  function makeInfinite(gridId, prevId, nextId, gap){
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const originals = Array.from(grid.children);
    const n = originals.length;
    if (n < 2) return;
    // 3 copias: [clones][originales][clones]
    originals.forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden','true'); grid.insertBefore(k, originals[0]); });
    originals.forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden','true'); grid.appendChild(k); });
    const cards = Array.from(grid.children);
    const setW = () => cards[n].offsetLeft - cards[0].offsetLeft;
    const stepW = () => cards[1].offsetLeft - cards[0].offsetLeft;
    function jump(delta){
      const prev = grid.style.scrollSnapType, beh = grid.style.scrollBehavior;
      grid.style.scrollSnapType = 'none'; grid.style.scrollBehavior = 'auto';
      grid.scrollLeft += delta;
      grid.style.scrollSnapType = prev; grid.style.scrollBehavior = beh;
    }
    function init(){ jump(setW() - grid.scrollLeft); }
    let t;
    grid.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const w = setW();
        if (grid.scrollLeft >= 2*w - 2) jump(-w);
        else if (grid.scrollLeft <= w - stepW() * 0.5 - 2 && grid.scrollLeft < w) jump(w);
      }, 120);
    }, { passive: true });
    document.getElementById(prevId)?.addEventListener('click', () => grid.scrollBy({ left: -stepW(), behavior: 'smooth' }));
    document.getElementById(nextId)?.addEventListener('click', () => grid.scrollBy({ left: stepW(), behavior: 'smooth' }));
    window.addEventListener('load', init);
    window.addEventListener('resize', init);
    init();
  }
  makeInfinite('projGrid', 'projPrev', 'projNext', 24);
  makeInfinite('cliGrid', 'cliPrev', 'cliNext', 20);
})();
