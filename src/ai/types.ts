import type { Bi, Flag, Jd, Lang, RespGroup, Seed } from "../types";

/* ============================================================================
 * Provider-layer types — the contract every AI provider speaks. The rest of the
 * application depends only on these + AIProvider, never on a concrete provider.
 * ========================================================================== */

export type ChatRole = "system" | "user" | "assistant";
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Reasoning-effort hint. Providers that don't support it ignore it. */
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export interface GenerateTextInput {
  system?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  effort?: Effort;
  signal?: AbortSignal;
}

export interface TokenUsage {
  inputTokens?: number;
  outputTokens?: number;
}

export interface GenerateTextOutput {
  text: string;
  provider: string;
  model: string;
  usage?: TokenUsage;
  raw?: unknown;
}

/** A JSON Schema object constraining structured output. */
export type JsonSchema = Record<string, unknown>;

export interface StructuredOutputInput<T = unknown> {
  system?: string;
  messages: ChatMessage[];
  /** JSON Schema the output must satisfy. */
  schema: JsonSchema;
  /** Human-readable schema name (used by some providers). */
  schemaName?: string;
  maxTokens?: number;
  effort?: Effort;
  signal?: AbortSignal;
  /**
   * Deterministic grounded result. The `local` provider returns this directly;
   * model-backed providers fall back to it if a live call fails. This is how the
   * business/grounding layer (agents + services) stays separate from AI
   * generation while the demo keeps working offline.
   */
  fallback: () => T | Promise<T>;
}

export interface ProviderInfo {
  /** Stable identifier, e.g. "claude" | "openai" | "gemini" | "local". */
  id: string;
  /** Human label for UI / logs. */
  label: string;
  /** Configured model id (empty for the deterministic local provider). */
  model: string;
  /** True when a real LLM backs this provider (vs. deterministic rules). */
  modelBacked: boolean;
}

/* ============================================================================
 * Agent-layer types — the structured JSON each specialized agent returns.
 * ========================================================================== */

export type RequestType =
  | "create"
  | "existing"
  | "update"
  | "transfer"
  | "prejoin";

export interface GenerationRequest {
  requestType: RequestType;
  seed: Seed;
  lang: Lang;
  /** For transfers: the destination unit id. */
  targetUnit?: string;
}

export interface OrgContextResult {
  roleKey: string;
  scopeLevel: string;
  scope: Bi;
  mandate: Bi;
  reporting: Bi;
}

export interface KnowledgeResult {
  referencesUsed: string[];
}

export interface WriterResult {
  purpose: Bi;
  natureLine: Bi;
  authority: Bi;
  responsibilities: RespGroup[];
  kpis: Bi[];
}

export interface QualificationResult {
  base?: string;
  flags: Flag[];
}

export interface CompetencyRow {
  name: Bi;
  level: string;
}
export interface CompetencyResult {
  core: CompetencyRow[];
  leadership: CompetencyRow[];
  hasLeadership: boolean;
}

export interface ComplianceResult {
  titleApproved: boolean;
  gradeValid: boolean;
  mandateAvailable: boolean;
  confidence: "high" | "medium" | "low";
  flags: Flag[];
}

export interface QualityReviewResult {
  overallConfidence: "high" | "medium" | "low";
  qualityScore: number;
  compliancePass: boolean;
  duplicateRisk: string;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

export interface BusinessRulesResult {
  confidence: "high" | "medium" | "low";
  flags: Flag[];
}

export interface SupervisorPlan {
  requestType: RequestType;
  agents: string[];
}

/** The full structured output of a generation run. */
export interface GenerationResult {
  jobDescription: Jd;
  competencies: CompetencyResult;
  compliance: ComplianceResult;
  review: QualityReviewResult;
  referencesUsed: string[];
  plan: SupervisorPlan;
}
