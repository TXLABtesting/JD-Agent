# MOCA — Job Description Agent · Data & API Contract

This document lists **every data field and API** the JD Agent needs, so IT can
connect it to the real source systems (Oracle Fusion / HR, the document store,
the JD approval workflow, and an AI model provider).

Today the app runs on seeded mock data behind a **services layer**; each service
is the seam where a real API plugs in. The tables below give the field-level
contract and the logical endpoints expected at each seam.

**Conventions**
- Every human-readable field is **bilingual**: an English (`…En` / `en`) and an
  Arabic (`…Ar` / `ar`) value are required.
- **Source** column: `Official` = read-only, comes from a system of record
  (Oracle/HR) and is locked in the UI; `Agent` = produced by the JD generation;
  `User` = editable by the drafter.
- Field names in `code font` match the current TypeScript models
  (`src/types.ts`, `src/data/*`).

---

## 1. Master Data — Organizational hierarchy

Cascading structure: **Entity → Sector → Department → Section → Unit**. Source: Oracle Fusion / Organizational Description. Service seam: `masterDataService`.

| Entity | Field | Type | Source | Notes |
|--------|-------|------|--------|-------|
| Entity | `id` | string (key) | Official | e.g. `moca` |
| | `en` / `ar` | string | Official | "Ministry of Cabinet Affairs" |
| Sector | `id`, `entity` (FK) | string | Official | |
| | `en` / `ar` | string | Official | |
| Department | `id`, `sector` (FK) | string | Official | |
| | `en` / `ar` | string | Official | |
| Section | `id`, `dept` (FK) | string | Official | |
| | `en` / `ar` | string | Official | |
| Unit / Team | `id`, `section` (FK) | string | Official | |
| | `en` / `ar` | string | Official | |

Related master lists:

| List | Fields | Source | Notes |
|------|--------|--------|-------|
| Job grades | grade code (`1.1`…`5`) | Official | 13 grades |
| Occupational families | family key + `en`/`ar` label | Official | Supervisory, General, Advisory, Office Managers, Leadership |

### Org-unit mandates (per level)

Each org level carries an official **mandate** used to ground the JD. Source: Organizational Description decision. Service: `masterDataService` / `knowledgeBaseService`.

| Field | Type | Source |
|-------|------|--------|
| scope level | enum `ministry` \| `department` \| `section` \| `unit` | Official |
| name `en` / `ar` | string | Official |
| `mandate.en` / `mandate.ar` | long text | Official |

---

## 2. Approved Job Titles List

The authoritative titles catalog. Only titles here can be made official; grade and
family are **derived** from it. Source: Approved Job Titles List (XLSX today).
Service: `masterDataService`.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `en` | string | Official | Approved English title |
| `ar` | string | Official | Approved Arabic title |
| `family` | enum | Official | Occupational family |
| `grade` | grade code | Official | Auto-derived grade for the title |

---

## 3. Employees

Source: Oracle Fusion / HR system. Service: `masterDataService` + `mockEmployees` (demo). All fields are **Official** (read-only in the agent).

| Field | Type | Notes |
|-------|------|-------|
| `id` | string (key) | Employee ID, e.g. `E-10482` |
| `en` / `ar` | string | Employee full name (EN/AR) |
| `titleEn` / `titleAr` | string | Current job title (EN/AR) |
| `grade` | grade code | Current grade |
| `mgrEn` / `mgrAr` | string | Direct manager name (EN/AR) |
| `unit` | string (FK → Unit) | Organizational unit |
| `jd` | enum `approved` \| `draft` \| `review` \| `none` | Current JD status |
| `ver` | string | Current JD version (e.g. `v1.0`) |
| `yos` | number | Years of service |
| `approved` | boolean | Whether the employee's title is an approved title |

Derived on read (from the unit FK): Sector, Department, Section, Entity for display.

---

## 4. Reference frameworks (grounding sources)

Source: official reference documents in the Knowledge Base. Service: `knowledgeBaseService`.

### 4.1 Qualifications & Expertise Framework
| Field | Type | Notes |
|-------|------|-------|
| grade | grade code (key) | |
| qualification text | string | Education + experience by grade (e.g. "Bachelor's (0–2) · Diploma (5+)…") |

### 4.2 Competency Framework
| Field | Type | Notes |
|-------|------|-------|
| competency `en` / `ar` | string | Core competencies (4) + Leadership competencies (4) |
| category | enum `core` \| `leadership` | |
| required level by grade | enum `developing` \| `proficient` \| `advanced` | Level matrix keyed by grade; leadership applies at grades 4.x+ |

### 4.3 Role archetypes (from the JD reference examples)
Config that maps a role's **work level** to purpose/responsibilities/authority/KPIs.
| Field | Type | Notes |
|-------|------|-------|
| key | enum `managerial` \| `advisory` \| `executive` | Classified from the title |
| scopeLevel | enum `department` \| `section` \| `unit` | Which mandate to ground in |
| nature `en`/`ar` | string | e.g. "Execute · Operate · Follow up · Coordinate" |
| authority `en`/`ar` | string | Approval authority statement |
| purpose `en`/`ar` | long text | Purpose of the role |
| resp[] `en`/`ar` | string[] | Candidate key responsibilities |
| kpis[] `en`/`ar` | string[] | Suggested KPIs |

### 4.4 Unified JD Template (MOCA-1289)
The official Word/PDF template the export must follow. Source: Ministry-wide.

---

## 5. Knowledge Base catalog

Metadata for the reference documents the agent grounds every JD in. Service: `knowledgeBaseService`.

| Field | Type | Notes |
|-------|------|-------|
| `en` / `ar` | string | Reference name |
| `type` | string | DOCX / PDF / XLSX |
| `org` | string | Related organization |
| `date` | date | Last updated |
| `status` | enum `active` \| `partial` | Availability/completeness |
| `used` | boolean | Whether used in generation |

Reference datasets index: `en`/`ar` name + `src` (source reference).

---

## 6. Job Description (generated output + records)

### 6.1 JD request / record (Workspace + Records)
Source: JD workflow system. Service: `versionControlService` / `mockPositions`.
| Field | Type | Notes |
|-------|------|-------|
| `id` | string (key) | e.g. `JD-2041` |
| `en` / `ar` | string | Employee name (or `—` for position-only) |
| `titleEn` / `titleAr` | string | Job title |
| `grade` | grade code | |
| `status` | enum `approved` \| `draft` \| `review` | Workflow status |
| `ver` | string | Version |
| `updated` | date | Last update |
| `dept` | string (optional) | Owning department |

### 6.2 Generated JD document (unified MOCA-1289)
Produced by the agent (`Agent`), some sections `User`-editable. Structure = `Jd` model.
| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `title` / `titleAr` | string | Official | Approved title (EN/AR) |
| `grade` | grade code | Official | Derived from title |
| `code` | string | Agent | JD reference, e.g. `MOCA-4515` |
| Employee | string | Official | For employee-linked JDs |
| Sector / Department / Section / Unit | string | Official | Org context |
| Direct Manager (`manager`) | string | Official | Reporting line |
| `purposeText` `en`/`ar` | long text | Agent | Grounded in the mandate |
| `resp[]` (grouped) | see below | Agent + User | Key responsibilities |
| Qualifications (`quals.base`) | string | Agent | From qualifications framework by grade |
| Competencies (core + leadership) | rows | Agent | Name + required level, from framework |
| `natureLine`, `authorityText`, `kpis[]` | text | Agent | Work scope / authority / KPIs |
| `confidence` | enum `high` \| `medium` \| `low` | Agent | Lowered when data missing |
| `flags[]` | `{key, params}` | Agent | Missing-data alerts |
| `verified` | boolean | Agent | Mandate-alignment checked |
| `status` / `stage` | enum | Workflow | draft → generated → validated → compliance → manager → hr → published |

Responsibility item (`resp[].items[]`):
| Field | Type | Source |
|-------|------|--------|
| text `en` / `ar` (`t`) | string | Agent |
| source `en` / `ar` (`src`) | string | Agent (mandate clause it maps to) |
| `override` | string (optional) | User (edited text) |

---

## 7. Required APIs (integration endpoints)

Logical endpoints IT should expose; the app consumes them through its services.
(Methods/paths are illustrative — align to your API gateway conventions.)

### Master Data — `masterDataService`
| Purpose | Endpoint (suggested) | Returns |
|---------|----------------------|---------|
| Org hierarchy | `GET /org/{entities,sectors,departments,sections,units}` | §1 |
| Grades | `GET /grades` | grade codes |
| Approved titles | `GET /job-titles` | §2 |
| Occupational families | `GET /occupational-families` | family + labels |
| Org mandates | `GET /mandates/{scopeLevel}` | §1 mandate |

### Employees — `masterDataService`
| Purpose | Endpoint | Returns |
|---------|----------|---------|
| List by unit | `GET /employees?unit={id}` | §3 |
| Single | `GET /employees/{id}` | §3 |

### References — `knowledgeBaseService`
| Purpose | Endpoint | Returns |
|---------|----------|---------|
| Reference catalog | `GET /references` | §5 |
| Qualifications framework | `GET /qualifications-framework` | §4.1 |
| Competency framework | `GET /competency-framework` | §4.2 |
| Unified template | `GET /templates/moca-1289` | §4.4 (binary/template) |

### JD lifecycle — `jobDescriptionService` / `versionControlService`
| Purpose | Endpoint | Notes |
|---------|----------|-------|
| Generate draft | `POST /job-descriptions` | body: seed (title, grade, org, employee, requestType) → §6.2 |
| List (workspace) | `GET /job-descriptions?status=` | §6.1 |
| Get one | `GET /job-descriptions/{id}` | §6.2 |
| Save version | `PUT /job-descriptions/{id}` | new version |
| Submit for approval | `POST /job-descriptions/{id}/submit` | → manager review |
| Approve | `POST /job-descriptions/{id}/approve` | → published + audit ref |
| Return for changes | `POST /job-descriptions/{id}/return` | + comment |
| Verify vs mandate | `POST /job-descriptions/{id}/verify` | alignment + gaps |
| Export | `GET /job-descriptions/{id}/export?format=word` | MOCA-1289 doc |

### AI model — `aiProviderFactory` (already abstracted)
| Purpose | Contract | Notes |
|---------|----------|-------|
| Text / structured generation | `generateText`, `generateStructuredOutput<T>` | Any provider (Claude/OpenAI/Gemini/local). Call **through a backend proxy** that holds the API key — never from the browser. |

### Workflow / audit
| Purpose | Endpoint | Notes |
|---------|----------|-------|
| Audit log | `GET /audit?jd={id}` | audit reference on each approval (`AUD-…`) |
| Employee acknowledgement | `POST /job-descriptions/{id}/acknowledge` | published JD read receipt |

---

## 8. Field summary — the "minimum set" IT asked for

For a quick reference, the core fields that must be available per JD:

| Field | Source |
|-------|--------|
| Employee name (EN/AR) | Official (HR) |
| Employee ID | Official (HR) |
| Job title (EN/AR) | Official (Approved Titles) |
| Grade | Official (derived from title) |
| Occupational family | Official (Approved Titles) |
| Direct manager | Official (HR) |
| Entity / Sector / Department / Section / Unit | Official (Org hierarchy) |
| Org-unit mandate | Official (Org Description) |
| Qualifications (by grade) | Official (Qualifications framework) |
| Competencies + levels | Official (Competency framework) |
| Purpose, responsibilities, KPIs | Agent (grounded in the above) |
| JD status / version / audit ref | Workflow system |

> Anything the agent produces (§6.2 `Agent` rows) is derived **only** from the
> official inputs above — it never invents titles, grades, qualifications,
> competencies or responsibilities. Missing official data lowers confidence and
> raises a missing-data flag instead of being fabricated.
