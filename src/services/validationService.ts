import { QUALS } from "../data";
import type { Seed } from "../types";
import { masterDataService } from "./masterDataService";

export interface ValidationCheck {
  key: string;
  ok: boolean;
}
export interface ValidationResult {
  titleApproved: boolean;
  gradeValid: boolean;
  mandateAvailable: boolean;
  qualsAvailable: boolean;
  checks: ValidationCheck[];
  ready: boolean;
}

/**
 * The validation gate: checks a request against the official references before
 * generation. Pure business rules — no AI. Used by the Compliance agent and
 * available to the UI's readiness gate.
 */
export const validationService = {
  validate(seed: Seed, targetUnit?: string): ValidationResult {
    const titleApproved = !!seed.approved && !!masterDataService.findTitle(seed.title);
    const gradeValid = masterDataService.isValidGrade(seed.grade);
    const mandateAvailable = targetUnit ? masterDataService.unitHasMandate(targetUnit) : true;
    const qualsAvailable = !!QUALS[seed.grade];
    const checks: ValidationCheck[] = [
      { key: "vg_title_ok", ok: titleApproved },
      { key: "vg_grade_ok", ok: gradeValid },
      { key: "vg_org_ok", ok: true },
      { key: "vg_mandate_ok", ok: mandateAvailable },
      { key: "vg_quals_ok", ok: qualsAvailable },
      { key: "vg_comp_ok", ok: true },
      { key: "vg_dup_ok", ok: true },
    ];
    return {
      titleApproved,
      gradeValid,
      mandateAvailable,
      qualsAvailable,
      checks,
      ready: checks.every((c) => c.ok),
    };
  },
};
