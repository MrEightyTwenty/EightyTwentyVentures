/* ==========================================================================
   EightyTwentyVentures — Registration Gate v2
   Magic-link access flow. Email captured to Netlify Forms. Token sent via
   Google Workspace SMTP. Access granted by access.html after server-side HMAC verification.
   Session persists in localStorage indefinitely until manually cleared.
   ========================================================================== */

(function () {
  'use strict';

  var KEY           = 'etv_access';
  var SEND_ENDPOINT = '/.netlify/functions/send-token';

  /* Public embed endpoint, same one Buttondown's own <form> action uses.
     No secret here, this is meant to be called from the browser. */
  var BUTTONDOWN_ENDPOINT = 'https://buttondown.com/api/emails/embed-subscribe/EightyTwentyVentures';

  /* ── Storage helpers ─────────────────────────────────────────── */

  function isRegistered () {
    try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
  }

  function setRegistered (email) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ email: email, ts: Date.now() }));
    } catch (e) {}
  }

  /* ── Sanitise for innerHTML ──────────────────────────────────── */

  function escapeHtml (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Modal control ───────────────────────────────────────────── */

  function getModal () { return document.getElementById('etv-gate-modal'); }

  function showModal (redirectHref) {
    var m = getModal();
    if (!m) return;
    m._redirect = redirectHref || null;
    resetModalToFormState(m);
    m.classList.add('open');
    document.body.classList.add('etv-modal-lock');
    setTimeout(function () {
      var inp = m.querySelector('input[type="email"]');
      if (inp) inp.focus();
    }, 120);
  }

  function hideModal () {
    var m = getModal();
    if (!m) return;
    m.classList.remove('open');
    document.body.classList.remove('etv-modal-lock');
  }

  /* ── Modal state: form view ──────────────────────────────────── */

  function resetModalToFormState (modal) {
    var form = modal.querySelector('form');
    var sent = modal.querySelector('.etv-sent-state');
    var err  = modal.querySelector('.etv-form-error');

    if (form) {
      form.style.display = '';
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = false; btn.textContent = 'Get access'; }
    }
    if (sent) sent.style.display = 'none';
    if (err)  err.textContent = '';
  }

  /* ── Modal state: sent view ──────────────────────────────────── */

  function showModalSentState (modal, email) {
    var form = modal.querySelector('form');
    if (form) form.style.display = 'none';

    var sent = modal.querySelector('.etv-sent-state');

    if (!sent) {
      sent = document.createElement('div');
      sent.className = 'etv-sent-state';

      var msg     = document.createElement('p');
      msg.className = 'etv-sent-msg';
      msg.style.cssText = 'margin:0 0 20px;font-size:15px;line-height:1.65;color:#aaaaaa;';

      var resendBtn = document.createElement('button');
      resendBtn.type = 'button';
      resendBtn.className = 'etv-resend-btn';
      resendBtn.textContent = 'Resend link';
      resendBtn.style.cssText = [
        'background:none',
        'border:1px solid #333333',
        'color:#888888',
        'padding:8px 16px',
        'border-radius:3px',
        'cursor:pointer',
        'font-size:13px',
        'margin-right:12px'
      ].join(';');

      var backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'etv-back-btn';
      backBtn.textContent = 'Use a different email';
      backBtn.style.cssText = [
        'background:none',
        'border:none',
        'color:#555555',
        'padding:8px 0',
        'cursor:pointer',
        'font-size:13px',
        'text-decoration:underline'
      ].join(';');

      sent.appendChild(msg);
      sent.appendChild(resendBtn);
      sent.appendChild(backBtn);

      var anchor = form ? form.parentNode : modal.querySelector('.etv-modal-content');
      if (form) {
        form.parentNode.insertBefore(sent, form.nextSibling);
      } else {
        anchor.appendChild(sent);
      }
    }

    /* Update message text */
    var msgEl = sent.querySelector('.etv-sent-msg');
    if (msgEl) {
      msgEl.innerHTML =
        'A link is on its way to <strong style="color:#ffffff;">' +
        escapeHtml(email) +
        '</strong>. Check your inbox. It expires in 30 minutes.';
    }

    sent.style.display = '';

    /* Re-wire buttons by cloning (removes stale listeners) */
    var rb = sent.querySelector('.etv-resend-btn');
    if (rb) {
      var newRb = rb.cloneNode(true);
      rb.parentNode.replaceChild(newRb, rb);
      newRb.addEventListener('click', function () {
        sendMagicLink(email, modal._redirect, null);
      });
    }

    var bb = sent.querySelector('.etv-back-btn');
    if (bb) {
      var newBb = bb.cloneNode(true);
      bb.parentNode.replaceChild(newBb, bb);
      newBb.addEventListener('click', function () {
        resetModalToFormState(modal);
        var inp = modal.querySelector('input[type="email"]');
        if (inp) { inp.value = ''; inp.focus(); }
      });
    }
  }

  /* ── Post-registration UI update ────────────────────────────── */

  function unlockUI () {
    /* Swaps the member wall for the gated body on article pages. */
    if (document.body) document.body.classList.add('etv-member');

    document.querySelectorAll('.briefing-card.teaser').forEach(function (card) {
      card.classList.add('registered');
    });
    document.querySelectorAll('.post-card.gated').forEach(function (card) {
      card.classList.add('registered');
    });
  }

  /* ── Netlify Forms capture (fire-and-forget for list building) ─ */

  function captureToNetlifyForms (form, email) {
    var params = new URLSearchParams();
    try {
      new FormData(form).forEach(function (v, k) { params.append(k, v); });
    } catch (e) {
      params.append('form-name', (form && form.getAttribute('name')) || 'etv-access');
      params.append('email', email);
    }
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).catch(function () {});
  }

  /* ── Buttondown list capture (fire-and-forget) ─────────────────── */
  /* Cross-origin simple POST. mode:'no-cors' means we cannot read the
     response, which is fine, this only ever needs to fire and forget. */

  function subscribeToButtondown (email) {
    var params = new URLSearchParams();
    params.append('email', email);
    fetch(BUTTONDOWN_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).catch(function () {});
  }

  /* ── Send magic link ─────────────────────────────────────────── */

  function sendMagicLink (email, redirect, onError) {
    return fetch(SEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:    email,
        redirect: redirect || '/briefing.html'
      })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.ok) throw new Error(data.error || 'Send failed');
      return true;
    })
    .catch(function (err) {
      console.error('Magic link error:', err);
      if (typeof onError === 'function') onError();
      return false;
    });
  }

  /* ── Modal form submission ───────────────────────────────────── */

  function handleModalSubmit (e) {
    e.preventDefault();

    var form  = e.target;
    var input = form.querySelector('input[type="email"]');
    var email = (input ? input.value : '').trim();
    if (!email) return;

    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending link...'; }

    /* Clear any previous error */
    var errEl = form.querySelector('.etv-form-error');
    if (errEl) errEl.textContent = '';

    var modal    = getModal();
    var redirect = modal ? (modal._redirect || '/briefing.html') : '/briefing.html';

    captureToNetlifyForms(form, email);
    subscribeToButtondown(email);

    sendMagicLink(email, redirect, function () {
      /* On error: restore button, show inline message */
      if (btn) { btn.disabled = false; btn.textContent = 'Get access'; }

      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'etv-form-error';
        errEl.style.cssText = 'margin-top:12px;font-size:13px;color:#e05555;';
        form.appendChild(errEl);
      }
      errEl.textContent = 'Something went wrong. Please try again.';
    })
    .then(function (sent) {
      if (sent) showModalSentState(modal, email);
    });
  }

  /* ── Homepage signup forms ───────────────────────────────────── */
  /* Replaces the form in-place with a sent confirmation message.   */

  function patchNewsletterForms () {
    document.querySelectorAll('.signup-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var input = form.querySelector('input[type="email"]');
        var email = input ? input.value.trim() : '';
        if (!email) return;

        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending link...'; }

        captureToNetlifyForms(form, email);
        subscribeToButtondown(email);

        var back = window.location.pathname.indexOf('/briefings/') === 0
          ? window.location.pathname
          : '/briefing.html';

        sendMagicLink(email, back, function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Read along'; }
        })
        .then(function (sent) {
          if (!sent) return;

          var container = form.parentNode;
          var confirm   = document.createElement('div');
          confirm.className = 'etv-inline-sent';
          confirm.innerHTML =
            '<p style="font-size:15px;line-height:1.65;color:#aaaaaa;margin:0;">' +
            'Link sent to <strong style="color:#ffffff;">' +
            escapeHtml(email) +
            '</strong>. Check your inbox.</p>';

          container.replaceChild(confirm, form);
        });
      });
    });
  }

  /* ── Intercept gated links ───────────────────────────────────── */

  function gateLinks () {
    document.querySelectorAll('[data-gated]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (isRegistered()) { unlockUI(); return; }
        e.preventDefault();
        var href = el.getAttribute('href') || el.getAttribute('data-href') || '';
        showModal(href);
      });
    });
  }

  /* ── Initialise ──────────────────────────────────────────────── */

  function init () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

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

  /* ── Public API ──────────────────────────────────────────────── */
  window.ETV = {
    showModal:     showModal,
    hideModal:     hideModal,
    isRegistered:  isRegistered,
    setRegistered: setRegistered,
    unlockUI:      unlockUI
  };

})();
