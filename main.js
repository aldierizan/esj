(() => {
  const nav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');

  if (!nav) return;

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

    // Make sure the final nav item becomes active near the very bottom of the page.
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (nearBottom) {
      activeItem = items[items.length - 1];
    }

    setActiveLink(activeItem.link);
  };

  let ticking = false;
  const requestNavUpdate = () => {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setActiveLink(link);

      // Close the mobile menu after choosing a section.
      if (navToggle) navToggle.checked = false;
    });
  });

  window.addEventListener('scroll', requestNavUpdate, { passive: true });
  window.addEventListener('resize', requestNavUpdate);
  window.addEventListener('load', updateActiveNav);
  window.addEventListener('hashchange', updateActiveNav);

  updateActiveNav();
})();
