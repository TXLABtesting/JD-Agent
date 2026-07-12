import type {
  GenerateTextInput,
  GenerateTextOutput,
  ProviderInfo,
  StructuredOutputInput,
} from "./types";

/**
 * The single abstraction every AI model provider must implement. Business logic,
 * agents and the orchestrator depend ONLY on this interface — never on a concrete
 * provider — so the app is model- and vendor-agnostic. Swap providers via the
 * factory + environment configuration without touching any calling code.
 */
export interface AIProvider {
  /** Static metadata about the configured provider/model. */
  readonly info: ProviderInfo;

  /** Free-form text generation. */
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;

  /**
   * Schema-constrained generation. Returns validated, typed JSON. The
   * deterministic `local` provider satisfies this from `input.fallback`;
   * model-backed providers call the LLM and validate against `input.schema`,
   * falling back to `input.fallback` on failure.
   */
  generateStructuredOutput<T>(input: StructuredOutputInput<T>): Promise<T>;

  /** Optional token streaming for chat-style surfaces. */
  streamText?(input: GenerateTextInput): AsyncIterable<string>;
}
