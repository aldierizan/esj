/* Shared navigation. Gallery interactions are in gallery.js. No libraries or build step required. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.main-nav');
  const menuButton = document.getElementById('nav-menu-button');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const closeMenu = () => {
    header?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    // Closed mobile links must not remain keyboard-focusable.
    if (nav) nav.inert = window.matchMedia('(max-width: 1100px)').matches;
  };
  if (menuButton && header && nav) {
    menuButton.hidden = false;
    menuButton.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.inert = !open && window.matchMedia('(max-width: 1100px)').matches;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && header.classList.contains('menu-open')) {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) closeMenu();
    });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    window.addEventListener('resize', closeMenu);
    closeMenu();
  }

  const homepage = !!document.getElementById('home');
  const cleanAddressBar = () => {
    if (!homepage || !/^https?:$/.test(location.protocol)) return;
    const path = location.pathname.replace(/\/index\.html$/, '/');
    if (location.hash || path !== location.pathname) {
      try { history.replaceState(history.state, '', path + location.search); } catch (_) { /* Local preview fallback. */ }
    }
  };
  const navItems = Array.from(nav?.querySelectorAll('a[href^="#"]:not(.nav-cta)') || [])
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(({ section }) => section);
  const setActiveLink = (selected) => {
    navItems.forEach(({ link }) => {
      const active = link === selected;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const updateActiveNav = () => {
    if (!navItems.length) return;
    const readingLine = window.scrollY + (header?.offsetHeight || 0) + Math.min(innerHeight * .3, 220);
    let active = navItems[0];
    navItems.forEach((item) => {
      const top = item.section.getBoundingClientRect().top + window.scrollY;
      if (top <= readingLine) active = item;
    });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = navItems.at(-1);
    setActiveLink(active.link);
  };
  const scrollToSection = (target, smooth = true) => {
    const top = target.getBoundingClientRect().top + scrollY - (header?.offsetHeight || 0);
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
  };
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (!link.hash) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      closeMenu();
      scrollToSection(target);
      cleanAddressBar();
    });
  });
  const initialHash = location.hash;
  const honorInitialTarget = () => {
    const target = initialHash ? document.getElementById(initialHash.slice(1)) : null;
    if (target) scrollToSection(target, false);
    updateActiveNav();
    cleanAddressBar();
  };
  window.requestAnimationFrame(honorInitialTarget);
  window.addEventListener('load', honorInitialTarget, { once: true });
  let navFrame = 0;
  const requestNavUpdate = () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(() => { updateActiveNav(); navFrame = 0; });
  };
  window.addEventListener('scroll', requestNavUpdate, { passive: true });
  window.addEventListener('resize', requestNavUpdate);

})();
