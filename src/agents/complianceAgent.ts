import { COMPLIANCE_AGENT_SYSTEM } from "../ai/prompts";
import type { ComplianceResult, GenerationRequest, QualificationResult } from "../ai/types";
import { validationService } from "../services/validationService";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Validates the draft against references; sets confidence + missing-data flags. */
export class ComplianceAgent extends BaseAgent {
  readonly name = "Compliance Agent";

  run(req: GenerationRequest, qual: QualificationResult): Promise<ComplianceResult> {
    return this.structured<ComplianceResult>({
      system: COMPLIANCE_AGENT_SYSTEM,
      messages: [{ role: "user", content: `Validate the draft for "${req.seed.title}" grade ${req.seed.grade}.` }],
      schema: LOOSE_OBJECT,
      schemaName: "compliance",
      fallback: () => {
        const v = validationService.validate(req.seed, req.targetUnit);
        const flags = qual.flags;
        return {
          titleApproved: v.titleApproved,
          gradeValid: v.gradeValid,
          mandateAvailable: v.mandateAvailable,
          confidence: flags.length ? "low" : "high",
          flags,
        };
      },
    });
  }
}
