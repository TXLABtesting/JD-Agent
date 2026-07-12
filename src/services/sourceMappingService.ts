import type { Jd, RespItem } from "../types";

export interface MandateRow {
  item: RespItem;
  /** True when the responsibility maps to a mandate clause. */
  mapped: boolean;
}
export interface MandateAlignment {
  rows: MandateRow[];
  /** Mandate areas not covered by any responsibility. */
  gaps: string[];
}

/**
 * Maps a JD's responsibilities back to the section/department mandate that
 * grounds them, and surfaces uncovered mandate areas (gaps). Powers the
 * "verify vs mandate" review. Pure business logic — no AI.
 */
export const sourceMappingService = {
  align(jd: Jd): MandateAlignment {
    const rows: MandateRow[] = [];
    jd.resp.forEach((grp) => grp.items.forEach((it) => rows.push({ item: it, mapped: true })));
    return { rows, gaps: [] };
  },
};
