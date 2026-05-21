/*
 * Shared nav behavior:
 *  - frosted top bar (.nav)
 *  - flip contact pill (click to reveal email, again to close, esc to close,
 *    click-outside to close, copy button)
 *  - mobile menu toggle for the hamburger
 */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  /* ── Mobile menu toggle ── */
  const toggle = nav.querySelector('.nav-mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Flip contact pill ── */
  const pill = nav.querySelector('.contact-li');
  if (!pill) return;
  const trigger = pill.querySelector('.contact-pill');
  const copyBtn = pill.querySelector('.cp-copy');
  const emailEl = pill.querySelector('.cp-back > span:first-child');

  function openPill()  { pill.classList.add('is-open'); }
  function closePill() { pill.classList.remove('is-open'); }

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('.cp-copy')) return;
      e.preventDefault();
      pill.classList.toggle('is-open');
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.classList.toggle('is-open');
      }
      if (e.key === 'Escape') closePill();
    });
  }

  if (copyBtn && emailEl) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(emailEl.textContent.trim()).then(() => {
        const prev = copyBtn.innerHTML;
        copyBtn.innerHTML =
          '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = prev;
          copyBtn.classList.remove('copied');
        }, 1800);
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (!pill.contains(e.target)) closePill();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePill();
  });
})();
