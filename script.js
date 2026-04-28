/* ============================================
   KITTY PUPPY ALLIANCE — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Load HTML Includes, then initialize ---
  const includes = [
    { id: 'nav-include', file: 'nav.html' },
    { id: 'footer-include', file: 'footer.html' },
    { id: 'donate-modal-include', file: 'donate-modal.html' }
  ];

  let loaded = 0;
  const total = includes.filter(inc => document.getElementById(inc.id)).length;

  if (total === 0) {
    initAll();
    return;
  }

  includes.forEach(inc => {
    const el = document.getElementById(inc.id);
    if (!el) return;
    fetch(inc.file)
      .then(res => res.text())
      .then(html => {
        el.outerHTML = html;
        loaded++;
        if (loaded === total) initAll();
      })
      .catch(() => {
        loaded++;
        if (loaded === total) initAll();
      });
  });

  function initAll() {
    initActiveNav();
    initScrollReveal();
    initStickyNav();
    initMobileMenu();
    initFAQ();
    initSmoothScroll();
    initForms();
    initLangToggle();
    initDonateModal();
  }

  // --- Set active nav link based on current page ---
  function initActiveNav() {
    var page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === page) {
        link.classList.add('nav__link--active');
      }
    });
  }

  // --- Scroll-triggered reveals ---
  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(function(el) { revealObserver.observe(el); });
  }

  // --- Sticky nav background ---
  function initStickyNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var handleScroll = function() {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- Mobile menu ---
  function initMobileMenu() {
    var hamburger = document.querySelector('.nav__hamburger');
    var navLinks = document.querySelector('.nav__links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ Accordion ---
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
      var question = item.querySelector('.faq-item__question');
      if (question) {
        question.addEventListener('click', function() {
          var isActive = item.classList.contains('active');
          faqItems.forEach(function(i) { i.classList.remove('active'); });
          if (!isActive) item.classList.add('active');
        });
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  function initSmoothScroll() {
    var nav = document.querySelector('.nav');
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = nav ? nav.offsetHeight : 0;
          var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }

  // --- Contact form handling (Formspree) ---
  function initForms() {
    document.querySelectorAll('.form').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        var originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        }).then(function(res) {
          if (res.ok) {
            btn.textContent = 'Message Sent!';
            btn.style.background = 'var(--accent-sage)';
            setTimeout(function() {
              btn.textContent = originalText;
              btn.style.background = '';
              btn.disabled = false;
              form.reset();
            }, 3000);
          } else {
            btn.textContent = 'Error — try again';
            btn.style.background = '#c0392b';
            setTimeout(function() {
              btn.textContent = originalText;
              btn.style.background = '';
              btn.disabled = false;
            }, 3000);
          }
        }).catch(function() {
          btn.textContent = 'Error — try again';
          btn.style.background = '#c0392b';
          setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
      });
    });
  }

  // --- Form Language Toggle ---
  function initLangToggle() {
    document.querySelectorAll('[data-lang-form]').forEach(function(form) {
      var langBtns = form.querySelectorAll('.form__lang-btn');
      langBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var lang = btn.dataset.lang;
          langBtns.forEach(function(b) { b.classList.remove('selected'); });
          btn.classList.add('selected');

          form.querySelectorAll('[data-' + lang + ']').forEach(function(el) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
            var text = el.getAttribute('data-' + lang);
            if (text) el.textContent = text;
          });

          form.querySelectorAll('[data-' + lang + '-ph]').forEach(function(el) {
            var ph = el.getAttribute('data-' + lang + '-ph');
            if (ph) el.placeholder = ph;
          });
        });
      });
    });
  }

  // --- Donate Popup Modal ---
  function initDonateModal() {
    var donateOverlay = document.getElementById('donateModal');
    var donateClose = document.getElementById('donateClose');
    var donateLater = document.getElementById('donateLater');
    var donateBtn = document.getElementById('donateBtn');
    if (!donateOverlay) return;

    function closeDonateModal() {
      donateOverlay.classList.remove('active');
      document.body.style.overflow = '';
      sessionStorage.setItem('kpa_donate_dismissed', '1');
    }

    function openDonateModal() {
      donateOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    if (donateClose) donateClose.addEventListener('click', closeDonateModal);
    if (donateLater) donateLater.addEventListener('click', closeDonateModal);

    donateOverlay.addEventListener('click', function(e) {
      if (e.target === donateOverlay) closeDonateModal();
    });

    if (!sessionStorage.getItem('kpa_donate_dismissed')) {
      setTimeout(function() {
        if (!sessionStorage.getItem('kpa_donate_dismissed')) {
          openDonateModal();
        }
      }, 12000);
    }
  }

});
