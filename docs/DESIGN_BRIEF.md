# Suppa — Design Brief
**Version:** M2 · April 2026  
**Governs:** All consumer-facing screens and internal tooling UI

---

## 1. Brand Identity

### Name & Wordmark
- **Product name:** Suppa (Indonesian slang for "super" — also echoes *suapan* / "spoonful")
- **Wordmark:** "Suppa" set in Fraunces 600, letter-spacing −0.02em. Always lowercase. Never all-caps.
- **Logo mark:** Soft warm-tinted circle with terracotta accent strokes (SVG asset). Sits left of wordmark in brand lockup.
- **Tagline:** *Gizi hari ini, lebih jelas.* (Today's nutrition, clearer.)

### Brand Personality
- **Warm** — feels like a knowledgeable older sister, not a clinical app
- **Honest** — estimates are estimates; disclaimers are always present but never alarming
- **Grounded** — rooted in real Indonesian food culture, MPASI context, everyday ingredients
- **Calm** — never red-alert. Never shame. Progress, not perfection.

---

## 2. Color System

### Base Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#faf8f5` | Page background — warm off-white |
| `--surface` | `#ffffff` | Card / sheet / input surface |
| `--text-primary` | `#1c1917` | Body copy, headings |
| `--text-secondary` | `#57534e` | Supporting copy, labels |
| `--text-muted` | `#78716c` | Captions, overlines, meta |
| `--border-subtle` | `#e7e5e4` | Card borders, dividers, input borders |

### Accent — Terracotta

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#c45c3e` | Primary buttons, links, active nav, key badges |
| `--accent-hover` | `#a34a32` | Button hover/press state |
| `--accent-tint` | `#fef3f2` | Accent surface tint for info chips, badge bg |
| `--accent-light` | `#f5ddd8` | Selected chip bg, light accent fill |

### Semantic Surfaces (non-alarming)

| Token | Value | Usage |
|---|---|---|
| `--success-soft-bg` | `#ecfdf5` | Positive weekly summary, safe badge bg |
| `--success-soft-text` | `#047857` | Text on success surfaces |
| `--info-soft-bg` | `#fffbeb` | Gap hint bg (zinc, general), callout bg |
| `--info-soft-text` | `#b45309` | Text on info surfaces |
| `--warning-soft-bg` | `#fef9c3` | Gap hint bg (iron, higher urgency) |
| `--warning-soft-text` | `#92400e` | Text on warning-soft surfaces |
| `--error-text` | `#b91c1c` | Form validation errors only |

### Focus & Interaction

| Token | Value | Usage |
|---|---|---|
| `--focus-ring` | `#2563eb` | Keyboard focus outline (2px, offset 2px) |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.08)` | Card elevation |
| `--shadow-sheet` | `0 -4px 24px rgba(0,0,0,0.12)` | Bottom sheet shadow |
| `--shadow-modal` | `0 8px 32px rgba(0,0,0,0.16)` | Modal overlay |

### Color Rules
- **Never** use pure red (#ff0000) for nutrition feedback — use `--info-soft` or `--warning-soft`
- **Never** convey nutrition status by color alone — always pair with text label
- Macro bars use terracotta fill (`--accent`) on `--border-subtle` track, not traffic-light colors
- Gap hints: zinc = info-soft (amber), iron = warning-soft (deeper amber). Both warm, not alarming.

---

## 3. Typography

### Typefaces
| Role | Family | Weight | Source |
|---|---|---|---|
| Display / Wordmark | Fraunces | 600 | Google Fonts (`opsz,wght@9..144,600`) |
| Body / UI | Inter | 400, 500, 600 | Google Fonts (`wght@400;500;600`) |
| Fallbacks | Display: Georgia, serif · Body: system-ui, sans-serif | | |

### Scale

| Token/Class | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `.display` | `clamp(1.75rem, 5vw, 2rem)` | 600 | 1.2 | Fraunces. Landing hero, section titles |
| `.title` | `1.375rem` | 600 | 1.2 | Fraunces. Card headings, screen titles |
| `.heading-sm` | `1.125rem` | 600 | 1.3 | Fraunces. Sub-headings within cards |
| `body` (default) | `1rem` | 400 | 1.5 | Inter. All body copy |
| `.body-strong` | `1rem` | 600 | 1.5 | Inter. Emphasized body copy |
| `.body-muted` | `0.875rem` | 400 | 1.5 | Inter. Supporting copy, descriptions |
| `.overline` | `0.75rem` | 500 | 1.2 | Inter + letter-spacing 0.06em + uppercase. Section headers |
| `.caption` | `0.75rem` | 400 | 1.4 | Inter. Timestamps, meta, disclaimers |
| `.label` | `0.875rem` | 500 | 1.4 | Inter. Form labels, chip text |

### Rules
- Headings always Fraunces; UI chrome always Inter
- Minimum font size on screen: 0.75rem (12px) — captions only
- Body text minimum: 0.875rem (14px) for readability on small screens

---

## 4. Spacing & Layout

### Grid
- **Mobile viewport:** 375px default; centered with `max-width: 480px`
- **Recipe detail only:** `max-width: 720px`
- **Page padding:** `--space-page: 16px` (mobile), `--space-page-md: 24px` (≥480px)
- **8px base unit:** all spacing is multiples of 4 or 8px

### Spacing Tokens

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-card` | `16px` | Cards, sheets |
| `--radius-input` | `10px` | Form inputs, selects, textareas |
| `--radius-btn` | `12px` | Buttons |
| `--radius-chip` | `8px` | Allergy chips, food group chips |
| `--radius-pill` | `9999px` | Badge pills, bottom nav tabs |
| `--radius-circle` | `50%` | Avatars, logo mark |

### Touch Targets
- **Minimum:** 44×44px for all interactive elements
- Bottom nav items: 64px height
- Chips: `min-height: 40px`, `min-width: 44px`

---

## 5. Component Library

### Buttons

| Variant | Background | Text | Usage |
|---|---|---|---|
| `.btn--primary` | `--accent` | `#fff` | Main CTA (log, save, proceed) |
| `.btn--secondary` | `--surface` + 2px accent border | `--accent` | Secondary actions |
| `.btn--ghost` | transparent | `--accent` | Tertiary / navigation links |
| `.btn--destructive` | transparent | `--error-text` | Delete, sign out |
| `.btn--whatsapp` | `#25d366` | `#fff` | WhatsApp share |

Full-width by default on mobile. Auto-width with `width: auto` override.

### Cards

| Variant | Description |
|---|---|
| `.card` | White bg, `--shadow-card`, `--radius-card`, `--space-4` padding |
| `.gap-hint.gap-hint--zinc` | Info-soft bg (amber), dismissible, icon + title + food list + CTA |
| `.gap-hint.gap-hint--iron` | Warning-soft bg (deeper amber), same structure |
| `.meal-idea-card` | Horizontal scroll card: thumb emoji + title + badge row |
| `.article-card` | Education list card: category chip + title + read time |
| `.schema-card` | Internal tools: entity field list |

### Macro Bars

```
.macro-bar
  .macro-bar__head
    .macro-bar__label    (e.g. "Energi")
    .macro-bar__vals     (.macro-bar__tilde "~" + "480 / 800 kkal")
  .macro-bar__track [aria-hidden]
    .macro-bar__fill     (width: % via inline style)
```

- Energy bar: accent fill (`--accent`)
- Protein: success-soft-text fill (`--success-soft-text` green)
- Carbs: info-soft-text fill (amber)
- Fat: `--text-secondary` fill
- Track: `--border-subtle` bg, `--radius-pill`, height 8px
- All bars have `role="group"` + `aria-label="[Nutrient] hari ini"` — text labels mandatory (not color-only)

### Forms

```
.field
  label (required text "optional" in caption below if not required)
  input | select | textarea
  .field__error [aria-live="polite"]
```

- No `alert()` — all validation errors via `aria-live="polite"` regions
- Required fields marked with `aria-required="true"`
- Error text: `--error-text` (#b91c1c), 0.875rem

### Bottom Navigation

3-tab authenticated nav (Today, Masak, Edukasi):
```
nav.bottom-nav[aria-label="Navigasi utama"]
  a[href][aria-current="page" on active]
    svg (icon, aria-hidden)
    text label
```

- Height: 64px + `env(safe-area-inset-bottom)`
- Active: `--accent` fill/stroke
- SVG icons only — no emoji, no Unicode glyphs

### Gap Hint Cards

```
.gap-hint.gap-hint--[zinc|iron]
  button.gap-hint__dismiss [data-dismiss][aria-label]
  .gap-hint__head
    span.gap-hint__icon (SVG, aria-hidden)
    p.gap-hint__title
    span.gap-hint__nutrient (badge)
  ul.gap-hint__foods [aria-label]
    li.gap-hint__food × N
  a.gap-hint__cta
```

Dismiss: hidden for 24h via localStorage key `gap-hint-dismissed-[id]`.

### Bottom Sheet

```
.sheet-overlay [hidden → visible via JS]
  .sheet [role="dialog"][aria-modal="true"][aria-labelledby]
    .sheet__handle
    h2.sheet__title
    .sheet__body
    button.sheet__close [aria-label="Tutup"]
```

Trap focus when open. Close on Escape, backdrop click, or Close button.

### Toast

```
#toast.toast [aria-live="polite"]
  (text content set by JS)
```

Show for 2800ms minimum (up from M1's 2200ms).

### Disclaimer

```
.disclaimer [data-disclaimer]
  span
    "Suppa membagikan ide makanan umum, bukan saran medis."
    button.disclaimer__expand [data-disclaimer-expand][aria-expanded]
      "Baca selengkapnya" / "Sembunyikan"
  .disclaimer__full [hidden] [data-disclaimer-full]
    expanded text
```

Always rendered in DOM. Never hidden entirely.

---

## 6. Navigation Architecture

### Consumer App Routes

```
/ (index.html)           → Landing
/signup.html             → Sign up
/login.html              → Log in
/forgot-password.html    → Forgot password
/reset-password.html     → Reset password (token param)
/onboarding.html         → 5-step onboarding wizard
/today.html              → Today dashboard (post-auth home)
/today-infant.html       → Infant today (0–5 months)
/log-add.html            → Log a meal
/log-feed.html           → Log a feed (infant)
/log-week.html           → Weekly history
/fridge.html             → Fridge ingredient entry
/fridge-results.html     → Fridge recipe results (guarded)
/recipes.html            → Recipe library
/recipe-detail.html      → Recipe detail (id param)
/add-recipe.html         → Add custom recipe
/public-recipe.html      → Print/share-friendly recipe (id param)
/meal-prep.html          → Weekly meal prep planner
/growth.html             → Growth tracking
/edukasi.html            → Education hub
/edukasi-article.html    → Article detail
/settings.html           → Settings (all rows wired)
/privacy.html            → Privacy policy (stub)
/terms.html              → Terms of use (stub)
```

### Internal Tools Route
```
http://localhost:8787/   → CRUD Console
http://localhost:8787/api/... → REST API
```

---

## 7. Copy Voice & Tone Guide

### Voice Pillars
1. **Peer, not professor.** Write as an older sister who knows her nutrition, not a textbook.
2. **Warm, not clinical.** Say "sedikit rendah" not "deficient." Say "membantu" not "diperlukan secara medis."
3. **Direct address.** Use "kamu" and "Mama" — never "Pengguna" or formal "Anda" in UI copy.
4. **Estimates celebrated.** Always "~sekitar" before numbers. Celebrate that any data is better than none.

### Tone by Context

| Context | Tone | Example |
|---|---|---|
| Greeting | Warm, time-sensitive | "Selamat sore, Mama Dimas" |
| Gap hints | Helpful, never alarming | "Zinc minggu ini sedikit rendah — ini makanannya" |
| Disclaimer | Clear, unobtrusive | "Suppa membagikan ide makanan umum, bukan saran medis." |
| Empty states | Encouraging | "Belum ada catatan hari ini — yuk mulai dari satu suapan." |
| Errors | Direct, no blame | "Nama anak belum diisi." |
| Success toasts | Short, celebratory | "Makan tercatat ✓" |
| CTA buttons | Action verbs | "Catat makan" · "Cari resep" · "Simpan" |

### Forbidden Words
Never use in product copy:
- defisiensi / deficient
- diagnosis / diagnosa  
- kurang gizi / malnutrisi (in an alarming frame)
- harus / wajib (implies clinical requirement)
- normal / abnormal (for nutrition status)
- supplement dosing numbers

### Disclaimer Wording (canonical)
Short: *"Suppa membagikan ide makanan umum, bukan saran medis."*  
Full: *"Suppa tidak mendiagnosis atau mengobati kondisi medis. Untuk kekhawatiran MPASI atau alergi, diskusikan dengan dokter anak atau ahli gizi terdaftar."*

---

## 8. Iconography

### Rules
- SVG inline icons only — no emoji in navigation, gap hints, or interactive UI
- All decorative icons: `aria-hidden="true"`
- All meaningful icons: `aria-label` on the parent interactive element
- Consistent 24×24px viewBox, `stroke-width: 2`, `stroke-linecap: round`, `stroke-linejoin: round`
- Icon style: line/outline (Lucide-compatible) — not filled

### Required Icons (navigation + core UI)

| Name | Usage | Lucide ref |
|---|---|---|
| clipboard-list | Today tab | clipboard-list |
| utensils | Masak tab | utensils |
| book-open | Edukasi tab | book-open |
| settings | Settings link in top bar | settings |
| x | Dismiss, close | x |
| chevron-right | Row navigation | chevron-right |
| chevron-left | Back navigation | chevron-left |
| plus | Add action | plus |
| check | Confirm, success | check |
| search | Search input | search |
| trash-2 | Delete action | trash-2 |
| edit-2 | Edit action | edit-2 |
| share-2 | Share action | share-2 |
| printer | Print action | printer |
| info | Tooltip trigger | info |
| trending-up | Growth chart | trending-up |

---

## 9. Accessibility Commitments (WCAG 2.1 AA)

| Requirement | Implementation |
|---|---|
| Color contrast ≥4.5:1 (text) | All text/bg pairs verified against tokens |
| Color contrast ≥3:1 (UI components) | Buttons, input borders, macro bars tested |
| No color-only information | All macro bars + status badges have text labels |
| Keyboard navigation | All interactive elements focusable; tab order logical |
| Focus visible | `--focus-ring` 2px blue outline on all focusable elements |
| ARIA landmarks | `<header>`, `<main>`, `<nav>`, `<footer>` on every page |
| Heading hierarchy | h1 → h2 → h3, no skips |
| Form validation | `aria-live="polite"` error regions; `aria-describedby` on inputs |
| No `alert()` dialogs | All confirmations via inline modal or `aria-live` region |
| Touch targets ≥44px | All buttons, chips, nav items, form controls |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all transitions |
| Bottom sheet focus trap | Focus locked inside sheet when open; Escape closes |
| Tab widget | `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls` |
| Images | All `<img>` with `alt` or `aria-hidden` if decorative |
| Language | `lang="id"` on `<html>`; inline `lang` override on English phrases |

---

## 10. Motion & Animation

```css
/* Transitions — quick and purposeful */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;

/* Micro-interactions */
button hover: background 150ms
toast appear: opacity + translateY 200ms
sheet open:   translateY 250ms ease-out
sheet close:  translateY 200ms ease-in
tab switch:   panel fade 150ms

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
```

No bounce, no spring, no parallax. Animations serve orientation (show/hide), not decoration.

---

## 11. Internal Tools Design

The internal CRUD console targets the Suppa team, not consumers. It uses a clean, utility-first design distinct from the consumer brand.

### Design Tokens (Internal)
- Background: `#f8fafc` (cool-tinted, vs consumer warm)
- Surface: `#ffffff`
- Text: `#0f172a` / `#475569` / `#94a3b8`
- Accent: `#6366f1` (indigo — distinct from consumer terracotta)
- Danger: `#ef4444`
- Border: `#e2e8f0`
- Font: Inter only (no Fraunces)

### Key UX Improvements over M1
1. **Search/filter** across all entities — live as you type
2. **Inline edit** — click a cell to edit in place; Tab to next field; Enter to save
3. **Delete confirm modal** — "Hapus [entity] ini?" with Cancel/Hapus destructive button
4. **Schema panel** collapsed by default — expandable per entity
5. **Toast feedback** on every mutation (Create, Update, Delete, Reset)
6. **Responsive table** — horizontal scroll on mobile with sticky first column
7. **Keyboard shortcuts** shown in footer: `N` = new record, `?` = help

---

## 12. File Organization

### Consumer CSS Architecture
```
app/css/
  tokens.css        ← all CSS custom properties (this brief §2–4)
  components.css    ← shared component styles (§5)
  screens/
    landing.css     ← landing page overrides
    auth.css        ← signup/login/forgot/reset
    onboarding.css  ← wizard steps
    today.css       ← dashboard: macro bars, gap hints, pelangi
    log.css         ← log-add, log-feed, log-week
    fridge.css      ← fridge + results
    recipes.css     ← library, detail, add, public
    prep.css        ← meal prep planner
    growth.css      ← growth chart
    edukasi.css     ← education hub + article
    settings.css    ← settings rows
```

### Consumer JS Architecture
```
app/js/
  tokens.js         ← shared constants (API_BASE, age band labels)
  profile.js        ← localStorage profile read/write
  api.js            ← fetch wrappers: apiGet, apiPost, apiPut, apiDelete
  ui.js             ← showToast, showSheet, hideSheet, focusTrap
  greeting.js       ← initTodayGreeting
  disclaimer.js     ← initDisclaimer
  app.js            ← DOMContentLoaded orchestrator — imports all above
```
