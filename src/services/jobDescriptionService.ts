import { agentOrchestrator, type OrchestratorHooks } from "../ai/agentOrchestrator";
import type { GenerationRequest, GenerationResult } from "../ai/types";
import type { Jd } from "../types";
import { sourceMappingService, type MandateAlignment } from "./sourceMappingService";
import { versionControlService } from "./versionControlService";

/**
 * Facade the UI/store uses for job-description operations. It hides the AI layer
 * entirely: the store calls generate/verify/approve and receives clean, typed
 * data — it never touches providers, agents or the orchestrator directly.
 */
export const jobDescriptionService = {
  /** Run the agent pipeline to produce a grounded, structured job description. */
  generate(req: GenerationRequest, hooks?: OrchestratorHooks): Promise<GenerationResult> {
    return agentOrchestrator.generate(req, hooks);
  },

  /** Map responsibilities to the mandate and surface gaps (verify vs mandate). */
  verifyMandate(jd: Jd): MandateAlignment {
    return sourceMappingService.align(jd);
  },

  /** Publish an approved JD to Records and return the audit reference. */
  approve(jd: Jd): string {
    return versionControlService.recordApproval(jd);
  },
};
