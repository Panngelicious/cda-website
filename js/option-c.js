/* ============================================
   Option C: "The Canvas" — Dark Immersive Parallax
   Mouse-follow parallax, custom cursor, scramble text
   ============================================ */

(function () {
  'use strict';

  var hasAnime = typeof anime !== 'undefined';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // --- Custom cursor ---
  function initCursor() {
    if (isTouchDevice || reducedMotion) return;

    var cursor = document.querySelector('.cda-cursor');
    if (!cursor) return;

    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var tx = cx;
    var ty = cy;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      cursor.classList.add('cda-cursor--hidden');
    });

    document.addEventListener('mouseenter', function () {
      cursor.classList.remove('cda-cursor--hidden');
    });

    // Smooth follow with lerp
    function updateCursor() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(updateCursor);
    }

    requestAnimationFrame(updateCursor);
  }

  // --- Mouse-follow parallax on floating artwork ---
  function initParallax() {
    if (reducedMotion) return;

    var layers = document.querySelectorAll('.cda-canvas__layer');
    if (!layers.length) return;

    var speeds = [3, -2, 4, -3, 1.5, -2.5, 2];
    var currentX = new Array(layers.length).fill(0);
    var currentY = new Array(layers.length).fill(0);
    var targetX = new Array(layers.length).fill(0);
    var targetY = new Array(layers.length).fill(0);

    if (!isTouchDevice) {
      document.addEventListener('mousemove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;

        layers.forEach(function (_, i) {
          var speed = speeds[i % speeds.length];
          targetX[i] = x * speed * 10;
          targetY[i] = y * speed * 10;
        });
      }, { passive: true });
    } else {
      // Mobile: try gyroscope
      initGyroscope(layers, speeds, targetX, targetY);
    }

    // Smooth lerp animation loop
    function animate() {
      layers.forEach(function (layer, i) {
        currentX[i] += (targetX[i] - currentX[i]) * 0.08;
        currentY[i] += (targetY[i] - currentY[i]) * 0.08;
        layer.style.transform = 'translate3d(' + currentX[i] + 'px, ' + currentY[i] + 'px, 0)';
      });
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // --- Gyroscope for mobile ---
  function initGyroscope(layers, speeds, targetX, targetY) {
    if (typeof DeviceOrientationEvent === 'undefined') return;

    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // We'll add a one-time tap listener to request permission
      document.addEventListener('touchstart', function reqPerm() {
        DeviceOrientationEvent.requestPermission()
          .then(function (state) {
            if (state === 'granted') {
              bindGyroscope(layers, speeds, targetX, targetY);
            }
          })
          .catch(function () { /* Permission denied, fall back to float animation */ });
        document.removeEventListener('touchstart', reqPerm);
      }, { once: true });
    } else {
      bindGyroscope(layers, speeds, targetX, targetY);
    }
  }

  function bindGyroscope(layers, speeds, targetX, targetY) {
    window.addEventListener('deviceorientation', function (e) {
      var x = (e.gamma || 0) / 45; // -1 to 1 range (tilt left/right)
      var y = (e.beta || 0) / 45;  // -1 to 1 range (tilt forward/back)

      // Clamp
      x = Math.max(-1, Math.min(1, x));
      y = Math.max(-1, Math.min(1, y));

      layers.forEach(function (_, i) {
        var speed = speeds[i % speeds.length];
        targetX[i] = x * speed * 8;
        targetY[i] = y * speed * 8;
      });
    }, { passive: true });
  }

  // --- Scramble text animation ---
  function initScrambleText() {
    if (reducedMotion) return;

    var elements = document.querySelectorAll('[data-cda-scramble]');
    if (!elements.length) return;

    var chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    elements.forEach(function (el) {
      var finalText = el.getAttribute('data-cda-scramble');
      var length = finalText.length;
      var iterations = 0;
      var interval;

      // Start scramble after a delay
      setTimeout(function () {
        interval = setInterval(function () {
          el.textContent = finalText.split('').map(function (char, index) {
            if (index < iterations) return finalText[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');

          iterations += 1 / 3;

          if (iterations >= length) {
            clearInterval(interval);
            el.textContent = finalText;
          }
        }, 30);
      }, 800);
    });
  }

  // --- Floating artwork entrance animation ---
  function initLayerEntrance() {
    var layers = document.querySelectorAll('.cda-canvas__layer');
    if (!layers.length) return;

    if (reducedMotion || !hasAnime) {
      layers.forEach(function (layer) {
        layer.style.opacity = '1';
      });
      return;
    }

    // Set initial state
    layers.forEach(function (layer) {
      layer.style.opacity = '0';
    });

    anime({
      targets: '.cda-canvas__layer',
      opacity: [0, 1],
      scale: [0.8, 1],
      delay: anime.stagger(200, { from: 'center' }),
      duration: 1200,
      easing: 'cubicBezier(0.14, 1, 0.34, 1)'
    });
  }

  // --- Hero content entrance ---
  function initHeroContent() {
    var title = document.querySelector('.cda-hero--canvas .cda-hero__title');
    var subtitle = document.querySelector('.cda-hero--canvas .cda-hero__subtitle');
    var btn = document.querySelector('.cda-hero--canvas .cda-btn');

    if (!title) return;

    if (reducedMotion || !hasAnime) {
      [title, subtitle, btn].forEach(function (el) {
        if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
      });
      return;
    }

    [title, subtitle, btn].forEach(function (el) {
      if (el) { el.style.opacity = '0'; }
    });

    anime.timeline({ easing: 'cubicBezier(0.14, 1, 0.34, 1)' })
      .add({
        targets: title,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        delay: 1200
      })
      .add({
        targets: subtitle,
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 800
      }, '-=500')
      .add({
        targets: btn,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 800
      }, '-=400');
  }

  // --- Initialize ---
  function init() {
    initCursor();
    initParallax();
    initScrambleText();
    initLayerEntrance();
    initHeroContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
