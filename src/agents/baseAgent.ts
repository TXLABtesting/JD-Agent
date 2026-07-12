import type { AIProvider } from "../ai/aiProvider.interface";
import type { JsonSchema, StructuredOutputInput } from "../ai/types";

/** Minimal permissive schema; the grounded fallback carries the real shape. */
export const LOOSE_OBJECT: JsonSchema = { type: "object" };

/**
 * Base class for specialized agents. Each agent asks the injected AIProvider for
 * structured JSON and always supplies a deterministic grounded fallback (its
 * business logic). With the `local` provider the fallback is returned directly;
 * with a model-backed provider the LLM generates and validates against the
 * schema, falling back to the grounded result on failure. This keeps business
 * rules cleanly separated from AI generation.
 */
export abstract class BaseAgent {
  protected readonly provider: AIProvider;
  abstract readonly name: string;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  protected structured<T>(spec: StructuredOutputInput<T>): Promise<T> {
    return this.provider.generateStructuredOutput<T>(spec);
  }
}
