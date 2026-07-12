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
 * OpenAI adapter (Chat Completions). Also covers Azure OpenAI and any
 * OpenAI-compatible endpoint (local LLMs, gateways) via VITE_AI_BASE_URL — Azure
 * additionally sends the key as the `api-key` header. Uses response_format
 * json_schema for structured output. REST/fetch based, no extra dependency.
 */
export class OpenAIProvider implements AIProvider {
  readonly info: ProviderInfo;
  private base: string;
  private cfg: AiConfig;

  constructor(cfg: AiConfig) {
    this.cfg = cfg;
    this.base = (cfg.baseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
    this.info = { id: "openai", label: "OpenAI", model: cfg.model, modelBacked: true };
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.cfg.apiKey ?? ""}`,
      "api-key": this.cfg.apiKey ?? "", // Azure OpenAI compatibility
    };
  }

  private async post(body: any, signal?: AbortSignal): Promise<any> {
    const res = await fetch(`${this.base}/chat/completions`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  }

  private toMessages(input: GenerateTextInput | StructuredOutputInput) {
    const msgs = input.messages.map((m) => ({ role: m.role, content: m.content }));
    return input.system ? [{ role: "system", content: input.system }, ...msgs] : msgs;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const data = await this.post(
      { model: this.cfg.model, max_tokens: input.maxTokens ?? 4096, messages: this.toMessages(input) },
      input.signal,
    );
    return {
      text: data?.choices?.[0]?.message?.content ?? "",
      provider: "openai",
      model: this.cfg.model,
      usage: {
        inputTokens: data?.usage?.prompt_tokens,
        outputTokens: data?.usage?.completion_tokens,
      },
      raw: data,
    };
  }

  async generateStructuredOutput<T>(input: StructuredOutputInput<T>): Promise<T> {
    try {
      const data = await this.post(
        {
          model: this.cfg.model,
          max_tokens: input.maxTokens ?? 4096,
          messages: this.toMessages(input),
          response_format: {
            type: "json_schema",
            json_schema: { name: input.schemaName ?? "output", schema: input.schema, strict: true },
          },
        },
        input.signal,
      );
      return JSON.parse(data?.choices?.[0]?.message?.content ?? "") as T;
    } catch (err) {
      console.warn("[openaiProvider] falling back to deterministic output:", err);
      return await input.fallback();
    }
  }
}
