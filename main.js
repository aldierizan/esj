(() => {
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');

  if (!nav) return;

  const cleanPath = () => {
    const path = window.location.pathname.replace(/\/index\.html$/, '/');
    return `${path}${window.location.search}`;
  };

  const cleanAddressBar = () => {
    if (window.location.hash || /\/index\.html$/.test(window.location.pathname)) {
      window.history.replaceState(null, '', cleanPath());
    }
  };

  const navLinks = Array.from(
    nav.querySelectorAll('a[href^="#"]:not(.nav-cta)')
  );

  const items = navLinks
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const updateActiveNav = () => {
    const headerHeight = header ? header.offsetHeight : 0;
    const readingLine = window.scrollY + headerHeight + Math.min(window.innerHeight * 0.3, 220);

    let activeItem = items[0];

    for (const item of items) {
      if (item.section.offsetTop <= readingLine) {
        activeItem = item;
      } else {
        break;
      }
    }

    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;

    if (nearBottom) {
      activeItem = items[items.length - 1];
    }

    setActiveLink(activeItem.link);
  };

  const scrollToSection = (target, smooth = true) => {
    if (!target) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // Keep section navigation functional without exposing #section in the URL.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToSection(target, true);
      cleanAddressBar();

      if (navLinks.includes(link)) {
        setActiveLink(link);
      }

      if (navToggle) navToggle.checked = false;
    });
  });

  // If another page links to index.html#gallery, first honor the target,
  // then immediately clean the address bar back to /.
  const initialHash = window.location.hash;
  if (initialHash && initialHash.length > 1) {
    const initialTarget = document.getElementById(initialHash.slice(1));
    if (initialTarget) {
      window.requestAnimationFrame(() => {
        scrollToSection(initialTarget, false);
        updateActiveNav();
        cleanAddressBar();
      });
    } else {
      cleanAddressBar();
    }
  } else {
    cleanAddressBar();
  }

  let ticking = false;
  const requestNavUpdate = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
  };

  window.addEventListener('scroll', requestNavUpdate, { passive: true });
  window.addEventListener('resize', requestNavUpdate);
  window.addEventListener('load', () => {
    updateActiveNav();
    cleanAddressBar();
  });

  updateActiveNav();
})();
