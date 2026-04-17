# Generator Notes — Suppa M2

## Decisions Made

1. **No Vite build system** — kept vanilla HTML + JS for zero-config browsing. The modular JS files are plain `<script>` tags, not ES modules, to avoid CORS issues when opening `file://` locally.

2. **localStorage and sessionStorage usage**:
   - `suppa_child_name`, `suppa_child_age_band`, `suppa_allergies_csv` → profile hydration
   - `suppa_household_id`, `suppa_child_id` → API calls
   - `suppa_fridge_ingredients` → passed via sessionStorage from fridge → fridge-results (fridge guard enforced)
   - `gap-hint-dismissed-{id}` → 24h dismissal, set in app.js
   - `mode-hint-dismissed` → session-dismissal

3. **API falls back gracefully** — all form submissions try the API but succeed on `catch` so the prototype works without the server running. Toast always fires; navigation happens regardless.

4. **Macro estimates are static demo data** — Today page shows static `~680/1000 kkal` etc. Real calculation would require the logged food_groups_csv + portion + SUPPA.FOOD_GROUP_MACROS. The formula is defined in `js/tokens.js`.

5. **Inline SVG icons** — all navigation and gap-hint icons are inline SVG. No icon library dependency. All decorative icons have `aria-hidden="true"`.

6. **Onboarding form uses multi-step JS** — no page reloads between steps. Back/next state managed in closure. Step 5 uses `form.dispatchEvent(new Event('submit'))` from app.js's onboarding handler.

7. **Fridge-results guard** — `app.js` checks `document.querySelector('[data-fridge-results]')` (attribute on `<html>` in fridge-results.html) and redirects to `fridge.html` if `sessionStorage.getItem('suppa_fridge_ingredients')` is empty.

8. **Settings sign-out** — uses `SUPPA.profile.clear()` + redirect to `index.html`, not `logout` API (prototype).

9. **Internal console** — standalone HTML served by Express as static at `/`. It uses in-memory seed data and posts to the real API when `SUPPA_API_BASE` matches `localhost:8787`. Falls back to in-memory for design review.

## UX follow-ups (Apr 2026)

- Onboarding step 1: city is mandatory; `Lewati` removed. City `<option>` values are explicit. If a device still forces double-tap on `<select>`, consider a combobox component.
- Today: nutrition arcs use `pathLength="100"` + dash offset for consistent left-to-right fill; arc legend mirrors macro row format (`~current / target unit`). FAB uses opaque `#FFB300` + ring + `z-[55]`.
- Log add: photo UI shows upload CTAs first; preview image appears only after a file is chosen (client-side `URL.createObjectURL` only — not sent to API in this prototype).

## Known Limitations (M2 Prototype)

- Auth is fully simulated — no real JWT
- Macro bars show static demo data; real calculation would need aggregation from meal_logs
- Growth chart shows placeholder; would need a charting library (Chart.js) for real rendering
- Meal prep grid slots are interactive stubs (toast feedback only)
- MPASI infant variant (today-infant.html) not built in M2; planned for M3
- Public recipe / print view not built as a separate screen (recipe-detail.html has `window.print()` in share sheet)
