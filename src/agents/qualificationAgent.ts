import { QUALS } from "../data";
import { QUALIFICATION_AGENT_SYSTEM } from "../ai/prompts";
import type { GenerationRequest, QualificationResult } from "../ai/types";
import type { Flag } from "../types";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Fills Qualifications strictly from the framework for the grade; flags gaps. */
export class QualificationAgent extends BaseAgent {
  readonly name = "Qualification Agent";

  run(req: GenerationRequest): Promise<QualificationResult> {
    return this.structured<QualificationResult>({
      system: QUALIFICATION_AGENT_SYSTEM,
      messages: [{ role: "user", content: `Provide qualifications for grade ${req.seed.grade}.` }],
      schema: LOOSE_OBJECT,
      schemaName: "qualifications",
      fallback: () => {
        const base = QUALS[req.seed.grade];
        const flags: Flag[] = base ? [] : [{ key: "flag_quals", params: { grade: req.seed.grade } }];
        return { base, flags };
      },
    });
  }
}
