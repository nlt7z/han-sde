(function () {
  const nav = document.querySelector('.site-nav');
  const hamburger = nav && nav.querySelector('.nav-hamburger');
  if (!nav || !hamburger) return;

  function closeMenu() {
    nav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });

  // On mobile, tapping contact pill copies the email
  const pill = nav.querySelector('.contact-pill');
  const emailEl = nav.querySelector('.cp-back > span:first-child');
  const copyBtn = nav.querySelector('.cp-copy');
  if (pill && emailEl && copyBtn) {
    pill.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navigator.clipboard.writeText(emailEl.textContent.trim()).then(() => {
          const prev = copyBtn.innerHTML;
          pill.querySelector('.cp-front').textContent = 'Copied!';
          setTimeout(() => { pill.querySelector('.cp-front').textContent = 'Contact'; }, 2000);
        });
      }
    });
    pill.style.cursor = 'pointer';
  }
})();
