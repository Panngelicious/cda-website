/* ============================================
   Option A: "The Showreel" — Video Hero JS
   ============================================ */

(function () {
  'use strict';

  var hasAnime = typeof anime !== 'undefined';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHeroAnimation() {
    var title = document.querySelector('.cda-hero--showreel .cda-hero__title');
    var subtitle = document.querySelector('.cda-hero--showreel .cda-hero__subtitle');
    var btn = document.querySelector('.cda-hero--showreel .cda-btn');
    var scroll = document.querySelector('.cda-hero--showreel .cda-hero__scroll');

    if (!title) return;

    if (reducedMotion || !hasAnime) {
      [title, subtitle, btn, scroll].forEach(function (el) {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
      return;
    }

    // Sequence: title → subtitle → button → scroll indicator
    anime.timeline({ easing: 'cubicBezier(0.14, 1, 0.34, 1)' })
      .add({
        targets: title,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        delay: 500
      })
      .add({
        targets: subtitle,
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 800
      }, '-=600')
      .add({
        targets: btn,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 800
      }, '-=500')
      .add({
        targets: scroll,
        opacity: [0, 0.7],
        duration: 1000
      }, '-=300');
  }

  function initVideoControls() {
    var video = document.querySelector('.cda-hero__video video');
    var pauseBtn = document.querySelector('[data-cda-video-pause]');

    if (!video || !pauseBtn) return;

    pauseBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        pauseBtn.textContent = '⏸';
      } else {
        video.pause();
        pauseBtn.textContent = '▶';
      }
    });

    // Mark video loaded
    video.addEventListener('canplay', function () {
      var container = video.closest('.cda-hero__video');
      if (container) {
        container.classList.remove('cda-hero__video--loading');
        container.classList.add('cda-hero__video--loaded');
      }
    });
  }

  function init() {
    initHeroAnimation();
    initVideoControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
