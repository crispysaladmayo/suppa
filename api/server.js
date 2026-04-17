"use strict";

const express = require("express");
const path = require("path");
const fs = require("fs");
const pino = require("pino");

const log = pino({ level: process.env.LOG_LEVEL || "info" });
const PORT = Number(process.env.PORT || 8787);
const DATA_PATH = path.join(__dirname, "db.json");

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Structured request logging
app.use((req, _res, next) => {
  log.info({ method: req.method, path: req.path }, "request");
  next();
});

// ── Schema definition ────────────────────────────────────
const SCHEMA = {
  households: ["id", "name", "country", "city", "created_at"],
  children: ["id", "household_id", "name", "age_band", "sex", "allergies_csv"],
  recipes: ["id", "household_id", "title", "ingredients_csv", "macro_emphasis", "total_minutes"],
  meal_logs: ["id", "child_id", "meal_name", "food_groups_csv", "portion", "logged_at"],
  growth_entries: ["id", "child_id", "recorded_on", "weight_kg", "height_cm", "measurement_type"],
  allergens: ["id", "name", "order"],
};

const VALID_ENTITIES = new Set(Object.keys(SCHEMA));

// ── Seed data ────────────────────────────────────────────
function seedData() {
  return {
    households: [{ id: "hh_1", name: "Keluarga Nanda", country: "ID", city: "Bandung", created_at: "2026-04-01" }],
    children: [{ id: "ch_1", household_id: "hh_1", name: "Nara", age_band: "1-2", sex: "female", allergies_csv: "peanut,egg" }],
    recipes: [
      { id: "rc_1", household_id: "hh_1", title: "Nasi Tim Hati Ayam", ingredients_csv: "hati ayam,nasi,bawang merah,bawang putih", macro_emphasis: "iron", total_minutes: "25" },
      { id: "rc_2", household_id: "hh_1", title: "Bubur Tempe Sapi Cincang", ingredients_csv: "tempe,daging sapi,beras,wortel", macro_emphasis: "zinc", total_minutes: "30" },
      { id: "rc_3", household_id: "hh_1", title: "Sup Bayam Ikan Teri", ingredients_csv: "bayam,ikan teri,bawang putih,tomat", macro_emphasis: "iron", total_minutes: "20" },
    ],
    meal_logs: [
      { id: "ml_1", child_id: "ch_1", meal_name: "Sarapan bubur", food_groups_csv: "grains,protein", portion: "medium", logged_at: "2026-04-15T08:00:00Z" },
      { id: "ml_2", child_id: "ch_1", meal_name: "Makan siang", food_groups_csv: "grains,protein,vegetables", portion: "medium", logged_at: "2026-04-15T12:30:00Z" },
    ],
    growth_entries: [{ id: "gr_1", child_id: "ch_1", recorded_on: "2026-04-01", weight_kg: "10.2", height_cm: "78.1", measurement_type: "standing_height" }],
    allergens: [
      { id: "al_1", name: "Kacang tanah",   order: 1 },
      { id: "al_2", name: "Telur",          order: 2 },
      { id: "al_3", name: "Susu sapi",      order: 3 },
      { id: "al_4", name: "Kedelai",        order: 4 },
      { id: "al_5", name: "Gandum",         order: 5 },
      { id: "al_6", name: "Ikan",           order: 6 },
      { id: "al_7", name: "Udang / seafood",order: 7 },
      { id: "al_8", name: "Kacang pohon",   order: 8 },
    ],
  };
}

// ── DB helpers ───────────────────────────────────────────
function ensureDb() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(seedData(), null, 2), "utf8");
    log.info({ path: DATA_PATH }, "db seeded");
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const seed = seedData();
    return { ...seed, ...parsed };
  } catch (err) {
    log.warn({ err }, "db read failed, returning seed");
    const seeded = seedData();
    fs.writeFileSync(DATA_PATH, JSON.stringify(seeded, null, 2), "utf8");
    return seeded;
  }
}

function writeDb(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2), "utf8");
}

function generateId(entity) {
  const prefix = entity.replace(/[^a-z]/g, "").slice(0, 2) || "id";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 5);
  return `${prefix}_${stamp}${rand}`;
}

function ok(res, statusCode, data) {
  return res.status(statusCode).json({ data });
}

function fail(res, statusCode, message) {
  log.warn({ statusCode, message }, "api error");
  return res.status(statusCode).json({ error: message });
}

// ── Routes ───────────────────────────────────────────────
const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

router.get("/schema", (_req, res) => {
  res.json({ schema: SCHEMA });
});

router.post("/reset", (_req, res) => {
  const seeded = seedData();
  writeDb(seeded);
  log.info("db reset to seed data");
  res.json({ ok: true });
});

// List
router.get("/:entity", (req, res) => {
  const { entity } = req.params;
  if (!VALID_ENTITIES.has(entity)) return fail(res, 404, "unknown entity");
  const db = readDb();
  const rows = db[entity] || [];

  // Optional filter by query param: ?household_id=hh_1
  const filters = { ...req.query };
  const filtered = Object.keys(filters).length
    ? rows.filter((r) => Object.entries(filters).every(([k, v]) => r[k] === v))
    : rows;

  return ok(res, 200, filtered);
});

// Get one
router.get("/:entity/:id", (req, res) => {
  const { entity, id } = req.params;
  if (!VALID_ENTITIES.has(entity)) return fail(res, 404, "unknown entity");
  const db = readDb();
  const record = (db[entity] || []).find((r) => r.id === id);
  if (!record) return fail(res, 404, "record not found");
  return ok(res, 200, record);
});

// Create
router.post("/:entity", (req, res) => {
  const { entity } = req.params;
  if (!VALID_ENTITIES.has(entity)) return fail(res, 404, "unknown entity");
  const payload = req.body;
  if (!payload || typeof payload !== "object") return fail(res, 400, "invalid body");
  const db = readDb();
  const rows = db[entity] || [];
  if (!payload.id) payload.id = generateId(entity);
  if (rows.some((r) => r.id === payload.id)) return fail(res, 409, "id already exists");
  rows.push(payload);
  db[entity] = rows;
  writeDb(db);
  log.info({ entity, id: payload.id }, "record created");
  return ok(res, 201, payload);
});

// Replace
router.put("/:entity/:id", (req, res) => {
  const { entity, id } = req.params;
  if (!VALID_ENTITIES.has(entity)) return fail(res, 404, "unknown entity");
  const payload = req.body;
  if (!payload || typeof payload !== "object") return fail(res, 400, "invalid body");
  const db = readDb();
  const rows = db[entity] || [];
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return fail(res, 404, "record not found");
  rows[idx] = { ...payload, id };
  db[entity] = rows;
  writeDb(db);
  log.info({ entity, id }, "record updated");
  return ok(res, 200, rows[idx]);
});

// Delete
router.delete("/:entity/:id", (req, res) => {
  const { entity, id } = req.params;
  if (!VALID_ENTITIES.has(entity)) return fail(res, 404, "unknown entity");
  const db = readDb();
  const rows = db[entity] || [];
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return fail(res, 404, "record not found");
  db[entity] = next;
  writeDb(db);
  log.info({ entity, id }, "record deleted");
  return ok(res, 200, { deleted: id });
});

app.use("/api", router);

// Static: internal tooling UI
const INTERNAL_DIR = path.join(__dirname, "..", "internal");
app.use("/", express.static(INTERNAL_DIR));

// 404 fallback for API routes
app.use("/api/*path", (_req, res) => fail(res, 404, "not found"));

// Error handler
app.use((err, _req, res, _next) => {
  log.error({ err }, "unhandled error");
  res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  ensureDb();
  log.info({ port: PORT }, "suppa api ready");
  log.info(`  Consumer app: open app/index.html in browser`);
  log.info(`  Internal UI:  http://localhost:${PORT}/`);
  log.info(`  API:          http://localhost:${PORT}/api/`);
});
