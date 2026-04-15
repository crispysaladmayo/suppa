"use strict";
/* localStorage profile helpers */

var SUPPA = window.SUPPA || {};

SUPPA.profile = {
  getHouseholdId: function () {
    try { return localStorage.getItem("suppa_household_id") || "hh_1"; } catch (_) { return "hh_1"; }
  },
  getChildId: function () {
    try { return localStorage.getItem("suppa_child_id") || "ch_1"; } catch (_) { return "ch_1"; }
  },
  getChildName: function () {
    try { return localStorage.getItem("suppa_child_name") || ""; } catch (_) { return ""; }
  },
  getChildAgeBand: function () {
    try { return localStorage.getItem("suppa_child_age_band") || "1-2"; } catch (_) { return "1-2"; }
  },
  getAllergies: function () {
    try {
      var raw = localStorage.getItem("suppa_allergies_csv") || "";
      return raw ? raw.split(",").map(function (s) { return s.trim().toLowerCase(); }) : [];
    } catch (_) { return []; }
  },
  set: function (key, value) {
    try { localStorage.setItem("suppa_" + key, value); } catch (_) {}
  },
  clear: function () {
    var keys = ["household_id", "child_id", "child_name", "child_age_band", "allergies_csv", "auth_token"];
    keys.forEach(function (k) {
      try { localStorage.removeItem("suppa_" + k); } catch (_) {}
    });
  },
};

/* Hydrate page: replace placeholder names/ages with stored values */
SUPPA.profile.hydrate = function () {
  var name = SUPPA.profile.getChildName();
  var ageBand = SUPPA.profile.getChildAgeBand();
  if (!name) return;

  var ageLabel = (SUPPA.AGE_BAND_LABELS || {})[ageBand] || ageBand;

  function replaceTextNodes(root, from, to) {
    if (!from) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf(from) !== -1) nodes.push(node);
    }
    nodes.forEach(function (n) { n.nodeValue = n.nodeValue.split(from).join(to); });
  }

  var greetingEl = document.getElementById("today-greeting");
  if (greetingEl) greetingEl.setAttribute("data-child-first", name);

  replaceTextNodes(document.body, "Nara", name);
  replaceTextNodes(document.body, "Dimas", name);
  if (ageLabel) replaceTextNodes(document.body, "1–2 tahun", ageLabel);
};

window.SUPPA = SUPPA;
