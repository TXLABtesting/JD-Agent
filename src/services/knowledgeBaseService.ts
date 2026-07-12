import { KBDATA, KBREFS } from "../data";
import type { Lang } from "../types";

/**
 * Access to the official reference documents and reference datasets that ground
 * every JD. In production this fronts a document store; here it reads the seeded
 * Knowledge Base catalog.
 */
export const knowledgeBaseService = {
  references: () => KBREFS,
  datasets: () => KBDATA,

  /** Names of the references actually used when generating a JD. */
  referencesForGeneration(lang: Lang): string[] {
    return KBREFS.filter((r) => r.used).map((r) => (lang === "ar" ? r.ar : r.en));
  },
};
