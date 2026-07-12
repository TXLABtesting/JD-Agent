import type { AIProvider } from "../aiProvider.interface";
import type { AiConfig } from "../config";
import type {
  GenerateTextInput,
  GenerateTextOutput,
  ProviderInfo,
  StructuredOutputInput,
} from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Anthropic Claude adapter, built on the official @anthropic-ai/sdk.
 * Defaults to claude-opus-4-8 with adaptive thinking; structured output uses
 * output_config.format (json_schema). Lazy-loaded by the factory so the SDK
 * only enters the bundle when VITE_AI_PROVIDER=claude.
 *
 * NOTE: running this in the browser requires dangerouslyAllowBrowser and exposes
 * the API key — acceptable for a local demo only. In production, route provider
 * calls through a backend/proxy (set VITE_AI_BASE_URL) and keep keys server-side.
 */
export class ClaudeProvider implements AIProvider {
  readonly info: ProviderInfo;
  private clientPromise: Promise<any> | null = null;
  private cfg: AiConfig;

  constructor(cfg: AiConfig) {
    this.cfg = cfg;
    this.info = {
      id: "claude",
      label: "Anthropic Claude",
      model: cfg.model,
      modelBacked: true,
    };
  }

  private async client() {
    if (!this.clientPromise) {
      this.clientPromise = (async () => {
        const mod: any = await import("@anthropic-ai/sdk");
        const Anthropic = mod.default ?? mod.Anthropic;
        return new Anthropic({
          apiKey: this.cfg.apiKey,
          baseURL: this.cfg.baseUrl,
          dangerouslyAllowBrowser: true,
        });
      })();
    }
    return this.clientPromise;
  }

  private textFrom(res: any): string {
    return (res?.content ?? [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const client = await this.client();
    const res = await client.messages.create(
      {
        model: this.cfg.model,
        max_tokens: input.maxTokens ?? 16000,
        system: input.system,
        thinking: { type: "adaptive" },
        output_config: { effort: input.effort ?? this.cfg.effort },
        messages: input.messages.map((m) => ({ role: m.role, content: m.content })),
      },
      { signal: input.signal },
    );
    return {
      text: this.textFrom(res),
      provider: "claude",
      model: this.cfg.model,
      usage: {
        inputTokens: res?.usage?.input_tokens,
        outputTokens: res?.usage?.output_tokens,
      },
      raw: res,
    };
  }

  async generateStructuredOutput<T>(input: StructuredOutputInput<T>): Promise<T> {
    try {
      const client = await this.client();
      const res = await client.messages.create(
        {
          model: this.cfg.model,
          max_tokens: input.maxTokens ?? 8000,
          system: input.system,
          thinking: { type: "adaptive" },
          output_config: {
            effort: input.effort ?? this.cfg.effort,
            format: { type: "json_schema", schema: input.schema },
          },
          messages: input.messages.map((m) => ({ role: m.role, content: m.content })),
        },
        { signal: input.signal },
      );
      const text = this.textFrom(res);
      return JSON.parse(text) as T;
    } catch (err) {
      // On any failure (missing key, network, parse), fall back to the grounded
      // deterministic result so the flow never breaks.
      console.warn("[claudeProvider] falling back to deterministic output:", err);
      return await input.fallback();
    }
  }
}
