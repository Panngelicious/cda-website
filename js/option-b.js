/* ============================================
   Option B: "The Gallery Wall" — Mosaic Hero JS
   ============================================ */

(function () {
  'use strict';

  var hasAnime = typeof anime !== 'undefined';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initMosaicReveal() {
    var tiles = document.querySelectorAll('.cda-mosaic__tile');
    if (!tiles.length) return;

    if (reducedMotion || !hasAnime) {
      tiles.forEach(function (tile) {
        tile.style.opacity = '1';
        tile.style.transform = 'none';
      });
      return;
    }

    // Staggered reveal of mosaic tiles
    anime({
      targets: '.cda-mosaic__tile',
      opacity: [0, 1],
      scale: [0.95, 1],
      delay: anime.stagger(120, { grid: [4, 3], from: 'center' }),
      duration: 800,
      easing: 'cubicBezier(0.14, 1, 0.34, 1)'
    });
  }

  function initMosaicParallax() {
    if (reducedMotion) return;

    var mosaic = document.querySelector('.cda-mosaic');
    if (!mosaic) return;

    var tiles = mosaic.querySelectorAll('.cda-mosaic__tile');
    var speeds = [];

    // Assign random subtle parallax speed to each tile
    tiles.forEach(function () {
      speeds.push((Math.random() - 0.5) * 8);
    });

    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;

      tiles.forEach(function (tile, i) {
        var speed = speeds[i];
        tile.style.transform = 'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
      });
    }, { passive: true });
  }

  function initHeroContent() {
    var content = document.querySelector('.cda-hero--gallery .cda-hero__content');
    if (!content) return;

    if (reducedMotion || !hasAnime) {
      content.style.opacity = '1';
      return;
    }

    content.style.opacity = '0';

    anime({
      targets: content,
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 1000,
      delay: 800,
      easing: 'cubicBezier(0.14, 1, 0.34, 1)'
    });
  }

  function init() {
    initMosaicReveal();
    initMosaicParallax();
    initHeroContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
