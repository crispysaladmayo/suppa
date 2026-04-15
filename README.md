# Suppa

Indonesian mobile-first child nutrition companion for mothers ("Mama") of children aged 0–12. Helps track daily meals, spot nutritional gaps, and discover MPASI-safe recipes — without clinical language.

---

## What's in this repo

| Folder | What it is |
|---|---|
| `app/` | Consumer webapp — static HTML + vanilla JS, open in browser or deploy to GitHub Pages |
| `api/` | Express.js backend — JSON file persistence, full CRUD for 5 entities |
| `internal/` | Schema CRUD console — served by the API at `http://localhost:8787/` |
| `design/` | Design review HTML files from checkpoint 3 (living design documentation) |
| `docs/` | PRD and Design Brief |

---

## Quick start

### 1. Start the API

```bash
cd api
npm install
npm start
```

Server starts on `http://localhost:8787`. The database (`db.json`) is created and seeded automatically on first run.

### 2. Open the consumer app

Open `app/index.html` directly in your browser, or serve it with any static server:

```bash
npx serve app
```

### 3. Open the internal CRUD console

With the API running, visit `http://localhost:8787/` in your browser.

---

## API endpoints

All routes are prefixed with `/api`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/schema` | Data schema |
| POST | `/api/reset` | Reset to seed data |
| GET | `/api/:entity` | List records (supports `?field=value` filter) |
| GET | `/api/:entity/:id` | Get one record |
| POST | `/api/:entity` | Create record |
| PUT | `/api/:entity/:id` | Replace record |
| DELETE | `/api/:entity/:id` | Delete record |

Entities: `households`, `children`, `recipes`, `meal_logs`, `growth_entries`

---

## Environment variables

Copy `api/.env.example` to `api/.env` and adjust as needed.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8787` | Port the API listens on |
| `LOG_LEVEL` | `info` | Pino log level (`debug`, `info`, `warn`, `error`) |

---

## Tech stack

| Layer | Choice |
|---|---|
| Consumer app | Static HTML, CSS custom properties, vanilla JS (no build step) |
| Backend | Node.js, Express 5, pino structured logging |
| Data | `db.json` flat file (no external DB required) |
| Fonts | Fraunces (display) + Inter (body) via Google Fonts |

---

## Docs

- [`docs/PRD.md`](docs/PRD.md) — Product requirements, personas, feature list P0–P2
- [`docs/DESIGN_BRIEF.md`](docs/DESIGN_BRIEF.md) — Brand tokens, typography, copy voice, accessibility commitments
- [`SPEC.md`](SPEC.md) — Project spec and folder structure
- [`EVALUATION.md`](EVALUATION.md) — M2 evaluation report and smoke test results

---

## Deploy consumer app to GitHub Pages

The `app/` folder is pure static HTML with no build step. To deploy:

1. Go to your repo **Settings → Pages**
2. Set source to **Deploy from a branch**
3. Choose `main` branch, folder `/app`
4. Save — your app will be live at `https://<you>.github.io/<repo>/`

> Note: The app calls `http://localhost:8787/api` by default. For a deployed version, set `window.SUPPA_API_BASE` in a config script before loading `app.js`.

---

*Suppa M2 · Built with Cursor*
