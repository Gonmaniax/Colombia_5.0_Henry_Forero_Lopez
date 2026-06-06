/* =============================================
   COLOMBIA 5.0 — JAVASCRIPT
   Funciones:
   - Toggle ES / EN en tiempo real
   - Navbar scroll + hamburguesa
   - Galería con filtros por tema
   - Lightbox para imágenes
   - Fade-in al hacer scroll
   ============================================= */

/* === ESTADO GLOBAL DE IDIOMA === */
let currentLang = 'es'; // idioma inicial: español

/* =============================================
   TOGGLE DE IDIOMA (ES ↔ EN)
   Recorre todos los elementos con data-es / data-en
   y cambia el contenido en tiempo real
   ============================================= */
const langToggle  = document.getElementById('lang-toggle');
const langLabel   = document.getElementById('lang-label');

function applyLanguage(lang) {
  // Selecciona todos los elementos que tienen atributo data-es
  document.querySelectorAll('[data-es]').forEach(el => {
    const text = lang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });

  // Actualiza el atributo lang del html
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';

  // Actualiza el placeholder del buscador
  const search = document.getElementById('glossary-search');
  if (search) {
    search.placeholder = lang === 'es'
      ? '🔍 Buscar término / Search term...'
      : '🔍 Search term / Buscar término...';
  }
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  langLabel.textContent = currentLang === 'es' ? 'EN' : 'ES';
  applyLanguage(currentLang);
});

/* =============================================
   NAVBAR — scroll shadow + hamburguesa mobile
   ============================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

// Sombra al hacer scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// Menú hamburguesa
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Cerrar menú al pulsar un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =============================================
   GALERÍA — filtros por categoría
   ============================================= */
const tabs  = document.querySelectorAll('.gtab');
const cards = document.querySelectorAll('.gcard');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Marca el tab activo
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.getAttribute('data-filter');

    // Muestra u oculta cards según la categoría
    cards.forEach(card => {
      const cat = card.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        card.style.display = '';
        // Pequeña animación de entrada
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* =============================================
   GALERÍA — clic en imagen lleva a la sección
   ============================================= */
cards.forEach(card => {
  card.addEventListener('click', () => {
    const href = card.getAttribute('data-href');
    if (href) {
      // Abre el lightbox primero, luego permite navegar
      const img     = card.querySelector('img');
      const caption = card.querySelector('.gcard-overlay span');
      openLightbox(img.src, caption ? caption.textContent : '');
    }
  });
});

/* =============================================
   LIGHTBOX — abre y cierra imagen ampliada
   ============================================= */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbClose   = document.getElementById('lb-close');

function openLightbox(src, caption) {
  lbImg.src = src;
  lbImg.alt = caption;
  lbCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden'; // bloquea scroll
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Pequeño delay para limpiar el src
  setTimeout(() => { lbImg.src = ''; }, 300);
}

lbClose.addEventListener('click', closeLightbox);

// Cerrar al hacer clic fuera de la imagen
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// Imágenes de tópicos también abren lightbox
document.querySelectorAll('.topic-img img, .topic-imgs-double img, .topic-imgs-stack img, .img-hero-taller img, .moment-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const caption = img.closest('.topic-img, .topic-imgs-double > div, .img-hero-taller, .moment-card')
      ?.querySelector('.img-caption')?.textContent || '';
    openLightbox(img.src, caption);
  });
});

/* =============================================
   GLOSARIO — búsqueda en tiempo real
   ============================================= */
const glossarySearch = document.getElementById('glossary-search');
const glossaryRows   = document.querySelectorAll('#glossary-table tbody tr');

glossarySearch.addEventListener('input', () => {
  const query = glossarySearch.value.toLowerCase().trim();

  glossaryRows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.classList.toggle('hidden', query !== '' && !text.includes(query));
  });
});

/* =============================================
   FADE-IN AL SCROLL (Intersection Observer)
   Activa la clase .visible cuando el elemento
   entra en pantalla
   ============================================= */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // una sola vez
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* =============================================
   NAVBAR — highlight del link activo al scroll
   ============================================= */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = '';
        a.style.background = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--aqua)';
          a.style.background = 'rgba(5,242,219,.08)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObserver.observe(sec));
