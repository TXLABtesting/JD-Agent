# MOCA — Job Description Agent

A faithful React + TypeScript implementation of the **MOCA Job Description Agent**
prototype (Ministry of Cabinet Affairs, UAE), ported from the Claude Design
handoff bundle (design source and transcript now at the repository root).

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

The code is layered so the **UI, the AI, the business rules and the mock data are
independent**. The UI only ever consumes clean, typed data; it never sees a
prompt, a provider or an API. Everything is model- and provider-agnostic.

```
UI (components)  →  store  →  services/jobDescriptionService
                                      │
                                      ▼
                          ai/agentOrchestrator  ──►  agents/*  ──►  services/* + data/*
                                      │                  │
                                      ▼                  ▼
                          ai/aiProviderFactory     ai/aiProvider.interface
                                      │
                    ┌─────────────────┼─────────────────┬────────────┐
                 local            claude(SDK)         openai        gemini
```

### AI provider abstraction (`src/ai/`)

| File | Role |
|------|------|
| `aiProvider.interface.ts` | The single `AIProvider` contract: `generateText`, `generateStructuredOutput<T>`, optional `streamText`. All calling code depends only on this. |
| `providers/localProvider.ts` | **Default.** Deterministic, offline, no keys — returns the grounded result the agents compute. Keeps the demo fully working. |
| `providers/claudeProvider.ts` | Anthropic Claude via the official `@anthropic-ai/sdk` (default `claude-opus-4-8`, adaptive thinking, `output_config.format`). |
| `providers/openaiProvider.ts` | OpenAI / Azure OpenAI / OpenAI-compatible (Chat Completions + `response_format`). |
| `providers/geminiProvider.ts` | Google Gemini (`generateContent` + `responseSchema`). |
| `aiProviderFactory.ts` | Selects the provider from `VITE_AI_PROVIDER`; model-backed providers are lazy-loaded (their SDKs never enter the default bundle). |
| `config.ts` | Reads `.env` (`VITE_AI_*`). See `.env.example`. |
| `prompts.ts` | All agent system/task prompts — kept out of components and business rules. |
| `types.ts` | Provider IO + typed agent/generation results (all outputs are structured JSON). |
| `agentOrchestrator.ts` | Coordinates the agents into one typed `GenerationResult`. The UI calls this (via the service), never the providers. |

Switch models with **one env var** — no code change:

```bash
VITE_AI_PROVIDER=claude   # or openai | gemini | local (default)
VITE_ANTHROPIC_API_KEY=…  # key for the chosen provider
```

Regardless of provider, the JD still follows the official unified MOCA-1289
template, and the business/grounding logic (which enforces "only approved
references") lives in the agents + services — separate from AI generation.

### Agents (`src/agents/`)

`supervisorAgent` plans the run; `organizationAgent`, `knowledgeBaseAgent`,
`jdWriterAgent`, `qualificationAgent`, `competencyAgent`, `complianceAgent`,
`qualityReviewAgent` and `businessRulesAgent` each produce a typed structured
result and carry a deterministic grounded fallback.

### Services (`src/services/`)

`jobDescriptionService` (the façade the store calls), `masterDataService`,
`knowledgeBaseService`, `validationService`, `sourceMappingService`,
`versionControlService`. These hold the business rules and data access — the
seams where Oracle Fusion, document storage and a real approval workflow plug in.

### Data (`src/data/`)

`masterData.ts`, `officialReferences.ts`, `mockEmployees.ts`, `mockPositions.ts`
(seeded demo data, kept separate from generated data). UI palettes live in
`src/theme.ts`.

### UI + state (ported from the prototype's `DCLogic` runtime)

| File | Role |
|------|------|
| `src/store.ts` | Observable store — state + flow logic, subscribed via `useSyncExternalStore`. Calls `jobDescriptionService`; contains no AI/prompt code. |
| `src/viewModel.ts` | `buildVM(store)` — the render-ready view model. |
| `src/i18n.ts` | EN/AR string dictionaries. |
| `src/css.ts` | Turns the prototype's inline-style strings into React style objects. |
| `src/components/` | `Sidebar`, `MessageCard`, `Artifact`, and the screen views. |

### Oracle-ready, not Oracle-connected

The seams above (services + provider factory) are designed so Oracle Fusion,
document storage, real employee/approval systems and any AI model can be
connected later. None is wired now — the app runs on mock data and the `local`
provider by default.

The original design source lives in `MOCA JD Agent.dc.html` (with its runtime
`support.js`, `assets/`, `screenshots/` and `uploads/` alongside it).
