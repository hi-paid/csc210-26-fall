/* ============================================================
   CSC210 — Week 1 SPA Shared Navigation Component
   ============================================================
   Provides sidebar navigation highlighting and SPA-to-SPA
   links.  Vanilla JS — no dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Configuration ---------- */
  // Each SPA registers its own entry here.
  // Update `current` to highlight the active link.
  var SPAS = [
    { id: '00', href: '00-orientation.html',       label: 'Orientation',               time: '~15 min' },
    { id: '01', href: '01-why-binary.html',        label: 'Why Binary?',              time: '~2.5 hr' },
    { id: '02', href: '02-base-conversion.html',   label: 'Converting Between Bases', time: '~1.5 hr' },
    { id: '03', href: '03-signed-integers.html',   label: 'Signed Integers',          time: '~2.0 hr' },
    { id: '04', href: '04-beyond-integers.html',   label: 'Beyond Integers',          time: '~2.5 hr' }
  ];

  /* ---------- Public API ---------- */
  window.SPANav = {
    /**
     * Initialise the sidebar for the current SPA.
     * @param {string} currentId  The id of the active SPA (e.g. '00').
     * @param {string} [sectionIds]  Comma-separated list of section ids for
     *                               intra-SPA sidebar links (optional).
     */
    init: function (currentId, sectionIds) {
      this.highlightCurrent(currentId);
      if (sectionIds) {
        this.buildSectionLinks(sectionIds);
      }
      this.setupScrollSpy();
    },

    /* Highlight the current SPA link in every sidebar. */
    highlightCurrent: function (currentId) {
      var links = document.querySelectorAll('.sp-sidebar__nav a[data-spa]');
      for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('data-spa') === currentId) {
          links[i].classList.add('active');
        }
      }
    },

    /* Build section-level links from a comma-separated id list. */
    buildSectionLinks: function (sectionIds) {
      var container = document.querySelector('.sp-sidebar__sections');
      if (!container) return;
      var ids = sectionIds.split(',');
      var frag = document.createDocumentFragment();
      for (var i = 0; i < ids.length; i++) {
        var id = ids[i].trim();
        var el = document.getElementById(id);
        if (!el) continue;
        var a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = el.textContent.trim().replace(/^.*?—\s*/, '');
        a.className = 'sp-sidebar__nav-link';
        frag.appendChild(a);
      }
      container.appendChild(frag);
    },

    /* Simple scroll-spy for section links. */
    setupScrollSpy: function () {
      var links = document.querySelectorAll('.sp-sidebar__sections a');
      if (!links.length) return;
      var sections = [];
      for (var i = 0; i < links.length; i++) {
        var target = document.querySelector(links[i].getAttribute('href'));
        if (target) sections.push({ el: target, link: links[i] });
      }
      window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        for (var j = sections.length - 1; j >= 0; j--) {
          if (sections[j].el.offsetTop - 100 <= scrollY) {
            for (var k = 0; k < sections.length; k++) sections[k].link.classList.remove('active');
            sections[j].link.classList.add('active');
            break;
          }
        }
      }, { passive: true });
    }
  };

  /* ---------- Auto-initialise if data attribute present ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  function autoInit() {
    var currentId = document.documentElement.getAttribute('data-spa-id');
    var sectionIds = document.documentElement.getAttribute('data-section-ids');
    if (currentId) {
      SPANav.init(currentId, sectionIds);
    }
  }

})();
