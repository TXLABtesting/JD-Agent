import { CORE, LEAD } from "../data";
import { COMPETENCY_AGENT_SYSTEM } from "../ai/prompts";
import type { CompetencyResult, GenerationRequest } from "../ai/types";
import { masterDataService } from "../services/masterDataService";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Selects Core + Leadership competencies and required levels by grade. */
export class CompetencyAgent extends BaseAgent {
  readonly name = "Competency Agent";

  run(req: GenerationRequest): Promise<CompetencyResult> {
    return this.structured<CompetencyResult>({
      system: COMPETENCY_AGENT_SYSTEM,
      messages: [{ role: "user", content: `Select competencies and levels for grade ${req.seed.grade}.` }],
      schema: LOOSE_OBJECT,
      schemaName: "competencies",
      fallback: () => {
        const cl = masterDataService.coreLevel(req.seed.grade);
        const ll = masterDataService.leadLevel(req.seed.grade);
        return {
          core: CORE.map((c) => ({ name: c, level: cl })),
          leadership: ll ? LEAD.map((c) => ({ name: c, level: ll })) : [],
          hasLeadership: !!ll,
        };
      },
    });
  }
}
