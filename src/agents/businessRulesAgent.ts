import { BUSINESS_RULES_AGENT_SYSTEM } from "../ai/prompts";
import type { BusinessRulesResult, ComplianceResult } from "../ai/types";
import type { Jd } from "../types";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/**
 * Applies MOCA business rules to the assembled draft: missing framework data
 * lowers confidence; only approved/grounded content may pass as official.
 */
export class BusinessRulesAgent extends BaseAgent {
  readonly name = "Business Rules Agent";

  run(jd: Jd, compliance: ComplianceResult): Promise<BusinessRulesResult> {
    return this.structured<BusinessRulesResult>({
      system: BUSINESS_RULES_AGENT_SYSTEM,
      messages: [{ role: "user", content: `Apply business rules to "${jd.title}" grade ${jd.grade}.` }],
      schema: LOOSE_OBJECT,
      schemaName: "business_rules",
      fallback: () => ({
        // Any missing-data flag on the draft forces low confidence.
        confidence: jd.flags.length ? "low" : compliance.confidence,
        flags: jd.flags,
      }),
    });
  }
}
