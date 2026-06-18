/* ==========================================================================
   EightyTwentyVentures — Registration Gate
   localStorage-based access control + Netlify Forms email capture.
   No backend required. Session persists indefinitely until cleared.
   ========================================================================== */

(function () {
  'use strict';

  var KEY = 'etv_access';

  /* ── Storage helpers ─────────────────────────────────────────── */

  function isRegistered() {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  }

  function setRegistered(email) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ email: email, ts: Date.now() }));
    } catch (e) {}
  }

  /* ── Modal control ───────────────────────────────────────────── */

  function getModal() { return document.getElementById('etv-gate-modal'); }

  function showModal(redirectHref) {
    var m = getModal();
    if (!m) return;
    m._redirect = redirectHref || null;
    m.classList.add('open');
    document.body.classList.add('etv-modal-lock');
    setTimeout(function () {
      var inp = m.querySelector('input[type="email"]');
      if (inp) inp.focus();
    }, 120);
  }

  function hideModal() {
    var m = getModal();
    if (!m) return;
    m.classList.remove('open');
    document.body.classList.remove('etv-modal-lock');
  }

  /* ── Post-registration UI update ────────────────────────────── */

  function unlockUI() {
    /* Briefing page: remove lock overlays from teaser cards */
    document.querySelectorAll('.briefing-card.teaser').forEach(function (card) {
      card.classList.add('registered');
    });
    /* Homepage: remove lock overlays from post-cards */
    document.querySelectorAll('.post-card.gated').forEach(function (card) {
      card.classList.add('registered');
    });
  }

  /* ── Form submission ─────────────────────────────────────────── */

  function submitForm(form, email) {
    /* Fire-and-forget to Netlify Forms — access granted regardless */
    var params = new URLSearchParams();
    try {
      new FormData(form).forEach(function (v, k) { params.append(k, v); });
    } catch (e) {
      params.append('form-name', form.getAttribute('name') || 'etv-access');
      params.append('email', email);
    }
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).catch(function () {});
  }

  function handleModalSubmit(e) {
    e.preventDefault();
    var form  = e.target;
    var input = form.querySelector('input[type="email"]');
    var email = (input ? input.value : '').trim();
    if (!email) return;

    /* Disable button briefly to prevent double-submit */
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Granting access...'; }

    submitForm(form, email);
    setRegistered(email);

    var m = getModal();
    var redirect = m ? m._redirect : null;

    hideModal();
    unlockUI();

    /* Navigate to article if a destination was stored */
    if (redirect && redirect !== '#' && redirect !== '' && redirect !== window.location.href) {
      window.location.href = redirect;
    }
  }

  /* ── Intercept gated links ───────────────────────────────────── */

  function gateLinks() {
    document.querySelectorAll('[data-gated]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (isRegistered()) {
          /* Registered: let the link navigate as normal */
          unlockUI();
          return;
        }
        e.preventDefault();
        var href = el.getAttribute('href') || el.getAttribute('data-href') || '';
        showModal(href);
      });
    });
  }

  /* ── Wire existing newsletter signup forms ───────────────────── */
  /* If a user signs up via the newsletter form on index/briefing,
     that also counts as registration for the access gate.         */

  function patchNewsletterForms() {
    document.querySelectorAll('.signup-form').forEach(function (form) {
      form.addEventListener('submit', function () {
        var input = form.querySelector('input[type="email"]');
        var email = input ? input.value.trim() : '';
        if (email) {
          setRegistered(email);
          /* Don't need to unlockUI here — page reload will handle it */
        }
      });
    });
  }

  /* ── Initialise ──────────────────────────────────────────────── */

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    /* Modal wiring */
    var modal = getModal();
    if (modal) {
      var backdrop = modal.querySelector('.etv-modal-backdrop');
      var closeBtn = modal.querySelector('.etv-modal-close');
      var regForm  = modal.querySelector('form');

      if (backdrop) backdrop.addEventListener('click', hideModal);
      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      if (regForm)  regForm.addEventListener('submit', handleModalSubmit);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hideModal();
      });
    }

    patchNewsletterForms();

    if (isRegistered()) {
      unlockUI();
    } else {
      gateLinks();
    }
  }

  init();

  /* ── Public API (for inline usage if ever needed) ────────────── */
  window.ETV = { showModal: showModal, hideModal: hideModal, isRegistered: isRegistered };

})();
