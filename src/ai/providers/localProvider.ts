import type { AIProvider } from "../aiProvider.interface";
import type {
  GenerateTextInput,
  GenerateTextOutput,
  ProviderInfo,
  StructuredOutputInput,
} from "../types";

/**
 * Deterministic, offline provider — the default. It is not backed by an LLM;
 * instead it returns the grounded, rule-based result the agents compute from the
 * official references (`input.fallback`). This keeps the prototype fully working
 * with mock data and no network/keys, while exercising the exact same provider
 * interface a real model would. Selected when VITE_AI_PROVIDER=local (default).
 */
export class LocalProvider implements AIProvider {
  readonly info: ProviderInfo = {
    id: "local",
    label: "Local (deterministic demo)",
    model: "",
    modelBacked: false,
  };

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const lastUser = [...input.messages].reverse().find((m) => m.role === "user");
    return { text: lastUser?.content ?? "", provider: "local", model: "" };
  }

  async generateStructuredOutput<T>(input: StructuredOutputInput<T>): Promise<T> {
    return await input.fallback();
  }
}
