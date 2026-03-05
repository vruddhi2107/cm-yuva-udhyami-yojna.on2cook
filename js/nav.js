/* ============================================================
   ON2COOK × CM-YUVA  |  nav.js
   Self-injects the navbar + sticky CTA bar into every page.
   Place <script src="js/nav.js"></script> as the FIRST child
   of <body> — before any other content.
   ============================================================ */

(function () {
  // ── NAV LINKS ─────────────────────────────────────────────
  // Add / remove pages here; they appear in both desktop + mobile nav.
  const NAV_LINKS = [
    { href: 'index.html',      hi: 'होम',          en: 'Home' },
    { href: 'about.html',      hi: 'हमारे बारे में', en: 'About' },
    { href: 'scheme.html',     hi: 'Scheme',        en: 'Scheme' },
    { href: 'calculator.html', hi: 'Calculator',    en: 'Calculator' },
    { href: 'eligibility.html',hi: 'Eligibility',   en: 'Eligibility' },
    { href: 'faq.html',        hi: 'FAQ',           en: 'FAQ' },
    { href: 'apply.html',      hi: 'Apply करें',    en: 'Apply Now',  cta: true },
  ];

  // ── HELPERS ───────────────────────────────────────────────
  function bi(hi, en, tag = 'span') {
    return `<${tag} class="hi">${hi}</${tag}><${tag} class="en">${en}</${tag}>`;
  }

  function linkHTML(l, extraClass = '') {
    const cls = extraClass + (l.cta ? ' nav-cta' : '');
    return `<a href="${l.href}" class="${cls.trim()}">${bi(l.hi, l.en)}</a>`;
  }

  // ── BUILD NAVBAR ──────────────────────────────────────────
  const desktopLinks = NAV_LINKS.map(l => linkHTML(l, 'nav-link')).join('');
  const mobileLinks  = NAV_LINKS.map(l => linkHTML(l, 'mob-link')).join('');

  const navHTML = `
<nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
  <div class="nav-inner wrap">

    <!-- Logo -->
    <a href="index.html" class="nav-logo" aria-label="CM-YUVA × On2Cook — Home">
      <span class="logo-badge">CM-YUVA</span>
      <span class="logo-x">×</span>
      <span class="logo-brand">On2Cook</span>
    </a>

    <!-- Desktop links -->
    <div class="nav-links" role="menubar">
      ${desktopLinks}
    </div>

    <!-- Controls -->
    <div class="nav-controls">
      <button id="btnLang"  class="nav-icon-btn" aria-label="Toggle language"  onclick="Site.toggleLang()">EN</button>
      <button id="btnTheme" class="nav-icon-btn" aria-label="Toggle dark mode" onclick="Site.toggleTheme()">🌙</button>
      <!-- Hamburger -->
      <button id="navHam" class="nav-ham" aria-label="Open menu" aria-expanded="false" aria-controls="mobMenu">
        <span></span><span></span><span></span>
      </button>
    </div>

  </div>

  <!-- Mobile drawer -->
  <div id="mobMenu" class="mob-menu" role="menu" aria-hidden="true">
    <div class="mob-menu-inner">
      ${mobileLinks}
      <div class="mob-divider"></div>
      <div class="mob-meta">
        <button class="mob-meta-btn" onclick="Site.toggleLang()">
          ${bi('भाषा बदलें', 'Change Language')}
        </button>
        <button class="mob-meta-btn" onclick="Site.toggleTheme()">
          ${bi('Dark Mode', 'Dark Mode')}
        </button>
      </div>
    </div>
  </div>
</nav>

<!-- Sticky CTA bar (shown after 2s via Site.init) -->
<div class="sticky-bar" id="sticky" role="complementary" aria-label="Quick apply">
  <span class="sticky-text">
    ${bi('🚀 Food Business शुरू करें — अभी Apply करें', '🚀 Start Your Food Business — Apply Now')}
  </span>
  <a href="apply.html" class="btn btn-primary btn-sm sticky-btn">
    ${bi('Apply करें', 'Apply Now')}
  </a>
  <button class="sticky-close" aria-label="Dismiss" onclick="this.closest('#sticky').classList.remove('show')">✕</button>
</div>

<style>
/* ── NAVBAR BASE ─────────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  background: var(--c-bg, #fff);
  border-bottom: 1px solid var(--c-rule, rgba(0,0,0,.08));
  box-shadow: 0 1px 12px rgba(0,0,0,.06);
  transition: background .25s, box-shadow .25s;
}
[data-theme="dark"] .navbar {
  background: var(--c-bg, #111);
  box-shadow: 0 1px 12px rgba(0,0,0,.35);
}

.nav-inner {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 8px;
}

/* ── LOGO ────────────────────────────────────────────────── */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  flex-shrink: 0;
  letter-spacing: -.01em;
}
.logo-badge {
  background: var(--c-red, #a31f14);
  color: #fff;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: .06em;
  padding: 3px 7px;
  border-radius: 4px;
  line-height: 1;
}
.logo-x {
  color: var(--c-ink30, #aaa);
  font-size: .85rem;
  font-weight: 400;
}
.logo-brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-ink90, #111);
  font-family: 'Syne', sans-serif;
}

/* ── DESKTOP LINKS ───────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}
.nav-link {
  padding: 6px 11px;
  border-radius: 6px;
  font-size: .82rem;
  font-weight: 500;
  color: var(--c-ink60, #555);
  text-decoration: none;
  transition: background .15s, color .15s;
  white-space: nowrap;
}
.nav-link:hover,
.nav-link.active {
  background: var(--c-surface, #f5f5f5);
  color: var(--c-ink90, #111);
}
.nav-link.active {
  font-weight: 600;
}
.nav-link.nav-cta {
  background: var(--c-red, #a31f14);
  color: #fff !important;
  font-weight: 700;
  padding: 6px 14px;
  margin-left: 6px;
}
.nav-link.nav-cta:hover {
  background: var(--c-red-dark, #821910);
}

/* ── CONTROLS ────────────────────────────────────────────── */
.nav-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 10px;
  flex-shrink: 0;
}
.nav-icon-btn {
  background: none;
  border: 1px solid var(--c-rule, rgba(0,0,0,.1));
  border-radius: 6px;
  padding: 5px 9px;
  font-size: .78rem;
  font-weight: 600;
  color: var(--c-ink70, #444);
  cursor: pointer;
  transition: background .15s, border-color .15s;
  line-height: 1.3;
}
.nav-icon-btn:hover {
  background: var(--c-surface, #f5f5f5);
  border-color: var(--c-ink30, #bbb);
}

/* ── HAMBURGER ───────────────────────────────────────────── */
.nav-ham {
  display: none;          /* shown via media query below */
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  background: none;
  border: 1px solid var(--c-rule, rgba(0,0,0,.1));
  border-radius: 6px;
  cursor: pointer;
}
.nav-ham span {
  display: block;
  height: 2px;
  background: var(--c-ink70, #444);
  border-radius: 2px;
  transition: transform .22s, opacity .22s, width .22s;
  transform-origin: center;
}
/* Open state */
.nav-ham.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-ham.open span:nth-child(2) { opacity: 0; width: 0; }
.nav-ham.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── MOBILE DRAWER ───────────────────────────────────────── */
.mob-menu {
  display: none;          /* block via media query */
  overflow: hidden;
  max-height: 0;
  transition: max-height .32s cubic-bezier(.4,0,.2,1);
  border-top: 1px solid var(--c-rule, rgba(0,0,0,.08));
  background: var(--c-bg, #fff);
}
[data-theme="dark"] .mob-menu {
  background: var(--c-bg, #111);
}
.mob-menu.open {
  max-height: 600px;
}
.mob-menu-inner {
  padding: 10px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mob-link {
  display: block;
  padding: 11px 12px;
  border-radius: 8px;
  font-size: .9rem;
  font-weight: 500;
  color: var(--c-ink70, #444);
  text-decoration: none;
  transition: background .15s, color .15s;
}
.mob-link:hover,
.mob-link.active {
  background: var(--c-surface, #f5f5f5);
  color: var(--c-ink90, #111);
}
.mob-link.active { font-weight: 600; }
.mob-link.nav-cta {
  background: var(--c-red, #a31f14);
  color: #fff !important;
  font-weight: 700;
  text-align: center;
  margin-top: 6px;
}
.mob-link.nav-cta:hover { background: var(--c-red-dark, #821910); }

.mob-divider {
  height: 1px;
  background: var(--c-rule, rgba(0,0,0,.08));
  margin: 10px 0;
}
.mob-meta {
  display: flex;
  gap: 8px;
}
.mob-meta-btn {
  flex: 1;
  padding: 9px 8px;
  border: 1px solid var(--c-rule, rgba(0,0,0,.1));
  border-radius: 8px;
  font-size: .78rem;
  font-weight: 600;
  color: var(--c-ink60, #555);
  background: none;
  cursor: pointer;
  text-align: center;
  transition: background .15s;
}
.mob-meta-btn:hover { background: var(--c-surface, #f5f5f5); }

/* ── STICKY BAR ──────────────────────────────────────────── */
.sticky-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 190;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--c-ink90, #111);
  color: #fff;
  transform: translateY(100%);
  transition: transform .35s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 -4px 24px rgba(0,0,0,.18);
}
.sticky-bar.show { transform: translateY(0); }
.sticky-text {
  flex: 1;
  font-size: .82rem;
  font-weight: 500;
  line-height: 1.35;
  min-width: 0;
}
.sticky-btn { flex-shrink: 0; }
.sticky-close {
  background: none;
  border: none;
  color: rgba(255,255,255,.55);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 6px;
  line-height: 1;
  flex-shrink: 0;
  transition: color .15s;
}
.sticky-close:hover { color: #fff; }

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 860px) {
  .nav-links   { display: none; }
  .nav-ham     { display: flex; }
  .mob-menu    { display: block; }
}
@media (max-width: 480px) {
  .sticky-text { font-size: .75rem; }
  .nav-inner   { height: 54px; }
}
</style>`;

  // ── INJECT ────────────────────────────────────────────────
  // Insert as the very first thing inside <body>.
  document.write(navHTML);

  // ARIA: keep aria-expanded + aria-hidden in sync with open/close.
  // We hook into Site.initNav() by patching it after DOMContentLoaded.
  document.addEventListener('DOMContentLoaded', function patchNav() {
    const ham = document.getElementById('navHam');
    const mob = document.getElementById('mobMenu');
    if (ham && mob) {
      const toggle = function () {
        const isOpen = mob.classList.contains('open');
        ham.setAttribute('aria-expanded', String(!isOpen));
        mob.setAttribute('aria-hidden',   String(isOpen));
      };
      // Observe class mutations so aria stays correct however the menu is toggled.
      new MutationObserver(toggle).observe(mob, { attributes: true, attributeFilter: ['class'] });
    }
    document.removeEventListener('DOMContentLoaded', patchNav);
  });
})();