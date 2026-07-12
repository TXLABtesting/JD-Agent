import { css } from "../css";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function MessageCard({ m, vm }: { m: any; vm: any }) {
  const t = vm.t;
  if (m.isUser) {
    return (
      <div style={css("display:flex;justify-content:flex-end")}>
        <div style={css("max-width:80%;background:var(--ink);color:#fff;border-radius:13px;padding:10px 14px;font:500 13.5px/1.5 var(--sans)")}>
          {m.text}
        </div>
      </div>
    );
  }
  return (
    <div style={css("display:flex;gap:11px;max-width:96%")}>
      <div style={css("width:30px;height:30px;border-radius:9px;flex:none;background:linear-gradient(150deg,var(--gold),var(--gold-d));display:grid;place-items:center;font:800 12px/1 var(--sans);color:#1C2745")}>✦</div>
      <div style={css("flex:1;min-width:0;display:flex;flex-direction:column;gap:9px")}>
        <div style={css("font:600 10.5px/1 var(--sans);color:var(--muted)")}>{t.agent_name}</div>

        {m.hasText && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:11px 14px;font:400 13.5px/1.6 var(--sans);color:#283246")}>
            {m.text}
          </div>
        )}

        {m.isOrgCard && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:13px 15px")}>
            <div style={css("font:700 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--gold-d);margin-bottom:10px")}>{t.org_locked}</div>
            <div style={css("display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font:500 12.5px/1.45 var(--sans)")}>
              <span style={css("color:var(--muted)")}>{t.f_entity}</span><span style={css("color:var(--ink);font-weight:600")}>{vm.org.entity}</span>
              <span style={css("color:var(--muted)")}>{t.f_sector}</span><span style={css("color:var(--ink);font-weight:600")}>{vm.org.sector}</span>
              <span style={css("color:var(--muted)")}>{t.f_department}</span><span style={css("color:var(--ink);font-weight:600")}>{vm.org.department}</span>
              <span style={css("color:var(--muted)")}>{t.f_section}</span><span style={css("color:var(--ink);font-weight:600")}>{vm.org.section}</span>
              <span style={css("color:var(--muted)")}>{t.f_unit}</span><span style={css("color:var(--ink);font-weight:600")}>{vm.org.unit}</span>
            </div>
          </div>
        )}

        {m.isPicker && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 15px")}>
            <div style={css("font:600 11px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:9px")}>{t.picker_label}</div>
            <select value={vm.draftTitle} onChange={vm.onPickerChange} style={css("width:100%;font:500 13.5px/1.3 var(--sans);padding:11px 12px;border:1px solid var(--line2);border-radius:9px;background:var(--paper);color:var(--ink)")}>
              <option value="">{t.picker_placeholder}</option>
              {vm.pickerGroups.map((g: any) => (
                <optgroup key={g.family} label={g.family}>
                  {g.items.map((it: any) => (
                    <option key={it.value} value={it.value}>{it.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div style={css("display:flex;gap:9px;margin-top:11px")}>
              <button onClick={vm.confirmTitle} disabled={vm.pickerEmpty} style={{ ...css("flex:none;background:var(--gold);color:#1C2745;border:none;border-radius:9px;padding:10px 16px;font:700 12.5px/1 var(--sans);cursor:pointer"), opacity: vm.confirmOpacity }}>{t.use_title}</button>
              <div style={css("flex:1;display:flex;gap:7px;align-items:center;background:var(--paper);border:1px dashed var(--line2);border-radius:9px;padding:4px;padding-inline-start:11px")}>
                <input value={vm.customTitle} onChange={vm.onCustomInput} placeholder={t.custom_ph} style={css("flex:1;border:none;background:transparent;font:500 12.5px/1.3 var(--sans);color:var(--ink);outline:none")} />
                <button onClick={vm.useCustom} style={css("flex:none;background:#fff;color:var(--ink3);border:1px solid var(--line2);border-radius:7px;padding:7px 11px;font:600 11.5px/1 var(--sans);cursor:pointer")}>{t.try_btn}</button>
              </div>
            </div>
            <div style={css("font:500 11px/1.45 var(--sans);color:var(--muted2);margin-top:9px")}>{t.picker_note}</div>
          </div>
        )}

        {m.isValidated && (
          <div style={css("background:var(--green-bg);border:1px solid #BFE3CC;border-radius:12px;padding:13px 15px")}>
            <div style={css("display:flex;align-items:center;gap:8px;margin-bottom:10px")}>
              <span style={css("width:18px;height:18px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center;font:800 10px/1 var(--sans)")}>✓</span>
              <span style={css("font:700 12.5px/1.3 var(--sans);color:#1F6E40")}>{t.validated_title}</span>
            </div>
            <div style={css("display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font:500 12.5px/1.45 var(--sans)")}>
              <span style={css("color:var(--muted)")}>{t.v_title_en}</span><span style={css("color:var(--ink);font-weight:700")}>{m.vTitle}</span>
              <span style={css("color:var(--muted)")}>{t.v_title_ar}</span><span style={css("color:var(--ink);font-weight:700;direction:rtl")}>{m.vAr}</span>
              <span style={css("color:var(--muted)")}>{t.v_family}</span><span style={css("color:var(--ink);font-weight:600")}>{m.vFamily}</span>
              <span style={css("color:var(--muted)")}>{t.v_grade}</span><span style={css("color:var(--ink);font-weight:600")}>{m.vGrade} · {t.v_grade_note}</span>
            </div>
          </div>
        )}

        {m.isAlert && (
          <div style={css("background:var(--red-bg);border:1px solid #F1C9C3;border-radius:12px;padding:13px 15px")}>
            <div style={css("display:flex;align-items:center;gap:8px;margin-bottom:7px")}>
              <span style={css("font:800 13px/1 var(--sans);color:var(--red)")}>⚠</span>
              <span style={css("font:700 12.5px/1.3 var(--sans);color:var(--red)")}>{m.alertTitle}</span>
              <span style={css("margin-inline-start:auto;font:700 9.5px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;background:#fff;border:1px solid #F1C9C3;color:var(--red);padding:3px 7px;border-radius:999px")}>{m.alertBadge}</span>
            </div>
            <div style={css("font:400 12.5px/1.6 var(--sans);color:#7A2B22")}>{m.alertBody}</div>
          </div>
        )}

        {m.isSteps && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:13px 15px;display:flex;flex-direction:column;gap:9px")}>
            {m.steps.map((step: any, i: number) => (
              <div key={i} style={css("display:flex;align-items:center;gap:10px")}>
                <span style={{ ...css("width:16px;height:16px;border-radius:50%;flex:none;display:grid;place-items:center;font:800 9px/1 var(--sans);color:#fff"), background: step.color }}>{step.icon}</span>
                <span style={{ ...css("font:500 12.5px/1.3 var(--sans)"), color: step.textColor }}>{step.label}</span>
                <span style={css("margin-inline-start:auto;font:500 10.5px/1.3 var(--mono);color:var(--muted2)")}>{step.note}</span>
              </div>
            ))}
          </div>
        )}

        {m.isTransferCompare && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("padding:11px 14px;border-bottom:1px solid var(--line);font:700 12px/1 var(--sans);color:var(--ink)")}>⇄ {t.tf_compare}</div>
            <div style={css("padding:13px 15px")}>
              <div style={css("font:600 12px/1.3 var(--sans);color:var(--ink);margin-bottom:11px")}>{m.title}</div>
              <div style={css("display:flex;align-items:center;gap:12px")}>
                <div style={css("flex:1;background:var(--paper);border:1px solid var(--line);border-radius:9px;padding:10px 12px")}>
                  <div style={css("font:600 9px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted2);margin-bottom:5px")}>{t.tf_from}</div>
                  <div style={css("font:600 12px/1.35 var(--sans);color:#5B6373")}>{m.fromTxt}</div>
                </div>
                <span style={css("flex:none;font-size:17px;color:var(--gold-d)")}>→</span>
                <div style={css("flex:1;background:var(--gold-bg);border:1px solid var(--gold);border-radius:9px;padding:10px 12px")}>
                  <div style={css("font:600 9px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:#8A6D1E;margin-bottom:5px")}>{t.tf_to}</div>
                  <div style={css("font:700 12px/1.35 var(--sans);color:#5B4A15")}>{m.toTxt}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {m.isReqForm && <ReqForm rf={vm.rf} t={t} />}

        {m.isSummaryCard && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("padding:10px 14px;border-bottom:1px solid var(--line);font:700 11.5px/1 var(--sans);color:var(--ink)")}>▤ {t.sum_title}</div>
            <div style={css("padding:8px 6px")}>
              {m.sumRows.map((r: any, i: number) => (
                <div key={i} style={css("display:flex;gap:12px;padding:6px 10px;border-bottom:1px solid var(--paper)")}>
                  <span style={css("flex:none;width:120px;font:600 11px/1.4 var(--mono);color:var(--muted)")}>{r.k}</span>
                  <span style={{ ...css("flex:1;font:600 12px/1.4 var(--sans)"), color: r.color }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {m.isValGate && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("display:flex;align-items:center;gap:9px;padding:11px 14px;border-bottom:1px solid var(--line)")}>
              <span style={css("font:700 12px/1 var(--sans);color:var(--ink)")}>✓ {t.vg_title}</span>
              <span style={css("margin-inline-start:auto;font:700 10px/1 var(--mono);background:var(--green-bg);color:#1F6E40;padding:4px 9px;border-radius:999px")}>{t.vg_ready} {m.vgReady}</span>
              <span style={css("font:700 10px/1 var(--mono);background:var(--green-bg);color:#1F6E40;padding:4px 9px;border-radius:999px")}>{t.vg_conf} {m.vgConf}</span>
            </div>
            <div style={css("padding:8px 10px;display:flex;flex-direction:column;gap:2px")}>
              {m.checks.map((c: any, i: number) => (
                <div key={i} style={css("display:flex;align-items:flex-start;gap:9px;padding:6px 6px")}>
                  <span style={{ ...css("width:16px;height:16px;flex:none;border-radius:50%;display:grid;place-items:center;font:800 9px/1 var(--sans);color:#fff"), background: c.color }}>{c.icon}</span>
                  <span style={css("font:500 12px/1.45 var(--sans);color:#283246")}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {m.isAgentRun && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--line);background:linear-gradient(160deg,#27365A,#1C2745)")}>
              <span style={css("width:7px;height:7px;border-radius:50%;background:var(--gold)")}></span>
              <span style={css("font:700 11px/1 var(--sans);color:#fff")}>{t.agentrun_title}</span>
            </div>
            <div style={css("padding:12px 14px;display:flex;flex-direction:column;gap:9px")}>
              {m.steps.map((step: any, i: number) => (
                <div key={i} style={css("display:flex;align-items:center;gap:10px")}>
                  <span style={{ ...css("width:16px;height:16px;border-radius:50%;flex:none;display:grid;place-items:center;font:800 9px/1 var(--sans);color:#fff"), background: step.color }}>{step.icon}</span>
                  <span style={{ ...css("font:500 12.5px/1.25 var(--sans)"), color: step.textColor }}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {m.isReview && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("padding:11px 14px;border-bottom:1px solid var(--line);font:700 12px/1 var(--sans);color:var(--ink)")}>◎ {t.rv_title}</div>
            <div style={css("padding:12px 14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px")}>
              {m.rvCards.map((c: any, i: number) => (
                <div key={i} style={{ ...css("border-radius:9px;padding:10px 11px"), background: c.bg }}>
                  <div style={{ ...css("font:600 9.5px/1 var(--mono);letter-spacing:.05em;text-transform:uppercase;margin-bottom:5px;opacity:.85"), color: c.fg }}>{c.label}</div>
                  <div style={{ ...css("font:800 14px/1.1 var(--sans)"), color: c.fg }}>{c.value}</div>
                </div>
              ))}
            </div>
            <div style={css("padding:0 14px 13px")}>
              <div style={css("background:var(--green-bg);border-radius:9px;padding:9px 12px;font:600 12px/1.4 var(--sans);color:#1F6E40")}>✓ {m.rvRec}</div>
            </div>
          </div>
        )}

        {m.isExplain && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <button onClick={m.toggleExp} style={css("width:100%;text-align:start;display:flex;align-items:center;gap:8px;background:none;border:none;padding:12px 14px;cursor:pointer")}>
              <span style={css("font:700 12px/1 var(--sans);color:var(--ink)")}>🛈 {t.explain_title}</span>
              <span style={css("margin-inline-start:auto;font:600 15px/1 var(--sans);color:var(--muted2)")}>{m.expChevron}</span>
            </button>
            {m.expOpen && (
              <div style={css("padding:0 14px 13px;display:flex;flex-direction:column;gap:7px")}>
                {m.expLines.map((l: string, i: number) => (
                  <div key={i} style={css("display:flex;gap:8px;align-items:flex-start")}>
                    <span style={css("flex:none;color:var(--gold-d);margin-top:2px")}>›</span>
                    <span style={css("font:400 12px/1.5 var(--sans);color:#3A434F")}>{l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {m.isTimeline && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("padding:11px 14px;border-bottom:1px solid var(--line);font:700 12px/1 var(--sans);color:var(--ink)")}>◷ {t.tl_title}</div>
            <div style={css("padding:12px 15px;display:flex;flex-direction:column")}>
              {m.tlSteps.map((step: any, i: number) => (
                <div key={i} style={css("display:flex;align-items:center;gap:11px;padding:4px 0")}>
                  <span style={{ ...css("width:18px;height:18px;flex:none;border-radius:50%;display:grid;place-items:center;font:800 9px/1 var(--sans);color:#fff"), background: step.color }}>{step.icon}</span>
                  <span style={{ font: step.font, color: step.fg }}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {m.isJdReady && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("display:flex;align-items:center;gap:11px;padding:13px 15px;background:linear-gradient(160deg,#27365A,#1C2745);color:#fff")}>
              <span style={css("width:34px;height:34px;flex:none;border-radius:9px;background:rgba(255,255,255,.12);display:grid;place-items:center;font:700 14px/1 var(--sans)")}>▤</span>
              <div style={css("min-width:0")}>
                <div style={css("font:700 13.5px/1.25 var(--sans)")}>{m.jdTitle}</div>
                <div style={css("font:500 11px/1.3 var(--mono);color:#AEB9CE")}>{m.jdMeta}</div>
              </div>
              <span style={{ ...css("margin-inline-start:auto;font:700 10px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:5px 9px;border-radius:999px"), background: m.confBg, color: m.confColor }}>{m.confLabel}</span>
            </div>
            <div style={css("padding:12px 15px;display:flex;align-items:center;gap:9px;flex-wrap:wrap")}>
              <button onClick={m.openDoc} style={css("background:var(--gold);color:#1C2745;border:none;border-radius:9px;padding:9px 15px;font:700 12.5px/1 var(--sans);cursor:pointer")}>{t.open_doc}</button>
              <span style={css("font:500 11.5px/1.45 var(--sans);color:var(--muted)")}>{m.jdSources}</span>
            </div>
          </div>
        )}

        {m.isMandate && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
            <div style={css("padding:11px 14px;border-bottom:1px solid var(--line);font:700 12px/1.3 var(--sans);color:var(--ink)")}>{t.mandate_title}</div>
            <div style={css("padding:6px 8px")}>
              {m.rows.map((r: any, i: number) => (
                <div key={i} style={css("display:flex;gap:10px;align-items:flex-start;padding:8px 7px;border-bottom:1px solid var(--paper)")}>
                  <span style={css("flex:1;font:400 12px/1.5 var(--sans);color:#283246")}>{r.text}</span>
                  <span style={{ ...css("flex:none;font:700 9.5px/1 var(--mono);letter-spacing:.03em;text-transform:uppercase;padding:4px 8px;border-radius:999px"), background: r.bg, color: r.fg }}>{r.status}</span>
                </div>
              ))}
            </div>
            <div style={{ ...css("padding:11px 14px;font:500 12px/1.55 var(--sans)"), background: m.gapBg, color: m.gapFg }}>{m.gapText}</div>
          </div>
        )}

        {m.hasChips && (
          <div style={css("display:flex;gap:8px;flex-wrap:wrap")}>
            {m.chips.map((c: any, i: number) => (
              <button key={i} onClick={c.on} style={{ ...css("font:600 12px/1.3 var(--sans);padding:9px 14px;border-radius:999px;cursor:pointer"), border: "1px solid " + c.border, background: c.bg, color: c.fg }}>{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ReqForm({ rf, t }: { rf: any; t: any }) {
  return (
    <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden")}>
      <div style={css("padding:11px 14px;border-bottom:1px solid var(--line)")}>
        <div style={css("font:700 12px/1 var(--sans);color:var(--ink)")}>▤ {t.reqform_title}</div>
        <div style={css("font:400 11px/1.4 var(--sans);color:var(--muted);margin-top:4px")}>{t.reqform_intro}</div>
      </div>
      <div style={css("padding:13px 15px;display:grid;grid-template-columns:1fr 1fr;gap:11px")}>
        {rf.fields.map((fl: any, i: number) => (
          <div key={i} style={{ ...css("display:flex;flex-direction:column;gap:4px"), gridColumn: fl.span }}>
            <label style={css("font:600 9.5px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>
              {fl.label}<span style={css("color:var(--gold-d)")}>{fl.lock}</span>
            </label>
            <select value={fl.value} onChange={fl.onChange} disabled={fl.disabled} style={{ ...css("width:100%;font:500 12.5px/1.2 var(--sans);padding:9px 10px;border:1px solid var(--line2);border-radius:8px;color:var(--ink)"), background: fl.bg }}>
              <option value="">{t.opt_select}</option>
              {fl.options.map((op: any, j: number) => (
                <option key={j} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div style={css("padding:0 15px 14px")}>
        <button onClick={rf.submit} disabled={rf.incomplete} style={{ ...css("background:var(--gold);color:#1C2745;border:none;border-radius:9px;padding:11px 18px;font:700 12.5px/1 var(--sans);cursor:pointer"), opacity: rf.opacity }}>{rf.submitLabel}</button>
      </div>
    </div>
  );
}
