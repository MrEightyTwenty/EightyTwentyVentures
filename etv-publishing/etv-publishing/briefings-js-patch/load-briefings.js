/* ==========================================================
   PASTE THIS BLOCK inside briefing.html's existing <script>
   tag, BEFORE the closing </script> tag and BEFORE the
   category filter code.
   ========================================================== */

/* ── Load published briefings from index.json ────────────── */
(function loadBriefings() {
  var CAT_LABELS = {
    'positioning': 'Positioning &amp; Regime',
    'structure':   'Market Structure',
    'execution':   'Execution',
    'psychology':  'Psychology &amp; Process',
    'macro':       'Macro',
    'cot':         'COT'
  };

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatDate(str) {
    if (!str) return '';
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function wireGating(card) {
    card.addEventListener('click', function (e) {
      var etv = window.ETV;
      if (etv && etv.isRegistered && etv.isRegistered()) return;
      e.preventDefault();
      var href = card.getAttribute('href') || '';
      if (etv && etv.showModal) etv.showModal(href);
    });
  }

  fetch('content/briefings/index.json')
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (articles) {
      if (!Array.isArray(articles) || !articles.length) return;

      var grid       = document.getElementById('briefingGrid');
      var firstTeaser = grid ? grid.querySelector('.briefing-card.teaser') : null;
      if (!grid) return;

      /* Most recent first */
      articles.slice().reverse().forEach(function (a) {
        var cat      = a.cat || 'positioning';
        var label    = CAT_LABELS[cat] || esc(a.category || cat);
        var card     = document.createElement('a');

        card.href      = 'article.html?slug=' + encodeURIComponent(a.slug);
        card.className = 'briefing-card';
        card.setAttribute('data-cat',   cat);
        card.setAttribute('data-gated', '');

        card.innerHTML =
          '<div class="meta">' +
            '<span class="category">' + label + '</span>' +
            '<span class="dot"></span>' +
            '<span class="date">' + formatDate(a.date) + '</span>' +
          '</div>' +
          '<h3>' + esc(a.title) + '</h3>' +
          (a.excerpt ? '<p>' + esc(a.excerpt) + '</p>' : '') +
          '<div class="card-arrow" style="margin-top:12px;font-size:13px;' +
            'color:#2dc89a;letter-spacing:0.04em;">Read &rarr;</div>';

        /* Insert before first teaser; if no teasers, append */
        if (firstTeaser) {
          grid.insertBefore(card, firstTeaser);
        } else {
          grid.appendChild(card);
        }

        wireGating(card);

        /* If already registered, mark as unlocked */
        var etv = window.ETV;
        if (etv && etv.isRegistered && etv.isRegistered()) {
          card.classList.add('registered');
        }
      });
    })
    .catch(function () { /* index not found or empty — teasers remain */ });
})();
