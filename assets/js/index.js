/* UniceNotes — site vitrine */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Thème : préférence sauvegardée, sinon celle du système
  var saved = null;
  try { saved = localStorage.getItem('unicenotes-theme'); } catch (e) {}
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.querySelector('.mdi').className = 'mdi ' + (theme === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night');
    var label = document.getElementById('theme-label');
    if (label) label.textContent = theme === 'dark' ? 'Passer en clair' : 'Passer en sombre';
    var icon = document.getElementById('theme-label-icon');
    if (icon) icon.className = 'mdi ' + (theme === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night');
  }
  apply(saved || (mq.matches ? 'dark' : 'light'));
  mq.addEventListener && mq.addEventListener('change', function (e) { if (!saved) apply(e.matches ? 'dark' : 'light'); });

  function toggle() {
    saved = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('unicenotes-theme', saved); } catch (e) {}
    apply(saved);
  }

  // stringToColour : chaque matière garde sa couleur (port de src/utils/color.ts)
  function stringToColour(str) {
    var h = 0, c = '#';
    for (var i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    for (var j = 0; j < 3; j++) {
      var v = (h >> (j * 8)) & 0xff;
      v = Math.round(v + (255 - v) * 0.5);
      c += ('00' + v.toString(16)).slice(-2);
    }
    return c;
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-theme'));
    document.querySelectorAll('[data-toggle-theme]').forEach(function (b) { b.addEventListener('click', toggle); });
    document.querySelectorAll('[data-course]').forEach(function (el) { el.style.background = stringToColour(el.getAttribute('data-course')); });
    document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Apparition au scroll, en cascade dans chaque groupe
    var items = [];
    document.querySelectorAll('[data-reveal]').forEach(function (el) { items.push(el); });
    document.querySelectorAll('[data-reveal-group]').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (el, i) { el.style.setProperty('--d', i * 90 + 'ms'); items.push(el); });
    });
    items.forEach(function (el) { el.classList.add('reveal'); });
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    }
    if (reduce) return;

    // 👋 fait coucou au chargement et au survol
    var wave = document.querySelector('.wave');
    function doWave() {
      wave && wave.animate([
        { transform: 'rotate(0)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(-8deg)' },
        { transform: 'rotate(14deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }
      ], { duration: 1400, easing: 'ease-in-out' });
    }
    setTimeout(doWave, 600);
    var h1 = document.querySelector('.hero h1');
    h1 && h1.addEventListener('mouseenter', doWave);

    // Logo : rotation lente et souple, comme l'écran d'accueil de l'appli
    document.querySelectorAll('.brand img').forEach(function (img) {
      img.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }, { transform: 'rotate(0)' }],
        { duration: 18000, iterations: Infinity, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
    });
  });
})();
