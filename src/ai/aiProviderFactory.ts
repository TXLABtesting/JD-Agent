import type { AIProvider } from "./aiProvider.interface";
import { getAiConfig } from "./config";
import { LocalProvider } from "./providers/localProvider";

/**
 * Selects the AI provider from environment configuration (VITE_AI_PROVIDER).
 * Business logic asks the factory for an AIProvider and never constructs a
 * concrete provider itself — switch providers by changing configuration only.
 *
 * The default `local` provider is bundled directly; model-backed providers are
 * lazy-loaded via dynamic import so their SDKs/code stay out of the default build.
 */
let cached: Promise<AIProvider> | null = null;

async function build(): Promise<AIProvider> {
  const cfg = getAiConfig();
  switch (cfg.provider) {
    case "claude": {
      const { ClaudeProvider } = await import("./providers/claudeProvider");
      return new ClaudeProvider(cfg);
    }
    case "openai": {
      const { OpenAIProvider } = await import("./providers/openaiProvider");
      return new OpenAIProvider(cfg);
    }
    case "gemini": {
      const { GeminiProvider } = await import("./providers/geminiProvider");
      return new GeminiProvider(cfg);
    }
    case "local":
    default:
      return new LocalProvider();
  }
}

/** Get the configured provider (memoized). */
export function getProvider(): Promise<AIProvider> {
  if (!cached) cached = build();
  return cached;
}

/** Clear the memoized provider (e.g. after changing configuration in tests). */
export function resetProvider(): void {
  cached = null;
}
