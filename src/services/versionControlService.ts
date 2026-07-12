import { REQUESTS } from "../data";
import type { Jd } from "../types";

/**
 * Versioning + audit for job descriptions. On approval it writes a new approved
 * record into the Workspace and returns an audit reference. In production this
 * fronts the JD workflow / document store and Oracle Fusion; here it mutates the
 * seeded demo records so the Records views update live.
 */
export const versionControlService = {
  newAuditRef(): string {
    return "AUD-" + Math.floor(100000 + Math.random() * 899999);
  },

  newJdCode(): string {
    return "MOCA-" + Math.floor(1000 + Math.random() * 8999);
  },

  /** Record an approval: publish the JD to Records and return the audit ref. */
  recordApproval(jd: Jd): string {
    REQUESTS.unshift({
      id: "JD-" + Math.floor(2060 + Math.random() * 39),
      en: jd.emp || "—",
      ar: jd.emp || "—",
      titleEn: jd.title,
      titleAr: jd.titleAr || jd.title,
      grade: jd.grade,
      status: "approved",
      ver: "v1.0",
      updated: new Date().toISOString().slice(0, 10),
    });
    return this.newAuditRef();
  },
};
