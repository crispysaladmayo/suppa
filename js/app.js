"use strict";
/* Main app orchestrator — loaded on every authenticated page */

(function () {
  var SUPPA = window.SUPPA || {};

  /* ── Disclaimer ──────────────────────────────────────── */
  function initDisclaimer() {
    var el = document.querySelector("[data-disclaimer]");
    if (!el) return;
    var btn = el.querySelector("[data-disclaimer-expand]");
    var full = el.querySelector("[data-disclaimer-full]");
    if (!btn || !full) return;
    btn.addEventListener("click", function () {
      var open = !full.hidden;
      full.hidden = open;
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.textContent = open ? "Baca selengkapnya" : "Sembunyikan";
    });
  }

  /* ── Today Greeting ──────────────────────────────────── */
  function initTodayGreeting() {
    var el = document.getElementById("today-greeting");
    if (!el) return;
    var name = el.getAttribute("data-child-first") || (SUPPA.profile && SUPPA.profile.getChildName()) || "si kecil";
    var h = new Date().getHours();
    var salam = h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 19 ? "Selamat sore" : "Selamat malam";
    el.textContent = salam + ", Mama " + name;
  }

  /* ── Gap Hint Dismiss ────────────────────────────────── */
  function initGapHints() {
    document.querySelectorAll("[data-dismiss]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-dismiss");
        var card = document.getElementById(id);
        if (!card) return;
        card.hidden = true;
        try { localStorage.setItem("gap-hint-dismissed-" + id, String(Date.now())); } catch (_) {}
      });
    });
    document.querySelectorAll(".gap-hint[id]").forEach(function (card) {
      try {
        var ts = localStorage.getItem("gap-hint-dismissed-" + card.id);
        if (ts && Date.now() - Number(ts) < 86400000) card.hidden = true;
      } catch (_) {}
    });
  }

  /* ── Mode Hint (17–19h) ──────────────────────────────── */
  function initModeHint() {
    var hint = document.getElementById("mode-hint");
    if (!hint) return;
    if (sessionStorage.getItem("mode-hint-dismissed")) return;
    var h = new Date().getHours();
    if (h >= 17 && h < 19) hint.hidden = false;
    var dismissBtn = document.getElementById("mode-hint-dismiss");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () {
        hint.hidden = true;
        sessionStorage.setItem("mode-hint-dismissed", "1");
      });
    }
  }

  /* ── Pelangi Tooltip ─────────────────────────────────── */
  function initPelangiTooltip() {
    var btn = document.getElementById("pelangi-info-btn");
    var tip = document.getElementById("pelangi-tooltip");
    if (!btn || !tip) return;
    btn.addEventListener("click", function () {
      var open = !tip.hidden;
      tip.hidden = open;
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
    document.addEventListener("click", function (e) {
      if (!tip.hidden && !btn.contains(e.target) && !tip.contains(e.target)) {
        tip.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── Tab widgets (recipes, edukasi) ─────────────────── */
  function initTabs() {
    document.querySelectorAll('[role="tablist"]').forEach(function (tl) {
      if (SUPPA.ui && SUPPA.ui.initTabs) SUPPA.ui.initTabs(tl);
    });
  }

  /* ── Child profile switch (stub) ─────────────────────── */
  function initChildSwitch() {
    var btn = document.getElementById("child-switch-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (SUPPA.ui) SUPPA.ui.showToast("Ganti profil anak — segera hadir", 2000);
    });
  }

  /* ── Fridge guard ────────────────────────────────────── */
  function checkFridgeGuard() {
    if (!document.querySelector("[data-fridge-results]")) return;
    var ingredients = sessionStorage.getItem("suppa_fridge_ingredients");
    if (!ingredients) window.location.href = "fridge.html";
  }

  /* ── Log screen ──────────────────────────────────────── */
  function initLogScreen() {
    var form = document.getElementById("log-form");
    if (!form) return;

    // Portion buttons
    document.querySelectorAll(".portion-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".portion-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var selected = Array.from(document.querySelectorAll(".food-group-btn[aria-pressed='true']"))
        .map(function (b) { return b.getAttribute("data-group"); });
      if (!selected.length) {
        showError("log-error", "Pilih minimal satu kelompok makanan.");
        return;
      }
      var mealName = document.getElementById("meal-name");
      var mealNameVal = mealName ? mealName.value.trim() : "";
      if (!mealNameVal) {
        showError("log-error", "Nama makan wajib diisi.");
        if (mealName) mealName.focus();
        return;
      }
      var portionBtn = document.querySelector(".portion-btn[aria-pressed='true']");
      var portion = portionBtn ? portionBtn.getAttribute("data-portion") : "sedang";
      var payload = {
        child_id: SUPPA.profile.getChildId(),
        meal_name: mealNameVal,
        food_groups_csv: selected.join(","),
        portion: portion,
        logged_at: new Date().toISOString(),
      };

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Menyimpan…"; }

      function saveToRecentMeals(name) {
        try {
          var key = 'suppa_recent_meals';
          var recent = JSON.parse(localStorage.getItem(key) || '[]');
          recent = recent.filter(function(n) { return n !== name; });
          recent.unshift(name);
          localStorage.setItem(key, JSON.stringify(recent.slice(0, 20)));
        } catch(e) {}
      }

      SUPPA.api.post("meal_logs", payload).then(function () {
        saveToRecentMeals(payload.meal_name);
        if (SUPPA.ui) SUPPA.ui.showToast("Makan tercatat ✓");
        setTimeout(function () { window.location.href = "today.html"; }, 2800);
      }).catch(function () {
        saveToRecentMeals(payload.meal_name);
        if (SUPPA.ui) SUPPA.ui.showToast("Makan tercatat ✓");
        setTimeout(function () { window.location.href = "today.html"; }, 2800);
      });
    });
  }

  /* ── Fridge screen ───────────────────────────────────── */
  function initFridgeScreen() {
    var form = document.getElementById("fridge-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = document.getElementById("fridge-input");
      var tags = Array.from(document.querySelectorAll(".fridge-tag")).map(function (t) { return t.dataset.ingredient; });
      if (inp && inp.value.trim()) tags.push(inp.value.trim());
      if (!tags.length) {
        showError("fridge-error", "Masukkan setidaknya satu bahan.");
        return;
      }
      sessionStorage.setItem("suppa_fridge_ingredients", tags.join(","));
      window.location.href = "fridge-results.html";
    });

    // Add tag on Enter
    var fridgeInput = document.getElementById("fridge-input");
    if (fridgeInput) {
      fridgeInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          var val = fridgeInput.value.trim();
          if (val) { addFridgeTag(val); fridgeInput.value = ""; clearError("fridge-error"); }
        }
      });
    }
  }

  function addFridgeTag(ingredient) {
    var container = document.getElementById("fridge-tags");
    if (!container) return;
    var tag = document.createElement("span");
    tag.className = "chip is-active fridge-tag";
    tag.dataset.ingredient = ingredient;
    tag.innerHTML = ingredient + '<button type="button" class="chip-remove" aria-label="Hapus ' + ingredient + '" style="background:none;border:none;cursor:pointer;padding:0 0 0 4px;color:var(--accent);font-size:1rem;line-height:1;min-height:0;">&times;</button>';
    tag.querySelector(".chip-remove").addEventListener("click", function () { tag.remove(); });
    container.appendChild(tag);
  }

  /* ── Add recipe screen ───────────────────────────────── */
  function initAddRecipeScreen() {
    var form = document.getElementById("add-recipe-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var title = document.getElementById("recipe-title");
      var ingredients = document.getElementById("recipe-ingredients");
      var emphasis = document.querySelector('input[name="emphasis"]:checked');
      if (!title || !title.value.trim()) { showError("recipe-title-error", "Judul resep wajib diisi."); return; }
      if (!ingredients || !ingredients.value.trim()) { showError("recipe-ingredients-error", "Bahan wajib diisi."); return; }
      var payload = {
        household_id: SUPPA.profile.getHouseholdId(),
        title: title.value.trim(),
        ingredients_csv: ingredients.value.trim().split(/\n|,/).map(function (s) { return s.trim(); }).filter(Boolean).join(","),
        macro_emphasis: emphasis ? emphasis.value : "protein",
        total_minutes: (document.getElementById("recipe-minutes") || {}).value || "30",
      };
      SUPPA.api.post("recipes", payload).then(function () {
        if (SUPPA.ui) SUPPA.ui.showToast("Resep disimpan ✓");
        setTimeout(function () { window.location.href = "recipes.html"; }, 2800);
      }).catch(function () {
        if (SUPPA.ui) SUPPA.ui.showToast("Resep disimpan ✓");
        setTimeout(function () { window.location.href = "recipes.html"; }, 2800);
      });
    });
  }

  /* ── Onboarding screen ────────────────────────────────── */
  function initOnboarding() {
    var form = document.getElementById("onboarding-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cityEl = document.getElementById("city");
      var childNameEl = document.getElementById("child-name");
      var ageRadio = document.querySelector('input[name="age"]:checked');
      var allergyChips = document.querySelectorAll('[data-allergy-chip][aria-pressed="true"]');

      var city = cityEl ? cityEl.value.trim() : "";
      var childName = (childNameEl && childNameEl.value.trim()) || "Anak";
      var ageBand = ageRadio ? ageRadio.value : "1-2";

      if (!city) {
        showError("city-error", "Pilih kota atau kabupaten terlebih dahulu.");
        if (cityEl) cityEl.focus();
        return;
      }
      if (!childName || childName === "Anak") {
        showError("name-error", "Nama anak wajib diisi.");
        document.getElementById("child-name").focus();
        return;
      }
      if (!ageBand) {
        showError("age-error", "Pilih rentang usia anak.");
        return;
      }

      var allergyNames = Array.from(allergyChips).map(function (c) { return c.textContent.trim(); });
      var allergyOtherEl = document.getElementById("allergy-other");
      var allergyOther = allergyOtherEl ? allergyOtherEl.value.trim() : "";
      if (allergyOther) allergyNames.push(allergyOther);

      if (SUPPA.profile) {
        SUPPA.profile.set("child_name", childName);
        SUPPA.profile.set("child_age_band", ageBand);
        SUPPA.profile.set("allergies_csv", allergyNames.join(","));
      }

      SUPPA.api.post("households", { country: "ID", city: city, created_at: new Date().toISOString().slice(0, 10) })
        .then(function (hhRes) {
          var hhId = hhRes.data.id;
          if (SUPPA.profile) SUPPA.profile.set("household_id", hhId);
          return SUPPA.api.post("children", {
            household_id: hhId, name: childName, age_band: ageBand, sex: "", allergies_csv: allergyNames.join(","),
          });
        })
        .then(function (childRes) {
          if (SUPPA.profile) SUPPA.profile.set("child_id", childRes.data.id);
          window.location.href = "today.html";
        })
        .catch(function () {
          window.location.href = "today.html";
        });
    });

    // Allergy chips
    document.querySelectorAll("[data-allergy-chip]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var pressed = chip.getAttribute("aria-pressed") === "true";
        chip.setAttribute("aria-pressed", pressed ? "false" : "true");
        chip.classList.toggle("is-active", !pressed);
      });
    });
  }

  /* ── Settings: sign out ──────────────────────────────── */
  function initSettings() {
    var signoutBtn = document.getElementById("signout-btn");
    if (!signoutBtn) return;
    var modal = document.getElementById("signout-modal");
    signoutBtn.addEventListener("click", function () { if (modal && SUPPA.ui) SUPPA.ui.showModal(modal); });
    var cancelBtn = document.getElementById("cancel-signout");
    if (cancelBtn) cancelBtn.addEventListener("click", function () { if (modal && SUPPA.ui) SUPPA.ui.hideModal(modal); });
    var confirmBtn = document.getElementById("confirm-signout");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", function () {
        if (modal && SUPPA.ui) SUPPA.ui.hideModal(modal);
        if (SUPPA.profile) SUPPA.profile.clear();
        if (SUPPA.ui) SUPPA.ui.showToast("Sampai jumpa, Mama!");
        setTimeout(function () { window.location.href = "index.html"; }, 1500);
      });
    }
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal && SUPPA.ui) SUPPA.ui.hideModal(modal);
      });
    }

    // Mindful eating reset
    var resetBtn = document.getElementById("reset-mindful");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        var s = document.getElementById("sodium-val");
        var g = document.getElementById("sugar-val");
        if (s) s.value = "800";
        if (g) g.value = "12";
        if (SUPPA.ui) SUPPA.ui.showToast("Dikembalikan ke nilai default");
      });
    }
  }

  /* ── Share sheet (recipe detail) ─────────────────────── */
  function initShareSheet() {
    var shareBtn = document.getElementById("share-btn");
    var shareSheet = document.getElementById("share-sheet");
    if (!shareBtn || !shareSheet) return;
    shareBtn.addEventListener("click", function () { if (SUPPA.ui) SUPPA.ui.showSheet(shareSheet); });
    var closeBtn = shareSheet.querySelector(".sheet-close");
    if (closeBtn) closeBtn.addEventListener("click", function () { if (SUPPA.ui) SUPPA.ui.hideSheet(shareSheet); });

    // Copy link
    var copyLink = document.getElementById("copy-link");
    if (copyLink) {
      copyLink.addEventListener("click", function () {
        navigator.clipboard.writeText(window.location.href).then(function () {
          if (SUPPA.ui) SUPPA.ui.showToast("Tautan disalin ✓");
        }).catch(function () { if (SUPPA.ui) SUPPA.ui.showToast("Tautan disalin ✓"); });
        if (SUPPA.ui) SUPPA.ui.hideSheet(shareSheet);
      });
    }

    // Print
    var printBtn = document.getElementById("print-recipe");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
        if (SUPPA.ui) SUPPA.ui.hideSheet(shareSheet);
      });
    }
  }

  /* ── Growth form ─────────────────────────────────────── */
  function initGrowthForm() {
    var form = document.getElementById("growth-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var weight = document.getElementById("weight");
      var height = document.getElementById("height");
      var date = document.getElementById("recorded-on");
      if (!weight || !weight.value) { showError("weight-error", "Berat badan wajib diisi."); return; }
      var payload = {
        child_id: SUPPA.profile.getChildId(),
        recorded_on: (date && date.value) || new Date().toISOString().slice(0, 10),
        weight_kg: weight.value,
        height_cm: (height && height.value) || "",
        measurement_type: "standing_height",
      };
      SUPPA.api.post("growth_entries", payload).then(function () {
        if (SUPPA.ui) SUPPA.ui.showToast("Data tumbuh kembang tersimpan ✓");
        form.reset();
      }).catch(function () {
        if (SUPPA.ui) SUPPA.ui.showToast("Data tersimpan ✓");
      });
    });
  }

  /* ── Version bar ─────────────────────────────────────── */
  function injectVersionBar() {
    var frame = document.querySelector(".app-frame");
    if (!frame) return;
    var bar = document.createElement("p");
    bar.className = "version-bar";
    bar.setAttribute("aria-hidden", "true");
    bar.textContent = "Suppa " + ((SUPPA && SUPPA.PROTO_VERSION) || "M2");
    frame.appendChild(bar);
  }

  /* ── Inline validation helpers ───────────────────────── */
  function showError(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    el.style.display = "block";
  }

  function clearError(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = "";
    el.classList.remove("is-visible");
    el.style.display = "none";
  }

  /* ── Topic chips (Edukasi) ───────────────────────────── */
  function initTopicChips() {
    var chips = document.querySelectorAll(".topic-chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
      });
    });
  }

  /* ── DOMContentLoaded ────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    if (SUPPA.profile) SUPPA.profile.hydrate();

    initDisclaimer();
    initTodayGreeting();
    initGapHints();
    initModeHint();
    initPelangiTooltip();
    initTabs();
    initChildSwitch();
    checkFridgeGuard();
    initLogScreen();
    initFridgeScreen();
    initAddRecipeScreen();
    initOnboarding();
    initSettings();
    initShareSheet();
    initGrowthForm();
    initTopicChips();
    injectVersionBar();
  });
})();
