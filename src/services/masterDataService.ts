import {
  FAM_AR,
  GRADES,
  MASTER,
  ORG_AR,
  ORG_EN,
  ORG_TREE,
  ROLE_ARCHETYPES,
  TITLES,
} from "../data";
import type { Bi, Lang, RoleArchetype, Seed, TitleRec } from "../types";
import type { OrgContextResult } from "../ai/types";

/**
 * Master-data access: the organizational hierarchy, approved titles, grades and
 * occupational families, plus the derivations (role classification, mandate
 * scope, competency levels) the agents ground their output in. This is business
 * logic — deliberately separate from AI generation. Backed by seeded demo data
 * today; swap the imports for Oracle Fusion / a real API later without touching
 * the agents or orchestrator.
 */
export const masterDataService = {
  grades: () => GRADES,
  isValidGrade: (g: string) => GRADES.includes(g),

  findTitle: (en: string): TitleRec | undefined => TITLES.find((t) => t.en === en),
  familyLabel: (family: string, lang: Lang) => (lang === "ar" ? FAM_AR[family] || family : family),

  /** Classify a title into a work-level archetype key. */
  roleForTitle(title: string): "managerial" | "advisory" | "executive" {
    const s = (title || "").toLowerCase();
    if (/director|head|manager|deputy|\blead\b|chief/.test(s)) return "managerial";
    if (/consultant|advisor/.test(s)) return "advisory";
    return "executive";
  },
  archetypeFor(seed: Seed): RoleArchetype {
    return ROLE_ARCHETYPES[this.roleForTitle(seed.title)];
  },

  /** Required competency levels derived from the grade. */
  coreLevel(g: string): "developing" | "proficient" | "advanced" {
    const M = +g.split(".")[0];
    return M <= 2 ? "developing" : M === 3 ? "proficient" : "advanced";
  },
  leadLevel(g: string): "proficient" | "advanced" | null {
    if (g === "4.1") return "proficient";
    const M = +g.split(".")[0];
    return M >= 4 ? "advanced" : null;
  },

  /** Resolve org context (scope level, mandate, reporting) for a role. */
  orgContextFor(seed: Seed): OrgContextResult {
    const roleKey = this.roleForTitle(seed.title);
    const arch = ROLE_ARCHETYPES[roleKey];
    const node = ORG_TREE[arch.scopeLevel];
    const repMap: Record<string, Bi> = {
      managerial: { en: "Central Services Sector", ar: "قطاع الخدمات المركزية" },
      advisory: { en: "Head of Total Experience Section", ar: "رئيس قسم التجربة الشاملة" },
      executive: { en: "Head of Total Experience Section", ar: "رئيس قسم التجربة الشاملة" },
    };
    return {
      roleKey,
      scopeLevel: arch.scopeLevel,
      scope: { en: node.en, ar: node.ar },
      mandate: { en: node.mandate.en, ar: node.mandate.ar },
      reporting: repMap[roleKey] || repMap.executive,
    };
  },

  org: (lang: Lang) => (lang === "ar" ? ORG_AR : ORG_EN),
  units: () => MASTER.units,
  /** Whether an official mandate is available for a destination unit (transfers). */
  unitHasMandate: (unitId: string) => unitId === "txteam" || unitId === "insight",
};
