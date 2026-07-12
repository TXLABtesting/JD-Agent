import { css } from "../css";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Artifact({ vm }: { vm: any }) {
  const t = vm.t;
  const jd = vm.jd;
  return (
    <aside style={css("position:absolute;top:0;inset-inline-end:0;bottom:0;width:min(480px,92vw);z-index:20;background:var(--surface);border-inline-start:1px solid var(--line2);box-shadow:0 0 34px rgba(20,33,58,.16);display:flex;flex-direction:column;animation:panelin .28s ease both")}>
      <div style={css("display:flex;align-items:center;gap:10px;padding:13px 18px;border-bottom:1px solid var(--line)")}>
        <span style={css("font:700 9.5px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--red);background:var(--red-bg);border:1px solid #F1C9C3;padding:4px 8px;border-radius:5px")}>{t.confidential}</span>
        <span style={css("font:600 11px/1 var(--mono);color:var(--muted2)")}>{jd.code}</span>
        <span style={css("flex:1")}></span>
        <span style={{ ...css("font:700 9.5px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:5px 9px;border-radius:999px"), background: jd.confBg, color: jd.confColor }}>{jd.confLabel}</span>
        <button onClick={vm.closeArtifact} style={css("width:28px;height:28px;border-radius:7px;border:1px solid var(--line2);background:var(--surface);color:var(--muted);font:600 14px/1 var(--sans);cursor:pointer")}>✕</button>
      </div>

      <div style={css("flex:1;overflow-y:auto;padding:20px 22px")}>
        <div style={css("font:500 11px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--gold-d);margin-bottom:4px")}>{t.unified_label}</div>
        <div style={css("font:800 20px/1.2 var(--sans);color:var(--ink);margin-bottom:3px")}>{jd.title}</div>
        <div style={css("font:600 12.5px/1.3 var(--sans);color:var(--muted);direction:rtl;text-align:start;margin-bottom:16px")}>{jd.titleAr}</div>

        {jd.hasFlags && (
          <div style={css("background:var(--amber-bg);border:1px solid #E7D3A0;border-radius:10px;padding:11px 13px;margin-bottom:16px")}>
            <div style={css("font:700 10.5px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;color:#8A6D1E;margin-bottom:7px")}>⚠ {t.missing_alerts}</div>
            {jd.flags.map((f: string, i: number) => (
              <div key={i} style={css("font:500 12px/1.5 var(--sans);color:#6B5618")}>• {f}</div>
            ))}
          </div>
        )}

        <div style={css("border:1px solid var(--line);border-radius:9px;overflow:hidden;margin-bottom:18px")}>
          <div style={css("display:grid;grid-template-columns:38% 1fr")}>
            {jd.hasEmp && (
              <>
                <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px")}>{t.id_employee}</div>
                <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.empName}</div>
              </>
            )}
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px")}>{t.id_title}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.title}<span style={css("color:var(--muted)")}> · {jd.titleAr}</span></div>
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px;border-top:1px solid rgba(255,255,255,.12)")}>{t.id_grade}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.grade}</div>
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px;border-top:1px solid rgba(255,255,255,.12)")}>{t.id_sector}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.sector}</div>
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px;border-top:1px solid rgba(255,255,255,.12)")}>{t.id_department}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.department}</div>
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px;border-top:1px solid rgba(255,255,255,.12)")}>{t.id_section}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.section}</div>
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px;border-top:1px solid rgba(255,255,255,.12)")}>{t.id_unit}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans);border-bottom:1px solid var(--line)")}>{jd.unit}</div>
            <div style={css("background:#6C7480;color:#fff;font:700 11.5px/1.3 var(--sans);padding:8px 11px;border-top:1px solid rgba(255,255,255,.12)")}>{t.id_reporting}</div>
            <div style={css("padding:8px 11px;font:600 12px/1.3 var(--sans)")}>{jd.reporting}</div>
          </div>
        </div>

        <div style={css("margin-bottom:18px")}>
          <div style={css("display:flex;align-items:baseline;gap:8px;margin-bottom:7px")}>
            <span style={css("font:800 11.5px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d)")}>{t.s_purpose}</span>
            <span style={css("font:600 11px/1 var(--sans);color:var(--muted2);direction:rtl")}>الغرض من الدور</span>
          </div>
          <div style={css("font:400 12.8px/1.65 var(--sans);color:#283246")}>{jd.purpose}</div>
        </div>

        <div style={css("margin-bottom:18px")}>
          <div style={css("display:flex;align-items:baseline;gap:8px;margin-bottom:6px")}>
            <span style={css("font:800 11.5px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d)")}>{t.s_resp}</span>
            <span style={css("font:600 11px/1 var(--sans);color:var(--muted2);direction:rtl")}>المسؤوليات الرئيسية</span>
          </div>
          <div style={css("font:400 11.5px/1.45 var(--sans);color:var(--muted);margin-bottom:9px")}>{t.resp_intro}</div>
          {jd.respGroups.map((grp: any, gi: number) => (
            <div key={gi} style={css("margin-bottom:11px")}>
              <div style={css("font:700 12px/1.3 var(--sans);color:var(--ink);margin-bottom:5px")}>{grp.grp}</div>
              {grp.items.map((it: any, ii: number) => (
                <div key={ii} style={css("display:flex;gap:8px;align-items:flex-start;margin-bottom:6px")}>
                  <span style={css("flex:none;width:5px;height:5px;border-radius:1px;background:var(--ink3);margin-top:8px")}></span>
                  <textarea className="resp-edit" value={it.text} onChange={it.onEdit} rows={2} style={css("flex:1;border:1px solid transparent;border-radius:6px;background:transparent;font:400 12.4px/1.5 var(--sans);color:#283246;resize:vertical;padding:3px 5px;min-height:34px")} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={css("margin-bottom:18px")}>
          <div style={css("display:flex;align-items:baseline;gap:8px;margin-bottom:7px")}>
            <span style={css("font:800 11.5px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d)")}>{t.s_quals}</span>
            <span style={css("font:600 11px/1 var(--sans);color:var(--muted2);direction:rtl")}>المؤهلات</span>
          </div>
          {jd.qualsLines.map((q: any, i: number) => (
            <div key={i} style={css("display:flex;gap:8px;align-items:flex-start;margin-bottom:6px")}>
              <span style={css("flex:none;width:5px;height:5px;border-radius:1px;background:var(--ink3);margin-top:7px")}></span>
              <span style={{ ...css("font:400 12.4px/1.5 var(--sans)"), color: q.color }}>{q.text}</span>
            </div>
          ))}
        </div>

        <div style={css("margin-bottom:8px")}>
          <div style={css("display:flex;align-items:baseline;gap:8px;margin-bottom:8px")}>
            <span style={css("font:800 11.5px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d)")}>{t.s_comp}</span>
            <span style={css("font:600 11px/1 var(--sans);color:var(--muted2);direction:rtl")}>الكفاءات</span>
          </div>
          <div style={css("font:600 11px/1.3 var(--sans);color:var(--muted);margin-bottom:5px")}>{t.core_label} · الكفاءات الأساسية</div>
          <div style={css("border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-bottom:11px")}>
            {jd.coreRows.map((c: any, i: number) => (
              <div key={i} style={css("display:flex;align-items:center;justify-content:space-between;padding:7px 11px;border-bottom:1px solid var(--paper)")}>
                <span style={css("font:500 12px/1.3 var(--sans);color:#283246")}>{c.name}</span>
                <span style={{ ...css("font:700 10px/1 var(--sans);padding:3px 9px;border-radius:999px"), background: c.bg, color: c.fg }}>{c.level}</span>
              </div>
            ))}
          </div>
          <div style={css("font:600 11px/1.3 var(--sans);color:var(--muted);margin-bottom:5px")}>{t.lead_label} · الكفاءات القيادية</div>
          {jd.hasLead && (
            <div style={css("border:1px solid var(--line);border-radius:8px;overflow:hidden")}>
              {jd.leadRows.map((c: any, i: number) => (
                <div key={i} style={css("display:flex;align-items:center;justify-content:space-between;padding:7px 11px;border-bottom:1px solid var(--paper)")}>
                  <span style={css("font:500 12px/1.3 var(--sans);color:#283246")}>{c.name}</span>
                  <span style={{ ...css("font:700 10px/1 var(--sans);padding:3px 9px;border-radius:999px"), background: c.bg, color: c.fg }}>{c.level}</span>
                </div>
              ))}
            </div>
          )}
          {jd.noLead && (
            <div style={css("background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:9px 12px;font:500 11.5px/1.45 var(--sans);color:var(--muted)")}>{jd.noLeadText}</div>
          )}
        </div>
      </div>

      <div style={css("border-top:1px solid var(--line);padding:12px 16px;display:flex;align-items:center;gap:9px;flex-wrap:wrap")}>
        <button onClick={vm.exportDoc} style={css("background:var(--surface);border:1px solid var(--line2);border-radius:9px;padding:9px 13px;font:600 12px/1 var(--sans);color:var(--ink);cursor:pointer;display:inline-flex;align-items:center;gap:6px")}>
          <iconify-icon icon="solar:download-minimalistic-linear" style={css("font-size:15px;color:var(--gold-d)")}></iconify-icon>{t.download_word}
        </button>
        <button onClick={vm.approveRoute} style={css("background:var(--green);border:none;border-radius:9px;padding:9px 13px;font:700 12px/1 var(--sans);color:#fff;cursor:pointer")}>{t.approve_btn}</button>
        <span style={css("flex:1")}></span>
        <span style={css("font:600 10px/1.35 var(--mono);color:var(--muted2);text-align:end")}>{t.oracle_ready}</span>
      </div>
    </aside>
  );
}
