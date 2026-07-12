import { SUPERVISOR_SYSTEM } from "../ai/prompts";
import type { GenerationRequest, SupervisorPlan } from "../ai/types";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/**
 * Decides which specialized agents run for a given request. In this prototype the
 * plan is the same grounded pipeline for every request type; the seam exists so a
 * model-backed supervisor can tailor it (e.g. skip qualifications on a transfer)
 * without changing the orchestrator.
 */
export class SupervisorAgent extends BaseAgent {
  readonly name = "Supervisor Agent";

  private static readonly PIPELINE = [
    "organization",
    "knowledgeBase",
    "jdWriter",
    "qualification",
    "competency",
    "compliance",
    "qualityReview",
    "businessRules",
  ];

  run(req: GenerationRequest): Promise<SupervisorPlan> {
    return this.structured<SupervisorPlan>({
      system: SUPERVISOR_SYSTEM,
      messages: [{ role: "user", content: `Plan agents for a "${req.requestType}" request.` }],
      schema: LOOSE_OBJECT,
      schemaName: "plan",
      fallback: () => ({ requestType: req.requestType, agents: [...SupervisorAgent.PIPELINE] }),
    });
  }
}
