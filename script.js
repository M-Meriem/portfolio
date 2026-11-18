/* =========================================================
   THÈME CLAIR / SOMBRE
   ========================================================= */
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

const sunPath  = `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`;
const moonPath = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (themeIcon) themeIcon.innerHTML = dark ? sunPath : moonPath;
  localStorage.setItem('mm-theme', dark ? 'dark' : 'light');
}

// Restaure le thème sauvegardé
applyTheme(localStorage.getItem('mm-theme') === 'dark');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  });
}

/* =========================================================
   NAVBAR : menu mobile + scroll + barre de progression + back-to-top
   ========================================================= */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const burger   = document.getElementById('burger');
const progress = document.getElementById('progress');
const toTop    = document.getElementById('toTop');

// Menu mobile
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// Effets au scroll
if (navbar && progress && toTop) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 500);

    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }, { passive: true });
}

// Retour en haut
if (toTop) {
  toTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* =========================================================
   LIEN ACTIF DANS LA NAVBAR SELON LA SECTION VISIBLE
   ========================================================= */
const sections = [...document.querySelectorAll('main section[id]')];
const navMap = {};

if (navLinks) {
  navLinks.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) navMap[href.slice(1)] = a;
  });
}

if (sections.length && Object.keys(navMap).length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        Object.values(navMap).forEach(a => a.classList.remove('active'));
        const link = navMap[en.target.id];
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => navObserver.observe(s));
}

/* =========================================================
   ANIMATIONS AU DÉFILEMENT (.reveal)
   ========================================================= */
const observer = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      observer.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });

function observeAll() {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* =========================================================
   COMPTEURS ANIMÉS (data-count)
   ========================================================= */
const counters = document.querySelectorAll('[data-count]');

if (counters.length) {
  const cObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));

      const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = cur;
      }, 28);

      cObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => cObserver.observe(c));
}

/* =========================================================
   BARRES DE LANGUES (data-w)
   ========================================================= */
const bars = document.querySelectorAll('.bar i');

if (bars.length) {
  const bObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.width = en.target.dataset.w + '%';
        bObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => bObserver.observe(b));
}

/* =========================================================
   ANNÉE DYNAMIQUE DANS LE FOOTER
   ========================================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   FOOTER — liste "Supports de cours"
   (fallback : liens vers les sections si la liste est vide)
   ========================================================= */
const footerModules = document.getElementById('footerModules');

if (footerModules && footerModules.children.length === 0) {
  footerModules.innerHTML = `
    <li><a href="#accueil">Accueil</a></li>
    <li><a href="#apropos">Présentation</a></li>
    <li><a href="#parcours">Parcours</a></li>
    <li><a href="#contact">Contact</a></li>
  `;
}

/* =========================================================
   INITIALISATION
   ========================================================= */
observeAll();