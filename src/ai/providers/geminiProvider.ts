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
 * Google Gemini adapter (Generative Language API, generateContent). Structured
 * output uses responseMimeType=application/json + responseSchema. REST/fetch
 * based, no extra dependency. Override the endpoint via VITE_AI_BASE_URL for a
 * gateway or Vertex proxy.
 */
export class GeminiProvider implements AIProvider {
  readonly info: ProviderInfo;
  private base: string;
  private cfg: AiConfig;

  constructor(cfg: AiConfig) {
    this.cfg = cfg;
    this.base = (cfg.baseUrl || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
    this.info = { id: "gemini", label: "Google Gemini", model: cfg.model, modelBacked: true };
  }

  private contents(input: GenerateTextInput | StructuredOutputInput) {
    return input.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
  }

  private async post(body: any, signal?: AbortSignal): Promise<any> {
    const url = `${this.base}/models/${this.cfg.model}:generateContent?key=${encodeURIComponent(this.cfg.apiKey ?? "")}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  }

  private textFrom(data: any): string {
    return (data?.candidates?.[0]?.content?.parts ?? [])
      .map((p: any) => p.text ?? "")
      .join("");
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const data = await this.post(
      {
        systemInstruction: input.system ? { parts: [{ text: input.system }] } : undefined,
        contents: this.contents(input),
        generationConfig: { maxOutputTokens: input.maxTokens ?? 4096 },
      },
      input.signal,
    );
    return {
      text: this.textFrom(data),
      provider: "gemini",
      model: this.cfg.model,
      usage: {
        inputTokens: data?.usageMetadata?.promptTokenCount,
        outputTokens: data?.usageMetadata?.candidatesTokenCount,
      },
      raw: data,
    };
  }

  async generateStructuredOutput<T>(input: StructuredOutputInput<T>): Promise<T> {
    try {
      const data = await this.post(
        {
          systemInstruction: input.system ? { parts: [{ text: input.system }] } : undefined,
          contents: this.contents(input),
          generationConfig: {
            maxOutputTokens: input.maxTokens ?? 4096,
            responseMimeType: "application/json",
            responseSchema: input.schema,
          },
        },
        input.signal,
      );
      return JSON.parse(this.textFrom(data)) as T;
    } catch (err) {
      console.warn("[geminiProvider] falling back to deterministic output:", err);
      return await input.fallback();
    }
  }
}
