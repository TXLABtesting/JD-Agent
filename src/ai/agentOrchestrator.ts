import { BusinessRulesAgent } from "../agents/businessRulesAgent";
import { CompetencyAgent } from "../agents/competencyAgent";
import { ComplianceAgent } from "../agents/complianceAgent";
import { JdWriterAgent } from "../agents/jdWriterAgent";
import { KnowledgeBaseAgent } from "../agents/knowledgeBaseAgent";
import { OrganizationAgent } from "../agents/organizationAgent";
import { QualificationAgent } from "../agents/qualificationAgent";
import { QualityReviewAgent } from "../agents/qualityReviewAgent";
import { SupervisorAgent } from "../agents/supervisorAgent";
import { versionControlService } from "../services/versionControlService";
import type { Jd } from "../types";
import { getProvider } from "./aiProviderFactory";
import type { GenerationRequest, GenerationResult } from "./types";

/** User-facing generation phases (mapped to the 4-step progress in the UI). */
export type GenerationPhase = "refs" | "write" | "validate" | "finalize";

export interface OrchestratorHooks {
  onPhase?: (phase: GenerationPhase) => void | Promise<void>;
}

/**
 * Coordinates the specialized agents into a single grounded Job Description.
 * The UI/store calls this (via jobDescriptionService) — never the providers or
 * individual agents directly.
 *
 * Flow: Supervisor plans → Organization + Knowledge Base gather context →
 * JD Writer drafts Purpose & Responsibilities → Qualification + Competency +
 * Compliance fill and validate → assemble → Quality Review + Business Rules
 * finalize. Each step is a typed, structured result.
 */
export class AgentOrchestrator {
  async generate(req: GenerationRequest, hooks: OrchestratorHooks = {}): Promise<GenerationResult> {
    const provider = await getProvider();

    const supervisor = new SupervisorAgent(provider);
    const organization = new OrganizationAgent(provider);
    const knowledgeBase = new KnowledgeBaseAgent(provider);
    const jdWriter = new JdWriterAgent(provider);
    const qualification = new QualificationAgent(provider);
    const competency = new CompetencyAgent(provider);
    const compliance = new ComplianceAgent(provider);
    const qualityReview = new QualityReviewAgent(provider);
    const businessRules = new BusinessRulesAgent(provider);

    const plan = await supervisor.run(req);

    // Phase 1 — reviewing official references
    await hooks.onPhase?.("refs");
    const org = await organization.run(req);
    const kb = await knowledgeBase.run(req);

    // Phase 2 — writing the job description
    await hooks.onPhase?.("write");
    const writer = await jdWriter.run(req, org);

    // Phase 3 — checking policy & quality
    await hooks.onPhase?.("validate");
    const qual = await qualification.run(req);
    const comps = await competency.run(req);
    const complianceResult = await compliance.run(req, qual);

    // Assemble the unified (MOCA-1289) job description
    const jd: Jd = {
      title: req.seed.title,
      titleAr: req.seed.ar || "",
      grade: req.seed.grade,
      code: versionControlService.newJdCode(),
      resp: writer.responsibilities,
      quals: { base: qual.base },
      flags: complianceResult.flags,
      confidence: complianceResult.confidence,
      verified: false,
      emp: req.seed.emp || "",
      manager: req.seed.manager || "",
      roleKey: org.roleKey,
      scopeLevel: org.scopeLevel,
      scope: org.scope,
      mandate: org.mandate,
      purposeText: writer.purpose,
      natureLine: writer.natureLine,
      authorityText: writer.authority,
      kpis: writer.kpis,
    };

    // Phase 4 — finalizing the draft
    await hooks.onPhase?.("finalize");
    const review = await qualityReview.run(jd);
    const rules = await businessRules.run(jd, complianceResult);
    jd.confidence = rules.confidence;

    return {
      jobDescription: jd,
      competencies: comps,
      compliance: complianceResult,
      review,
      referencesUsed: kb.referencesUsed,
      plan,
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
