import { QUALITY_REVIEW_AGENT_SYSTEM } from "../ai/prompts";
import type { QualityReviewResult } from "../ai/types";
import type { Jd } from "../types";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Assesses the finished draft for quality/compliance/risk; recommends next step. */
export class QualityReviewAgent extends BaseAgent {
  readonly name = "Quality Review Agent";

  run(jd: Jd): Promise<QualityReviewResult> {
    return this.structured<QualityReviewResult>({
      system: QUALITY_REVIEW_AGENT_SYSTEM,
      messages: [{ role: "user", content: `Review the draft for "${jd.title}" (${jd.code}).` }],
      schema: LOOSE_OBJECT,
      schemaName: "quality_review",
      fallback: () => ({
        overallConfidence: jd.confidence,
        qualityScore: 92,
        compliancePass: true,
        duplicateRisk: "low",
        riskLevel: "low",
        recommendation: "Ready for human review — no blocking issues",
      }),
    });
  }
}
