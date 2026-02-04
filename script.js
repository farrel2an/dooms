let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    
    slides[currentSlide].classList.add('active');
}

function changeSlide(n) {
    showSlide(currentSlide + n);
}

// Otomatis ganti gambar setiap 5 detik
setInterval(() => {
    changeSlide(1);
}, 5000);

// Responsive navbar toggle
const siteNav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-list a');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  // close menu when a link is clicked
  navLinks.forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Translation (ID <-> EN)
const translations = {
  'header.running': {
    id: "SELAMAT DATANG - SELAMAT SUKSES <i>(for better viewing experience, use desktop browser)</i>",
    en: "WELCOME - BEST OF LUCK <i>(for better viewing experience, use desktop browser)</i>"
  },
  'nav.home': { id: '★ beranda', en: '★ home' },
  'nav.work': { id: '★ karya', en: '★ work' },
  'nav.about': { id: '★ tentang saya', en: '★ about me' },
  'intro.paragraph': {
    id: 'Saya <strong><u>Farrel Haikal</u></strong>, seorang Graphic Designer yang fokus pada <strong>Brand Identity, Ilustrasi, dan UI Design</strong>. Saya membantu brand menciptakan visual yang berkarakter dan berkesan.',
    en: "I'm <strong><u>Farrel Haikal</u></strong>, a Graphic Designer focused on <strong>Brand Identity, Illustration, and UI Design</strong>. I help brands create distinctive and memorable visuals."
  }
};

const translateBtn = document.querySelector('.translate-btn');

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang]) {
      el.innerHTML = translations[key][lang];
    }
  });
  if (translateBtn) {
    translateBtn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    translateBtn.textContent = lang === 'en' ? 'ID' : 'EN';
    translateBtn.setAttribute('data-lang', lang);
  }
  localStorage.setItem('site_lang', lang);
}

if (translateBtn) {
  const saved = localStorage.getItem('site_lang') || 'id';
  applyLang(saved);
  translateBtn.addEventListener('click', () => {
    const current = translateBtn.getAttribute('data-lang') || 'id';
    const next = current === 'id' ? 'en' : 'id';
    applyLang(next);
  });
}

// Sidebar on scroll (desktop)
const SCROLL_THRESHOLD = 160;
function updateNavbarSidebar() {
  const width = window.innerWidth || document.documentElement.clientWidth;
  if (!siteNav) return;
  if (width < 900) {
    // ensure fully removed on small screens
    siteNav.classList.remove('sidebar-visible');
    siteNav.classList.remove('sidebar');
    document.body.classList.remove('sidebar-active');
    return;
  }
  if (window.scrollY > SCROLL_THRESHOLD && !siteNav.classList.contains('open')) {
    if (!siteNav.classList.contains('sidebar')) {
      siteNav.classList.add('sidebar');
      // trigger slide-in on next frame
      requestAnimationFrame(() => {
        siteNav.classList.add('sidebar-visible');
        document.body.classList.add('sidebar-active');
      });
    } else if (!siteNav.classList.contains('sidebar-visible')) {
      requestAnimationFrame(() => {
        siteNav.classList.add('sidebar-visible');
        document.body.classList.add('sidebar-active');
      });
    }
  } else if (siteNav.classList.contains('sidebar')) {
    // slide out then remove sidebar after transition
    siteNav.classList.remove('sidebar-visible');
    document.body.classList.remove('sidebar-active');
    const onTransEnd = (e) => {
      if (e.propertyName === 'transform') {
        siteNav.classList.remove('sidebar');
        siteNav.removeEventListener('transitionend', onTransEnd);
      }
    };
    siteNav.addEventListener('transitionend', onTransEnd);
  }
}

let scrollTimeout = null;
window.addEventListener('scroll', () => {
  // debounce for performance
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateNavbarSidebar, 50);
});
window.addEventListener('resize', updateNavbarSidebar);
// init
updateNavbarSidebar();