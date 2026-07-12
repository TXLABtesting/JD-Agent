import { fillPrompt, JD_WRITER_SYSTEM, JD_WRITER_TASK } from "../ai/prompts";
import type { GenerationRequest, OrgContextResult, WriterResult } from "../ai/types";
import { masterDataService } from "../services/masterDataService";
import type { Bi } from "../types";
import { BaseAgent, LOOSE_OBJECT } from "./baseAgent";

/** Writes the Purpose and grouped Key Responsibilities (bilingual). */
export class JdWriterAgent extends BaseAgent {
  readonly name = "JD Writer Agent";

  run(req: GenerationRequest, org: OrgContextResult): Promise<WriterResult> {
    const fallback = (): WriterResult => {
      const arch = masterDataService.archetypeFor(req.seed);
      const src: Bi = { en: org.scope.en + " mandate", ar: "مهام " + org.scope.ar };
      return {
        purpose: arch.purpose,
        natureLine: arch.nature,
        authority: arch.authority,
        responsibilities: [{ label: arch.nature, items: arch.resp.map((r) => ({ t: r, src })) }],
        kpis: arch.kpis,
      };
    };
    const task = fillPrompt(JD_WRITER_TASK, {
      title: req.seed.title,
      titleAr: req.seed.ar || "",
      grade: req.seed.grade,
      roleKey: org.roleKey,
      scope: req.lang === "ar" ? org.scope.ar : org.scope.en,
    });
    return this.structured<WriterResult>({
      system: JD_WRITER_SYSTEM,
      messages: [{ role: "user", content: task }],
      schema: LOOSE_OBJECT,
      schemaName: "jd_body",
      fallback,
    });
  }
}
