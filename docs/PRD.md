# Suppa — Product Requirements Document

**Version:** M2 · April 2026  
**Status:** Approved for Design Brief

---

## 1. Problem Statement

Indonesian mothers raising children aged 0–12 face a specific, underserved gap: they want to feel confident about what their child is eating, but mainstream nutrition tools are either (a) too clinical — requiring precise gram weights, professional vocabulary — or (b) too generic — designed for Western adults on calorie-restriction diets.

The MPASI (Makanan Pendamping ASI) period — roughly 6 months to 2 years — is particularly stressful. Mothers navigate allergy introductions, iron and zinc needs, texture milestones, and constant pressure from family and social media, with little trusted guidance that speaks their language and fits their daily rhythm.

**Suppa's answer:** make nutrition visible without making it clinical. Quick logs that estimate macros. A "rainbow eating" metric that rewards variety. Gap hints that suggest real Indonesian foods. Recipes safety-screened per child. And an educational layer grounded in pediatric nutrition science — always framed as *estimates and guidance*, never diagnosis.

> "Gizi hari ini, lebih jelas." — Today's nutrition, clearer.

---

## 2. User Personas

### Primary: Mama Muda (Urban, First Child)

- **Age:** 25–34, urban Indonesia (Jakarta, Bandung, Surabaya, Medan)
- **Child age:** 6 months – 3 years (active MPASI)
- **Tech profile:** WhatsApp-native, shops on Shopee/Tokopedia, uses Instagram daily, not a "health app" user
- **Pain points:** Anxiety around iron/zinc deficiency, allergy introductions, MPASI textures; confused by contradictory advice; not enough time for elaborate tracking
- **Goal:** Know if her child "got enough" today — quickly, without logging every gram
- **Quote:** *"Aku cuma mau tahu, anak aku hari ini udah makan cukup belum?"*

### Secondary: Mama Senior (Urban, Multiple Children)

- **Age:** 30–40, established household
- **Child age:** 3–10 years (solid foods, school-age concerns)
- **Tech profile:** Comfortable with apps; uses meal prep and planning features; values consistency
- **Pain points:** Managing multiple children's preferences/allergies; keeping variety high as child gets pickier
- **Goal:** Plan meals for the week so nutrition stays consistent without daily reinvention

### Tertiary: Internal Ops / Team

- **Role:** Suppa team members managing recipe library, seed data, and demo household configurations
- **Need:** Fast CRUD access to backend entities (households, children, recipes, meal logs, growth entries) without a production database UI

---

## 3. Design Principles

1. **Estimates, not scores.** Every macro number is prefaced with `~`. Phrasing is always "sekitar" / "perkiraan" — never "exact" or "deficient."
2. **Encouragement, not alarm.** Gap hints surface actionable foods; they never use red warning language. Phrasing: "Zinc minggu ini sedikit rendah" not "ZINC DEFICIENCY."
3. **One tap to log.** The primary CTA on every authenticated screen is the log action. Max 3 taps from landing to a logged meal.
4. **Mama-direct address.** Copy addresses the caregiver as "Mama" or "kamu" — warm, peer-to-peer. Not clinical ("the patient"), not formal ("Ibu").
5. **Weekly pattern over daily perfection.** Disclaim daily numbers; celebrate weekly variety. "Tidak harus sempurna setiap hari."
6. **Non-clinical disclosures always present.** Landing, Today, recipes — disclaimer is always visible but unobtrusive. Never hidden behind 3 clicks.
7. **Indonesian by default.** All copy in Bahasa Indonesia. City/regency select (Indonesia only). Date formats follow local convention.
8. **Accessibility is not optional.** All interactive elements meet WCAG 2.1 AA. No `alert()`. No color-only information. 44px minimum touch targets.

---

## 4. Feature List

### P0 — Core (MVP must-haves)

**F01: Authentication**

- Email + password sign-up and login (min 8 characters)
- Forgot password → email reset flow (demo: check-email → reset-password)
- Session via localStorage token
- Acceptance: user can register, log in, log out, reset password

**F02: Onboarding**

- 5-step wizard: (1) country/city, (2) child name + age band, (3) allergies/dislikes, (4) mindful eating preferences, (5) confirmation
- Inline validation — no `alert()` — `aria-live` error regions
- Skip allowed from step 2 onward
- Posts to API: creates household + child record
- Acceptance: onboarding saves household_id and child_id to localStorage; no browser dialogs

**F03: Today Dashboard**

- Greeting: time-of-day Indonesian salutation + "Mama [child name]"
- Weekly adequacy bar ("Minggu ini sudah cukup baik untuk [child]")
- Daily macro snapshot: energy, protein, carbs, fat — progress bars with `~` prefix, vs age-appropriate reference target
- Estimate disclaimer — always visible, expandable for full text
- Up to 3 gap hint cards (zinc, iron) — each dismissable, persist 24h in localStorage
- Pelangi makan strip — 8 food groups, weekly fill
- Meal ideas horizontal scroll — cards filtered by gap nutrients + child safety
- Contextual mode hint: 17:00–19:00 "Mau masak apa malam ini?" — session-dismissable
- Infant mode (0–5 months): milk-log only, no macro bars
- Child profile pill — tap to see/switch child (stub in M2, real in M3)
- Acceptance: all elements present; disclaimer always visible; gap hints dismissable; greeting updates with real child name from localStorage

**F04: Quick Meal Log**

- Food group selection chips (8 WHO groups + Minum)
- Portion selector: sedikit / sedang / banyak
- Optional meal name text field
- Posts meal_log to API → shows success toast → returns to Today
- Log Feed (for infants): volume + time of breast/formula feed
- Acceptance: log posts to API; toast visible ≥2.8s; no double-submit on back navigation

**F05: Weekly Log History**

- 7-day scrollable bar chart (food groups covered per day)
- Per-day tap expands to logged meals list
- Acceptance: renders from local seed data; no empty state crash

**F06: Recipe Library**

- Browsable list with search + "emphasis" filter tabs: Protein, Iron, Zinc, Karbo, Lemak, All
- Tab navigation: proper `role="tablist"` + `role="tab"` + `aria-selected` + panel association
- Recipe cards: title, macro emphasis pill, safe badge (per child's allergy profile)
- Acceptance: tab switch shows correct panel; keyboard navigation works; safe badge reflects child's allergy chips from localStorage

**F07: Recipe Detail**

- Title, macro line (when present), ingredient list, instructions
- Share sheet: Copy link, Print/PDF, Copy recipe text, Close
- "Revoke share link" visible only for user-created recipes (`?mine=1`)
- Print-friendly view (`public-recipe.html` + `?print=1`)
- Acceptance: share sheet opens/closes correctly; revoke only shown for `?mine=1`

**F08: Add Recipe**

- Title, ingredients (freetext), instructions, macro emphasis selector
- Optional: per-serving macro estimate fields (collapsible)
- Posts to API; success → recipe detail page
- Acceptance: recipe saved to API; macro emphasis pill reflected in library view

**F09: Fridge → Recipes**

- Ingredient chips entry (add/remove)
- "Cari resep" → results page filtered by ingredients
- Deep-link guard: opening fridge-results.html without ingredients in sessionStorage redirects to fridge.html
- Gap boost badge on matching recipes
- Acceptance: empty ingredients shows inline error (no submit); results page never reachable without ingredients

**F10: Settings**

- Household/child profile section — links to editable forms (not placeholder `#`)
- Mindful eating guides: sodium (mg/day) + added sugar (g/day), Reset to defaults
- Growth screen link — wired
- Sign out — clears localStorage, redirects to landing
- Acceptance: every row navigates to a real destination or triggers a real action; no `href="#"` dead links

---

### P1 — Important

**F11: Meal Prep Planner**

- Weekly grid (Mon–Sun × 3 meals)
- Assign recipes to slots
- Print/export option
- Acceptance: grid renders; recipes assignable from library; print view clean

**F12: Growth Tracking**

- Weight + height entry form with date
- Simple timeline chart (mock data rendered)
- WHO weight-for-age / height-for-age reference bands shown as context (not diagnosis)
- Disclaimer: not a clinical assessment
- Acceptance: entry saves to API; chart renders; disclaimer present

**F13: Education Hub (Mode Edukasi)**

- Article list with topic chips (MPASI, Iron, Zinc, Alergi, Vitamin D, etc.)
- Article detail: headers, callout boxes, inline quiz (shame-free)
- IDAI attribution footer
- WhatsApp share button
- Acceptance: topic chips filter list; quiz runs without page reload; disclaimer present

**F14: Public / Share Recipe View**

- Print-friendly standalone page (`public-recipe.html`)
- `?print=1` triggers `window.print()` on load
- Acceptance: page renders without nav chrome; print auto-triggers on param

---

### P2 — Nice-to-have

**F15: Child Profile Quick Switch**

- Tap child pill on Today → bottom sheet listing household children
- Switch updates greeting + all child-specific rendering
- Real in M3 (stub toast in M2)

**F16: Infant Today Variant**

- Separate today-infant.html for 0–5 month age band
- Milk log only: volume + time; no macro bars
- Browse safe recipes strip (age-appropriate, no solids)

**F17: Safety Banner (Profile Updated)**

- Dismissible banner on Today after allergy profile change
- "Profil Dimas diperbarui — resep sudah disesuaikan"
- Session-shown once after settings save

**F18: Forgot Password + Reset Flow**

- Forgot password form → check-email state
- Reset password form with token param
- Demo flow fully navigable

---

## 5. Non-Goals (M2)

- Medical diagnosis, clinical assessment, or supplement dosing recommendations
- National nutrition database with gram-level macro lookups (estimated groups only)
- Real email delivery, real auth tokens, real payment
- Multi-language support (English planned for M3)
- Push notifications or PWA offline mode
- AI-generated recipes or personalized suggestions engine
- Pediatrician integration or telemedicine features

---

## 6. Success Metrics


| Metric                     | Target (M2 demo)                           | How measured             |
| -------------------------- | ------------------------------------------ | ------------------------ |
| Onboarding completion rate | ≥80% of sessions reaching Today            | sessionStorage flag      |
| Daily log action           | ≥1 log per session for returning users     | localStorage log count   |
| Recipe saves               | ≥1 add-recipe per active household         | API meal_logs count      |
| Gap hint interaction       | ≥30% click-through to recipe from gap hint | Link click events        |
| Disclaimer read rate       | ≥15% expand disclaimer                     | Button click events      |
| Crash-free sessions        | 100% (no unhandled JS errors)              | Console error monitoring |


---

## 7. Tech Stack


| Layer          | Choice                                     | Rationale                                                                        |
| -------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| Consumer app   | Static HTML + vanilla JS + Vite build      | Proven in M1; zero framework overhead; fast on low-end Android; easy to hand off |
| Styles         | Split CSS: `tokens.css` + `components.css` | Eliminates 2133-line monolith; cacheable; per-screen additions stay small        |
| Backend API    | Express.js (Node)                          | Replaces bare `http` module; proper router, middleware, error handling           |
| Validation     | Manual schema validation in routes         | No Zod/Joi dependency overhead for simple flat schema                            |
| Logging        | `pino`-style JSON console logs             | Structured; grepped in production; no `console.log`                              |
| Data           | `db.json` flat file                        | No DB dependency for demo/prototype phase; easy to seed and reset                |
| Internal tools | Vanilla JS + enhanced CSS                  | No framework needed for CRUD console; fast to load                               |


---

## 8. Data Model (unchanged from M1)

```
households   { id, name, country, city, created_at }
children     { id, household_id, name, age_band, sex, allergies_csv }
recipes      { id, household_id, title, ingredients_csv, macro_emphasis, total_minutes }
meal_logs    { id, child_id, meal_name, food_groups_csv, portion, logged_at }
growth_entries { id, child_id, recorded_on, weight_kg, height_cm, measurement_type }
```

Age bands: `0-5` · `6-12` · `1-2` · `3-5` · `6-8` · `9-11` · `12`  
Macro emphasis values: `protein` · `iron` · `zinc` · `carbs` · `fat` · `energy`

---

## 9. API Surface (M2)

```
GET    /api/schema
GET    /api/:entity
POST   /api/:entity
PUT    /api/:entity/:id
DELETE /api/:entity/:id
POST   /api/reset
GET    /health
```

All responses: `{ data: ... }` on success, `{ error: "..." }` on failure.  
CORS: `*` for demo environment.

---

## 10. Known Issues from M1 (all fixed in M2)


| #   | Issue                                             | Fix                                                   |
| --- | ------------------------------------------------- | ----------------------------------------------------- |
| 1   | Settings rows use `href="#"`                      | All rows wired to real destinations                   |
| 2   | Onboarding uses `alert()`                         | Replaced with `aria-live` inline errors               |
| 3   | Recipe tabs: no `role="tab"` or panel association | Full ARIA tablist pattern                             |
| 4   | Gear icon is Unicode emoji                        | Replaced with SVG                                     |
| 5   | Food group emojis vary by platform                | Replaced with consistent SVG icons                    |
| 6   | Fridge results page reachable without ingredients | sessionStorage guard + redirect                       |
| 7   | Toast + navigation race (2200ms)                  | Increased to 2800ms                                   |
| 8   | Safety banner never demonstrated                  | Demo path added via `?profile_updated=1`              |
| 9   | Stale "Yours" recipe bait-and-switch              | Add-recipe posts to API; detail loads from API        |
| 10  | Checkbox sizing on disclaimer                     | Custom control with proper sizing                     |
| 11  | Legal footer links are `href="#"`                 | Privacy/Terms pages added (stub content)              |
| 12  | Pelangi tooltip not dismissible on outside click  | Outside click handler added                           |
| 13  | Primary caregiver name omitted in greeting        | `data-child-first` pattern hydrated from localStorage |


