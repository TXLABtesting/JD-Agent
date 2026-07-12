# MOCA — Job Description Agent

A faithful React + TypeScript implementation of the **MOCA Job Description Agent**
prototype (Ministry of Cabinet Affairs, UAE), ported from the Claude Design
handoff bundle in `project`.

It is a bilingual (Arabic-default, English), fully RTL-aware, chat-first workspace
for HR / Talent staff to **create, update, transfer and pre-join** job descriptions
grounded in the ministry's official references — with a live document artifact,
approval workflow, records browsing, knowledge base and analytics.

> **Demo / simulation.** As designed, this runs entirely on seeded demo data with a
> simulated agent run. It is **not** connected to a live Oracle Fusion instance —
> the "SIMULATION"/"جاهز للربط مع Oracle" status is intentional.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
```

Google Fonts (Hanken Grotesk, IBM Plex Sans Arabic, IBM Plex Mono) and the
Iconify icon web component load from CDNs referenced in `index.html`; an internet
connection is needed for pixel-perfect fonts/icons. The layout degrades gracefully
to system fonts offline.

## What's implemented

- **Chat-first flows:** Create New JD (straight to the Master-Data request form),
  Existing Employee, Transfer (with new-location cascade + missing-mandate alert),
  Pre-Joining (no employee identity). Free-text composer resolves against the demo
  data (employee/title/status lookups).
- **JD generation:** calm 4-phase progress → grounded unified template (MOCA-1289)
  with editable responsibilities, grade-derived qualifications & competencies,
  confidence + missing-data flags.
- **Document artifact panel**, mandate verification, **approval workflow**
  (submit → manager review → approve; artifact auto-closes and the JD is saved to
  Records), and **Word export** using the official MOCA-1289 template.
- **Views:** Workspace (filtered request lists), Records (Employees / Positions /
  Sectors & Departments + employee profile), Knowledge Base (references + reference
  data), Analytics.
- **Language toggle** (AR⇄EN, full RTL mirroring) and a **4-palette theme switcher**
  (Royal Navy default, Deep Teal, Indigo Mint, Slate Emerald) persisted to
  localStorage.

## Architecture

The prototype's custom `DCLogic` runtime was ported to idiomatic React:

| File | Role |
|------|------|
| `src/store.ts` | Single observable store — all state + flow logic (ported from the prototype's `Component` class). Subscribed via `useSyncExternalStore`. |
| `src/viewModel.ts` | `buildVM(store)` — derives the render-ready view model (ported from `renderVals`). |
| `src/data.ts` | Master data: org tree, approved titles, grades, competencies, role archetypes, employees, requests, KB, themes. |
| `src/i18n.ts` | EN/AR string dictionaries. |
| `src/css.ts` | `css("prop:val;…")` helper that turns the prototype's inline-style strings into React style objects (kept for fidelity). |
| `src/components/` | `Sidebar`, `MessageCard`, `Artifact`, and the screen views (`Views.tsx`). |

The original design source lives in `project/MOCA JD Agent.dc.html`.
