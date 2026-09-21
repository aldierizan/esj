/* EJM photo carousel and full-size viewer. No libraries or build step required. */
(() => {
  'use strict';
  const carousel = document.querySelector('[data-carousel]');
  const track = carousel?.querySelector('.gallery-track');
  if (!carousel || !track) return;

  const links = Array.from(track.querySelectorAll('[data-gallery-photo]'));
  const controls = carousel.querySelector('.gallery-controls');
  const previous = carousel.querySelector('[data-direction="previous"]');
  const next = carousel.querySelector('[data-direction="next"]');
  const count = carousel.querySelector('.gallery-counter');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => reducedMotion.matches ? 'instant' : 'smooth';
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

  function updateControls() {
    const maximum = maxScroll();
    if (previous) previous.disabled = track.scrollLeft <= 2 || maximum <= 2;
    if (next) next.disabled = track.scrollLeft >= maximum - 2 || maximum <= 2;
  }
  function scrollTo(left) {
    track.scrollTo({ left: Math.max(0, Math.min(maxScroll(), left)), behavior: scrollBehavior() });
  }
  const scrollPage = (direction) => scrollTo(track.scrollLeft + direction * track.clientWidth * .8);
  previous?.addEventListener('click', () => scrollPage(-1));
  next?.addEventListener('click', () => scrollPage(1));
  if (count) count.textContent = `${links.length} photos`;
  if (controls) controls.hidden = false;
  track.addEventListener('scroll', updateControls, { passive: true });
  track.addEventListener('keydown', (event) => {
    // Photo links keep their normal Enter key / browser behavior.
    if (event.target !== track || event.ctrlKey || event.metaKey || event.altKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') scrollTo(0);
    else if (event.key === 'End') scrollTo(maxScroll());
    else scrollPage(event.key === 'ArrowRight' ? 1 : -1);
  });
  if ('ResizeObserver' in window) new ResizeObserver(updateControls).observe(track);
  else window.addEventListener('resize', updateControls);
  window.addEventListener('load', updateControls, { once: true });
  updateControls();

  // Touch uses native horizontal scrolling. Mouse users can drag the photo strip.
  let drag = null;
  let suppressClick = false;
  let clickTimer;
  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, left: track.scrollLeft, id: event.pointerId, moved: false };
  });
  track.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const movement = event.clientX - drag.x;
    if (!drag.moved && Math.abs(movement) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      track.classList.add('is-dragging');
      track.style.scrollSnapType = 'none';
      track.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    track.scrollLeft = drag.left - movement;
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.moved;
    drag = null;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    track.classList.remove('is-dragging');
    track.style.removeProperty('scroll-snap-type');
    if (moved) {
      suppressClick = true;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { suppressClick = false; }, 350);
    }
    updateControls();
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('lostpointercapture', endDrag);
  // Clear a click-only drag state if its release occurs outside the strip.
  window.addEventListener('pointerup', (event) => { if (drag && !drag.moved) endDrag(event); });
  track.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  const dialog = document.getElementById('gallery-lightbox');
  // Progressive fallback: image links open the original photo without JavaScript/dialog support.
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('#lightbox-image');
  const caption = dialog.querySelector('#lightbox-caption');
  const counter = dialog.querySelector('#lightbox-counter');
  const closeButton = dialog.querySelector('.lightbox-close');
  const imageWrap = dialog.querySelector('.lightbox-image-wrap');
  let current = 0;
  let opener = null;
  let previousOverflow = '';

  function displayPhoto(index) {
    current = (index + links.length) % links.length;
    const source = links[current].querySelector('img');
    image.src = links[current].href;
    image.alt = source.alt;
    caption.textContent = source.alt;
    counter.textContent = `${current + 1} / ${links.length}`;
  }
  function openPhoto(index, trigger) {
    opener = trigger;
    displayPhoto(index);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  }
  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openPhoto(index, link);
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-previous').addEventListener('click', () => displayPhoto(current - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => displayPhoto(current + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Keep Tab/Shift+Tab cycling between viewer controls, rather than browser chrome.
    if (event.key === 'Tab') {
      const buttons = Array.from(dialog.querySelectorAll('button:not([disabled])'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
      return;
    }
    const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    if (key === 'Home') displayPhoto(0);
    else if (key === 'End') displayPhoto(links.length - 1);
    else displayPhoto(current + (key === 'ArrowRight' ? 1 : -1));
    // Escape is handled natively by the modal dialog.
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });

  // One-finger swipe in the viewer; pinch gestures are left to the browser.
  let touchStart = null;
  imageWrap.addEventListener('touchstart', (event) => {
    touchStart = event.touches.length === 1 && (!window.visualViewport || window.visualViewport.scale <= 1)
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : null;
  }, { passive: true });
  imageWrap.addEventListener('touchmove', (event) => {
    if (event.touches.length !== 1) touchStart = null;
  }, { passive: true });
  imageWrap.addEventListener('touchend', (event) => {
    if (!touchStart || !event.changedTouches.length || event.touches.length) { touchStart = null; return; }
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.4) displayPhoto(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  imageWrap.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
})();
