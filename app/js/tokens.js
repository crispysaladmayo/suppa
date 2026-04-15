"use strict";
/* Shared constants */

var SUPPA = window.SUPPA || {};

SUPPA.API_BASE = window.SUPPA_API_BASE || "http://localhost:8787/api";

SUPPA.AGE_BAND_LABELS = {
  "0-5":  "0–5 bulan",
  "6-12": "6–12 bulan",
  "1-2":  "1–2 tahun",
  "3-5":  "3–5 tahun",
  "6-8":  "6–8 tahun",
  "9-11": "9–11 tahun",
  "12":   "12 tahun",
};

SUPPA.MACRO_TARGETS = {
  "0-5":  { energy: 500,  protein: 12, carbs: 60,  fat: 28 },
  "6-12": { energy: 800,  protein: 18, carbs: 105, fat: 35 },
  "1-2":  { energy: 1000, protein: 20, carbs: 130, fat: 40 },
  "3-5":  { energy: 1350, protein: 28, carbs: 175, fat: 50 },
  "6-8":  { energy: 1600, protein: 35, carbs: 220, fat: 55 },
  "9-11": { energy: 1850, protein: 42, carbs: 255, fat: 60 },
  "12":   { energy: 2100, protein: 50, carbs: 290, fat: 70 },
};

SUPPA.FOOD_GROUP_MACROS = {
  "Serealia & Umbi":     { energy: 140, protein: 3,  carbs: 28, fat: 1 },
  "Kacang-kacangan":     { energy: 100, protein: 6,  carbs: 12, fat: 4 },
  "Susu & Produk Susu":  { energy: 80,  protein: 5,  carbs: 8,  fat: 4 },
  "Daging & Ikan":       { energy: 120, protein: 16, carbs: 0,  fat: 6 },
  "Telur":               { energy: 80,  protein: 7,  carbs: 1,  fat: 5 },
  "Sayur Vit A":         { energy: 30,  protein: 2,  carbs: 6,  fat: 0 },
  "Sayur & Buah":        { energy: 40,  protein: 1,  carbs: 9,  fat: 0 },
  "Minyak & Lemak":      { energy: 90,  protein: 0,  carbs: 0,  fat: 10 },
  "Minuman":             { energy: 20,  protein: 0,  carbs: 5,  fat: 0 },
};

SUPPA.PORTION_MULTIPLIERS = { sedikit: 0.6, sedang: 1.0, banyak: 1.5 };

SUPPA.PROTO_VERSION = "M2 · v1.0.0 · 2026-04-15";

window.SUPPA = SUPPA;
