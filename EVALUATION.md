# Suppa M2 — Evaluator Report

**Date:** 2026-04-15  
**Milestone:** M2 (full revamp — consumer app, Express backend, internal CRUD console)  
**Evaluator:** automated adversarial review + live API smoke test

---

## Scoring Summary


| Criterion                   | Score       | Notes                                                   |
| --------------------------- | ----------- | ------------------------------------------------------- |
| Functional Correctness      | 4 / 5       | All API endpoints verified; 1 critical bug fixed        |
| Accessibility (WCAG 2.1 AA) | 4 / 5       | 1 major fix applied; no `alert()`, focus traps present  |
| Design Fidelity             | 5 / 5       | Tokens, typography, spacing match Design Brief exactly  |
| Copy & Cultural Resonance   | 5 / 5       | Indonesian throughout, "Mama" address, MPASI-native     |
| Code Quality                | 4 / 5       | Modular JS, split CSS, structured logging, clean schema |
| **Overall**                 | **4.4 / 5** |                                                         |


---

## Bugs Found & Fixed

### CRITICAL — API server wouldn't start

**File:** `api/server.js` line 201  
**Symptom:** `PathError [TypeError]: Missing parameter name at index 6: /api/`*  
**Root cause:** Express 5 / path-to-regexp 8+ no longer accepts bare `*` wildcards in `app.use()` — the wildcard must be a named parameter.  
**Fix applied:**

```diff
- app.use("/api/*", (_req, res) => fail(res, 404, "not found"));
+ app.use("/api/*path", (_req, res) => fail(res, 404, "not found"));
```

**Verified:** `GET /api/health`, `GET /api/children`, `POST /api/meal_logs`, `POST /api/reset` all return correct responses.

---

### MAJOR — Bare `href="#"` on interactive buttons (edukasi-article.html)

**File:** `app/edukasi-article.html` lines 28 and 64  
**Symptom:** Clicking "Bagikan artikel" or "Bagikan ke WhatsApp" scrolled the page to the top before the JS handler could fire; semantically incorrect to use `<a>` for non-navigating actions.  
**Fix applied:** Replaced both `<a href="#">` with `<button type="button">` and removed the now-unnecessary `e.preventDefault()`.

---

## Remaining Known Limitations (non-blocking for M2 prototype)


| ID  | Area       | Description                                                                                         | Priority |
| --- | ---------- | --------------------------------------------------------------------------------------------------- | -------- |
| L01 | Auth       | Sign-up / log-in forms are client-side only; no real session tokens or server-side auth             | P1       |
| L02 | Auth       | Forgot-password flow is stub (check-email page only, no real email send)                            | P1       |
| L03 | Fridge     | Recipe suggestion on `fridge-results.html` is static seed data, not a real recommender              | P2       |
| L04 | Growth     | Growth chart uses a placeholder SVG bar; no real WHO-percentile curve                               | P2       |
| L05 | Meal Prep  | `meal-prep.html` is a full stub with coming-soon copy                                               | P2       |
| L06 | Recipes    | Recipe search is client-side filter over seed data, not full-text search                            | P2       |
| L07 | Log Week   | Weekly log history page shows static cards; no real aggregation from `meal_logs`                    | P2       |
| L08 | Onboarding | Steps 1 / 3–5 are combined into a single-page form; the multi-step wizard UI is a visual simulation | P2       |


---

## Smoke Test Results

```
GET  /api/health         → 200  {"ok":true,"ts":"…"}            ✓
GET  /api/schema         → 200  {schema:{households,children,…}} ✓
GET  /api/children       → 200  [{id:"ch_1",name:"Nara",…}]     ✓
GET  /api/recipes        → 200  [3 seed recipes]                 ✓
POST /api/meal_logs      → 201  {id:"me_…",child_id:"ch_1",…}   ✓
POST /api/reset          → 200  {"ok":true}                      ✓
GET  /api/unknown        → 404  {"error":"unknown entity"}       ✓
```

---

## How to Run

```bash
# 1. Start the API server (port 8787) — run this from a terminal
cd "/Users/ringkasadmin/Alvin Cursor/Suppa/api" && npm start

# 2. Open the consumer app in your browser
open "/Users/ringkasadmin/Alvin Cursor/Suppa/app/index.html"

# 3. Open the internal CRUD console (served by the running API)
open "http://localhost:8787/"
```

Each command is independent. Run #1 first, then #2 and #3 can be opened in any order.

---

*Evaluation complete. No open CRITICAL or MAJOR issues.*