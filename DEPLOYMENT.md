# MOCA — Job Description Agent · IT Handover & Deployment Guide

This package contains the full source of the **MOCA Job Description Agent** web
application, ready for development and deployment. It is a static single-page
application (SPA) — no server runtime is required to host it.

> **Status:** demo / prototype. It runs on seeded mock data and a deterministic
> local "AI" by default (no external calls, no keys). It is **Oracle-ready but not
> Oracle-connected**. See §6 for the seams where real systems plug in.

---

## 1. Technology stack

| Area | Choice |
|------|--------|
| Language | TypeScript |
| UI | React 19 |
| Build tool | Vite 8 |
| Output | Static assets (HTML/CSS/JS) — deploy to any static host or CDN |
| Lint | oxlint |
| Optional AI SDK | `@anthropic-ai/sdk` (lazy-loaded; only bundled if the Claude provider is selected) |

No backend, database, or server process is required to run the app as delivered.

---

## 2. Prerequisites

- **Node.js 20+** (built and tested on Node 22) and **npm 10+**.
- Internet access at **build time** only for `npm install`.
- At **runtime**, the app loads Google Fonts + the Iconify icon web component from
  public CDNs (see §5). For an air-gapped/offline deployment, self-host these (§5).

---

## 3. Local development

```bash
npm install        # install dependencies
npm run dev        # dev server with hot reload → http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc) + production build → ./dist
npm run preview    # serve the production build locally to verify
npm run lint       # oxlint
```

A prebuilt production bundle is included in **`dist/`** for convenience, but IT
should rebuild from source (`npm run build`) as part of the pipeline.

---

## 4. Production build & deployment

```bash
npm ci             # clean, reproducible install from package-lock.json
npm run build      # emits ./dist  (static files)
```

Deploy the contents of **`dist/`** to any static host. It is a single-page app; a
few common targets:

**Nginx** (self-hosted / on-prem):
```nginx
server {
  listen 80;
  server_name jd-agent.example.gov.ae;
  root /var/www/jd-agent;          # contents of dist/
  index index.html;
  location / {
    try_files $uri /index.html;    # SPA fallback
  }
}
```

**Apache** — drop `dist/` in the web root; add a fallback to `index.html` via
`.htaccess` (`FallbackResource /index.html`).

**Cloud static hosting** — Azure Static Web Apps, AWS S3 + CloudFront, Netlify,
Vercel, GitHub Pages, etc. Set the build command to `npm run build` and the
publish/output directory to `dist`. Configure the SPA fallback to `index.html`.

Notes:
- The app has **no client-side router**, so deep-link rewrites aren't strictly
  required, but the `index.html` fallback above is harmless and future-proof.
- All asset paths are root-relative. To host under a sub-path (e.g.
  `https://host/jd-agent/`), set Vite's `base` in `vite.config.ts`
  (`export default defineConfig({ base: '/jd-agent/', ... })`) and rebuild.
- Serve over **HTTPS**. Recommended headers: `Content-Security-Policy`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.

---

## 5. Runtime CDN assets (fonts & icons)

`index.html` references, from CDNs:
- Google Fonts: **Hanken Grotesk**, **IBM Plex Sans Arabic**, **IBM Plex Mono**
- **Iconify** icon web component (`iconify-icon`)

If those CDNs are reachable, no action is needed. For an **offline / locked-down**
environment, self-host them:
1. Download the font files and the `iconify-icon` script.
2. Place them under `public/` and update the `<link>`/`<script>` tags in
   `index.html` to point at the local paths.
3. Rebuild. The layout already degrades gracefully to system fonts if a font
   fails to load.

---

## 6. AI provider configuration (optional)

The app is **model- and provider-agnostic**. By default it uses the built-in
`local` provider — deterministic, offline, no keys — so nothing needs configuring
to run the demo.

To connect a real model provider, copy `.env.example` to `.env` and set:

```bash
VITE_AI_PROVIDER=claude        # local (default) | claude | openai | gemini
VITE_AI_MODEL=claude-opus-4-8  # optional override
VITE_ANTHROPIC_API_KEY=...     # key for the chosen provider
# VITE_OPENAI_API_KEY=... / VITE_GEMINI_API_KEY=...
# VITE_AI_BASE_URL=...         # proxy / Azure OpenAI / local-LLM endpoint
```

> ⚠️ **Security — do not ship API keys to the browser.** `VITE_*` values are
> compiled into the client bundle and are visible to anyone. For production, do
> **not** put real provider keys in `.env`. Instead stand up a thin backend/proxy
> that holds the key server-side and point `VITE_AI_BASE_URL` at it. The provider
> adapters (`src/ai/providers/`) are written to target such an endpoint.

### Where real systems plug in ("Oracle-ready")

The code isolates integration behind services and a provider factory, so these can
be connected without touching the UI:

| Seam | File | Replace with |
|------|------|--------------|
| AI model | `src/ai/aiProviderFactory.ts` + `providers/` | your model provider / gateway |
| Employee & position data | `src/data/` + `src/services/masterDataService.ts` | Oracle Fusion / HR system API |
| Reference documents | `src/services/knowledgeBaseService.ts` | document store |
| Versioning & approval | `src/services/versionControlService.ts` | real JD workflow / audit system |

---

## 7. Project structure

```
src/
  ai/           AI provider abstraction, factory, orchestrator, prompts, types
  agents/       Specialized agents (supervisor, jdWriter, compliance, …)
  services/     Business logic + data access (jobDescriptionService = the facade)
  data/         Seeded mock data (master data, references, employees, positions)
  components/   React UI (Sidebar, MessageCard, Artifact, screen views)
  store.ts      App state + flow logic (observable store)
  viewModel.ts  Render-ready view model
  i18n.ts       EN/AR dictionaries
index.html      Entry HTML (fonts + icons)
dist/           Prebuilt production output (rebuild in CI)
```

Full architecture is documented in **`README.md`** (§Architecture). The original
design source is `MOCA JD Agent.dc.html` (with `support.js`, `assets/`,
`screenshots/`, `uploads/`) — reference material, not part of the running app.

---

## 8. Suggested CI/CD

```yaml
# example (GitHub Actions / Azure DevOps equivalent)
steps:
  - run: npm ci
  - run: npm run build        # fails the build on type errors
  - run: npm run lint         # optional gate
  # publish ./dist to the static host / CDN
```

Pin Node to 20 or 22. Cache `~/.npm` for faster installs. Treat `dist/` as a
build artifact (it's git-ignored in normal workflow; the copy in this package is
just a convenience).

---

## 9. Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox). The UI is fully
right-to-left aware (Arabic default) and responsive.

---

## 10. Handover checklist for IT

- [ ] `npm ci && npm run build` succeeds on your build agent (Node 20/22).
- [ ] `dist/` served over HTTPS with an `index.html` SPA fallback.
- [ ] Decide fonts/icons: CDN (default) or self-hosted (offline) — §5.
- [ ] If connecting a real model: stand up a key-holding proxy; set
      `VITE_AI_BASE_URL`; never put keys in the client `.env` — §6.
- [ ] Plan the integration seams (Oracle Fusion, doc store, approval) — §6.
- [ ] Rotate any credentials shared during the prototype phase.
