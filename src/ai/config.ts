/**
 * AI layer configuration, resolved from environment variables (Vite `import.meta.env`).
 * Copy `.env.example` to `.env` to override. Nothing here is secret by default —
 * the app ships with `AI_PROVIDER=local` (deterministic, no network, no keys).
 *
 * Supported:
 *   VITE_AI_PROVIDER   = local | claude | openai | gemini   (default: local)
 *   VITE_AI_MODEL      = model id override for the selected provider
 *   VITE_AI_EFFORT     = low | medium | high | xhigh | max   (default: high)
 *   VITE_ANTHROPIC_API_KEY / VITE_OPENAI_API_KEY / VITE_GEMINI_API_KEY
 *   VITE_AI_BASE_URL   = optional base-url override (e.g. a proxy, Azure/local LLM)
 */
import type { Effort } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ENV: Record<string, string | undefined> = (import.meta as any).env || {};

export type ProviderId = "local" | "claude" | "openai" | "gemini";

const DEFAULT_MODELS: Record<ProviderId, string> = {
  local: "",
  claude: "claude-opus-4-8",
  openai: "gpt-4o",
  gemini: "gemini-2.5-flash",
};

export interface AiConfig {
  provider: ProviderId;
  model: string;
  effort: Effort;
  apiKey?: string;
  baseUrl?: string;
}

function resolveProvider(): ProviderId {
  const p = (ENV.VITE_AI_PROVIDER || "local").toLowerCase();
  return (["local", "claude", "openai", "gemini"].includes(p) ? p : "local") as ProviderId;
}

function apiKeyFor(provider: ProviderId): string | undefined {
  switch (provider) {
    case "claude":
      return ENV.VITE_ANTHROPIC_API_KEY;
    case "openai":
      return ENV.VITE_OPENAI_API_KEY;
    case "gemini":
      return ENV.VITE_GEMINI_API_KEY;
    default:
      return undefined;
  }
}

export function getAiConfig(): AiConfig {
  const provider = resolveProvider();
  return {
    provider,
    model: ENV.VITE_AI_MODEL || DEFAULT_MODELS[provider],
    effort: (ENV.VITE_AI_EFFORT as Effort) || "high",
    apiKey: apiKeyFor(provider),
    baseUrl: ENV.VITE_AI_BASE_URL,
  };
}
