/* ============================================
   Option B: "The Gallery Wall" — Interactive Flip Mosaic JS
   ============================================ */

(function () {
  'use strict';

  var hasAnime = typeof anime !== 'undefined';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Staggered mosaic reveal ---
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

    anime({
      targets: '.cda-mosaic__tile',
      opacity: [0, 1],
      scale: [0.95, 1],
      delay: anime.stagger(100, { grid: [4, 3], from: 'center' }),
      duration: 800,
      easing: 'cubicBezier(0.14, 1, 0.34, 1)'
    });
  }

  // --- Sequential breathing (one tile at a time pulses to color) ---
  function initBreathing() {
    if (reducedMotion) return;

    var tiles = document.querySelectorAll('.cda-mosaic__tile');
    if (!tiles.length) return;

    var currentIndex = 0;
    var breathingClass = 'cda-mosaic__tile--breathing';

    function breatheNext() {
      // Remove from previous
      tiles.forEach(function (t) { t.classList.remove(breathingClass); });

      // Add to current
      tiles[currentIndex].classList.add(breathingClass);

      // Animate the scale if anime.js available
      if (hasAnime) {
        anime({
          targets: tiles[currentIndex],
          scale: [1, 1.03, 1],
          duration: 3000,
          easing: 'easeInOutSine'
        });
      }

      currentIndex = (currentIndex + 1) % tiles.length;
    }

    // Start after initial reveal
    setTimeout(function () {
      breatheNext();
      setInterval(breatheNext, 4000);
    }, 2000);
  }

  // --- Hero content entrance ---
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

  // --- Touch device: tap to flip (since hover doesn't work) ---
  function initTouchFlip() {
    if (!('ontouchstart' in window)) return;

    var tiles = document.querySelectorAll('.cda-mosaic__tile');
    tiles.forEach(function (tile) {
      tile.addEventListener('click', function (e) {
        // Toggle a flipped class for touch
        var isFlipped = tile.classList.contains('cda-mosaic__tile--flipped');
        // Unflip all others
        tiles.forEach(function (t) { t.classList.remove('cda-mosaic__tile--flipped'); });
        if (!isFlipped) {
          tile.classList.add('cda-mosaic__tile--flipped');
        }
        e.preventDefault();
      });
    });

    // Add CSS for touch flip state
    var style = document.createElement('style');
    style.textContent = '.cda-mosaic__tile--flipped .cda-mosaic__front { transform: rotateY(-180deg); } .cda-mosaic__tile--flipped .cda-mosaic__back { transform: rotateY(0deg); }';
    document.head.appendChild(style);
  }

  function init() {
    initMosaicReveal();
    initBreathing();
    initHeroContent();
    initTouchFlip();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
