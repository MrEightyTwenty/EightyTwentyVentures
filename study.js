/* AMT interactive study slideshow controller.
   Each .study block contains .study-slide children, a count label,
   prev/next buttons, and a row of dots. Pure vanilla, no deps. */
(function () {
  function initStudy(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.study-slide'));
    if (!slides.length) return;
    var dotsWrap = root.querySelector('.study-dots');
    var countEl = root.querySelector('.study-count');
    var prevBtn = root.querySelector('.study-prev');
    var nextBtn = root.querySelector('.study-next');
    var idx = 0;
    var dots = [];

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'study-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Step ' + (i + 1));
        d.addEventListener('click', function () { go(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
      if (countEl) countEl.textContent = 'Step ' + (idx + 1) + ' / ' + slides.length;
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (nextBtn) nextBtn.disabled = idx === slides.length - 1;
      // Sync any caption elements keyed by data-step (1-indexed)
      root.querySelectorAll('[data-step]').forEach(function (el) {
        var on = parseInt(el.getAttribute('data-step'), 10) === (idx + 1);
        el.hidden = !on;
      });
    }
    function go(i) { idx = Math.max(0, Math.min(slides.length - 1, i)); render(); }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1); });
    render();
  }

  function initAll() {
    document.querySelectorAll('.study').forEach(initStudy);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
