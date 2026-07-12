import { ORG_AGENT_SYSTEM } from "../ai/prompts";
import type { GenerationRequest, OrgContextResult } from "../ai/types";
import { masterDataService } from "../services/masterDataService";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Resolves org context, mandate scope and reporting line for a role. */
export class OrganizationAgent extends BaseAgent {
  readonly name = "Organization Structure Agent";

  run(req: GenerationRequest): Promise<OrgContextResult> {
    return this.structured<OrgContextResult>({
      system: ORG_AGENT_SYSTEM,
      messages: [
        { role: "user", content: `Resolve the organizational context for "${req.seed.title}" at grade ${req.seed.grade}.` },
      ],
      schema: LOOSE_OBJECT,
      schemaName: "org_context",
      fallback: () => masterDataService.orgContextFor(req.seed),
    });
  }
}
