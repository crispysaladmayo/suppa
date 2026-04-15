"use strict";
/* UI helpers: toast, sheet, focus trap, tabs */

var SUPPA = window.SUPPA || {};

/* ── Toast ─────────────────────────────────────────────── */
SUPPA.ui = {
  showToast: function (message, ms) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("toast--show");
    t.setAttribute("role", "status");
    setTimeout(function () { t.classList.remove("toast--show"); }, ms || 2800);
  },

  /* ── Bottom Sheet ────────────────────────────────────── */
  showSheet: function (sheetEl) {
    if (!sheetEl) return;
    sheetEl.hidden = false;
    sheetEl.removeAttribute("hidden");
    SUPPA.ui._trapFocus(sheetEl);
    document.body.style.overflow = "hidden";
    sheetEl.addEventListener("click", function onOverlayClick(e) {
      if (e.target === sheetEl) {
        SUPPA.ui.hideSheet(sheetEl);
        sheetEl.removeEventListener("click", onOverlayClick);
      }
    });
  },

  hideSheet: function (sheetEl) {
    if (!sheetEl) return;
    sheetEl.hidden = true;
    document.body.style.overflow = "";
    SUPPA.ui._releaseFocus();
  },

  /* ── Modal ───────────────────────────────────────────── */
  showModal: function (modalEl) {
    if (!modalEl) return;
    modalEl.hidden = false;
    SUPPA.ui._trapFocus(modalEl);
    document.body.style.overflow = "hidden";
  },

  hideModal: function (modalEl) {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.style.overflow = "";
    SUPPA.ui._releaseFocus();
  },

  /* ── Focus Trap ──────────────────────────────────────── */
  _focusableSelectors: 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
  _previousFocus: null,

  _trapFocus: function (container) {
    SUPPA.ui._previousFocus = document.activeElement;
    var focusable = Array.from(container.querySelectorAll(SUPPA.ui._focusableSelectors));
    if (focusable.length) focusable[0].focus();

    SUPPA.ui._keyHandler = function (e) {
      if (e.key !== "Tab") return;
      var focusables = Array.from(container.querySelectorAll(SUPPA.ui._focusableSelectors));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    SUPPA.ui._escHandler = function (e) {
      if (e.key === "Escape") {
        var sheet = container.closest(".sheet-overlay");
        var modal = container.closest("[role='dialog']");
        if (sheet) SUPPA.ui.hideSheet(sheet);
        else if (modal) SUPPA.ui.hideModal(modal.closest("[hidden]") || modal.parentElement);
      }
    };

    document.addEventListener("keydown", SUPPA.ui._keyHandler);
    document.addEventListener("keydown", SUPPA.ui._escHandler);
  },

  _releaseFocus: function () {
    document.removeEventListener("keydown", SUPPA.ui._keyHandler);
    document.removeEventListener("keydown", SUPPA.ui._escHandler);
    if (SUPPA.ui._previousFocus) SUPPA.ui._previousFocus.focus();
  },

  /* ── Accessible Tab Widget ───────────────────────────── */
  initTabs: function (tablistEl) {
    if (!tablistEl) return;
    var tabs = Array.from(tablistEl.querySelectorAll('[role="tab"]'));

    function activate(tab) {
      tabs.forEach(function (t) {
        t.setAttribute("aria-selected", "false");
        var panelId = t.getAttribute("aria-controls");
        if (panelId) {
          var panel = document.getElementById(panelId);
          if (panel) panel.hidden = true;
        }
      });
      tab.setAttribute("aria-selected", "true");
      var activePanelId = tab.getAttribute("aria-controls");
      if (activePanelId) {
        var activePanel = document.getElementById(activePanelId);
        if (activePanel) activePanel.hidden = false;
      }
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(idx + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(idx - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { activate(next); next.focus(); }
      });
    });
  },
};

window.SUPPA = SUPPA;
