/* ============================================
   CDA Website — Shared JavaScript
   Vanilla JS + Anime.js (CDN loaded)
   Squarespace-portable: no build tools, no imports
   ============================================ */

(function () {
  'use strict';

  // --- Guard: check if anime.js loaded ---
  const hasAnime = typeof anime !== 'undefined';

  // --- Scroll-direction-aware nav (The Line Studio pattern) ---
  function initNav() {
    const nav = document.querySelector('.cda-nav');
    if (!nav) return;

    let lastScroll = 0;
    const threshold = 80;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      // Add solid background after scrolling past hero
      if (currentScroll > 50) {
        nav.classList.add('cda-nav--solid');
      } else {
        nav.classList.remove('cda-nav--solid');
      }

      // Hide on scroll down, show on scroll up
      if (currentScroll > threshold) {
        if (currentScroll > lastScroll) {
          nav.classList.add('cda-nav--hidden');
        } else {
          nav.classList.remove('cda-nav--hidden');
        }
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile toggle
    const toggle = nav.querySelector('.cda-nav__toggle');
    const links = nav.querySelector('.cda-nav__links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('cda-nav__links--open');
      });
    }
  }

  // --- Scroll reveal animations ---
  function initScrollReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.cda-reveal');

    if (reducedMotion || !reveals.length) {
      // Skip animations, show final state
      reveals.forEach(function (el) {
        el.classList.add('cda-reveal--visible');
      });
      return;
    }

    if (hasAnime) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'cubicBezier(0.14, 1, 0.34, 1)'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: CSS transition on intersection
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            entry.target.classList.add('cda-reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      reveals.forEach(function (el) { observer.observe(el); });
    }
  }

  // --- Staggered grid reveal ---
  function initStaggerReveal() {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var containers = document.querySelectorAll('[data-cda-stagger]');

    containers.forEach(function (container) {
      var items = container.querySelectorAll('.cda-reveal-stagger');

      if (reducedMotion || !hasAnime) {
        items.forEach(function (item) {
          item.style.opacity = '1';
          item.style.transform = 'none';
        });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target.querySelectorAll('.cda-reveal-stagger'),
              opacity: [0, 1],
              translateY: [20, 0],
              delay: anime.stagger(100),
              duration: 600,
              easing: 'cubicBezier(0.14, 1, 0.34, 1)'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(container);
    });
  }

  // --- Count-up animation for social proof numbers ---
  function initCountUp() {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var numbers = document.querySelectorAll('[data-cda-count]');

    if (!numbers.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-cda-count'), 10);
          var prefix = el.getAttribute('data-cda-prefix') || '';
          var suffix = el.getAttribute('data-cda-suffix') || '';

          if (reducedMotion || !hasAnime) {
            el.textContent = prefix + target + suffix;
          } else {
            var counter = { value: 0 };
            anime({
              targets: counter,
              value: target,
              duration: 2000,
              easing: 'easeOutExpo',
              round: 1,
              update: function () {
                el.textContent = prefix + counter.value + suffix;
              }
            });
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach(function (el) { observer.observe(el); });
  }

  // --- Duplicate logo track for infinite scroll ---
  function initLogoTicker() {
    var track = document.querySelector('.cda-logos__track');
    if (!track) return;

    // Clone all logos for seamless loop
    var logos = track.innerHTML;
    track.innerHTML = logos + logos;
  }

  // --- Smooth scroll for anchor links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Initialize everything on DOM ready ---
  function init() {
    initNav();
    initScrollReveal();
    initStaggerReveal();
    initCountUp();
    initLogoTicker();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
