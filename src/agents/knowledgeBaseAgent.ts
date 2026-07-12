import { KB_AGENT_SYSTEM } from "../ai/prompts";
import type { GenerationRequest, KnowledgeResult } from "../ai/types";
import { knowledgeBaseService } from "../services/knowledgeBaseService";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Identifies which official references ground this JD. */
export class KnowledgeBaseAgent extends BaseAgent {
  readonly name = "Knowledge Base Agent";

  run(req: GenerationRequest): Promise<KnowledgeResult> {
    return this.structured<KnowledgeResult>({
      system: KB_AGENT_SYSTEM,
      messages: [{ role: "user", content: "List the official references used to ground this Job Description." }],
      schema: LOOSE_OBJECT,
      schemaName: "knowledge",
      fallback: () => ({ referencesUsed: knowledgeBaseService.referencesForGeneration(req.lang) }),
    });
  }
}
