import { css } from "../css";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function Welcome({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <div style={css("flex:1;overflow-y:auto;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:40px 28px 32px")}>
      <div style={css("width:100%;max-width:680px;margin:auto 0")}>
        <div style={css("display:flex;align-items:center;gap:12px;margin-bottom:14px")}>
          <div style={css("width:42px;height:42px;flex:none;border-radius:11px;background:linear-gradient(150deg,var(--gold),var(--gold-d));display:grid;place-items:center;font:800 18px/1 var(--sans);color:#1C2745")}>✦</div>
          <div>
            <div style={css("font:800 22px/1.18 var(--sans);color:var(--ink)")}>{t.welcome_title}</div>
            <div style={css("font:500 13px/1.45 var(--sans);color:var(--muted);margin-top:8px")}>{t.welcome_sub}</div>
          </div>
        </div>

        <div style={css("font:600 10px/1 var(--mono);letter-spacing:0px;text-transform:uppercase;color:var(--muted2);margin:24px 0 10px;font-size:14px;text-align:right;line-height:1")}>{t.request_types}</div>
        <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:11px")}>
          {vm.requestCards.map((c: any, i: number) => (
            <button key={i} className="hov-card" onClick={c.on} style={{ ...css("text-align:start;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-md);padding:16px 17px;cursor:pointer;display:flex;gap:13px;align-items:flex-start;box-shadow:var(--sh-sm);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease"), gridColumn: c.span }}>
              <span style={{ ...css("flex:none;width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-size:19px"), background: c.iconBg, color: c.iconFg }}>
                <iconify-icon icon={c.icon}></iconify-icon>
              </span>
              <span style={css("min-width:0")}>
                <span style={css("display:block;font:800 13.5px/1.25 var(--sans);color:var(--ink);margin-bottom:3px")}>{c.title}</span>
                <span style={css("display:block;font:500 11.5px/1.45 var(--sans);color:var(--muted)")}>{c.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Chat({ vm, MessageCard }: { vm: any; MessageCard: any }) {
  return (
    <div id="chatscroll" style={css("flex:1;overflow-y:auto;padding:22px 0")}>
      <div style={css("max-width:780px;margin:0 auto;padding:0 22px;display:flex;flex-direction:column;gap:18px")}>
        {vm.messages.map((m: any) => (
          <div key={m.id}>
            <MessageCard m={m} vm={vm} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function KnowledgeBase({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <div style={css("flex:1;overflow-y:auto;padding:22px 26px")}>
      <div style={css("max-width:1000px;margin:0 auto")}>
        <div style={css("font:800 20px/1.2 var(--sans);color:var(--ink);margin-bottom:3px")}>{t.nav_kb}</div>
        <div style={css("font:500 12.5px/1.4 var(--sans);color:var(--muted);margin-bottom:14px")}>{t.kb_sub}</div>
        <div style={css("display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px")}>
          {vm.kbTabs.map((tb: any) => (
            <button key={tb.key} onClick={tb.on} style={{ ...css("border-radius:999px;padding:8px 16px;font:600 12px/1 var(--sans);cursor:pointer"), background: tb.bg, color: tb.fg, border: "1px solid " + tb.bd }}>{tb.label}</button>
          ))}
        </div>

        {vm.isKBRefs && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow-x:auto")}>
            <div style={css("display:grid;grid-template-columns:2fr .5fr 1.2fr .8fr .7fr .7fr;gap:0;min-width:720px;background:var(--paper);border-bottom:1px solid var(--line);font:700 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted)")}>
              <div style={css("padding:10px 12px")}>{t.kb_col_file}</div><div style={css("padding:10px 12px")}>{t.kb_col_type}</div><div style={css("padding:10px 12px")}>{t.kb_col_org}</div><div style={css("padding:10px 12px")}>{t.kb_col_date}</div><div style={css("padding:10px 12px")}>{t.kb_col_status}</div><div style={css("padding:10px 12px")}>{t.kb_col_used}</div>
            </div>
            {vm.kbRefs.map((r: any, i: number) => (
              <div key={i} className="hov-row" style={css("display:grid;grid-template-columns:2fr .5fr 1.2fr .8fr .7fr .7fr;gap:0;min-width:720px;border-bottom:1px solid var(--paper);align-items:center")}>
                <div style={css("padding:10px 12px;font:600 12px/1.35 var(--sans);color:var(--ink);min-width:0")}>{r.name}</div>
                <div style={css("padding:10px 12px;font:700 10px/1 var(--mono);color:var(--muted)")}>{r.type}</div>
                <div style={css("padding:10px 12px;font:500 11.5px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{r.org}</div>
                <div style={css("padding:10px 12px;font:500 11px/1.2 var(--mono);color:var(--muted2)")}>{r.date}</div>
                <div style={css("padding:10px 12px")}><span style={{ ...css("font:700 9px/1 var(--mono);letter-spacing:.03em;text-transform:uppercase;padding:4px 7px;border-radius:999px"), background: r.stBg, color: r.stFg }}>{r.stLabel}</span></div>
                <div style={css("padding:10px 12px")}><span style={{ ...css("font:700 9px/1 var(--mono);letter-spacing:.03em;text-transform:uppercase;padding:4px 7px;border-radius:999px"), background: r.usedBg, color: r.usedFg }}>{r.usedLabel}</span></div>
              </div>
            ))}
          </div>
        )}

        {vm.isKBData && (
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow-x:auto")}>
            <div style={css("display:grid;grid-template-columns:1.4fr 1.6fr;gap:0;min-width:520px;background:var(--paper);border-bottom:1px solid var(--line);font:700 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted)")}>
              <div style={css("padding:10px 12px")}>{t.kb_col_dataset}</div><div style={css("padding:10px 12px")}>{t.kb_col_source}</div>
            </div>
            {vm.kbData.map((d: any, i: number) => (
              <div key={i} className="hov-row" style={css("display:grid;grid-template-columns:1.4fr 1.6fr;gap:0;min-width:520px;border-bottom:1px solid var(--paper);align-items:center")}>
                <div style={css("padding:10px 12px;font:600 12px/1.3 var(--sans);color:var(--ink)")}>{d.name}</div>
                <div style={css("padding:10px 12px;font:500 11.5px/1.3 var(--sans);color:#33406A")}>{d.src}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Analytics({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <div style={css("flex:1;overflow-y:auto;padding:22px 26px")}>
      <div style={css("max-width:1000px;margin:0 auto")}>
        <div style={css("font:800 20px/1.2 var(--sans);color:var(--ink);margin-bottom:3px")}>{t.an_title}</div>
        <div style={css("font:500 12.5px/1.4 var(--sans);color:var(--muted);margin-bottom:18px")}>{t.an_sub}</div>

        <div style={css("display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px")}>
          {vm.anKpis.map((k: any, i: number) => (
            <div key={i} style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:15px 16px")}>
              <div style={css("font:600 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;font-size:12px")}>{k.label}</div>
              <div style={{ ...css("font:800 26px/1 var(--sans)"), color: k.color }}>{k.value}</div>
              <div style={css("font:500 11px/1.3 var(--sans);color:var(--muted2);margin-top:5px")}>{k.note}</div>
            </div>
          ))}
        </div>

        <div style={css("display:grid;grid-template-columns:1.3fr 1fr;gap:16px")}>
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 18px")}>
            <div style={css("font:700 12.5px/1 var(--sans);color:var(--ink);margin-bottom:14px")}>{t.an_by_status}</div>
            {vm.anStatus.map((sr: any, i: number) => (
              <div key={i} style={css("margin-bottom:12px")}>
                <div style={css("display:flex;justify-content:space-between;margin-bottom:5px")}>
                  <span style={css("font:600 11.5px/1 var(--sans);color:#33406A")}>{sr.label}</span>
                  <span style={css("font:700 11px/1 var(--mono);color:var(--muted)")}>{sr.count}</span>
                </div>
                <div style={css("height:8px;background:var(--paper);border-radius:999px;overflow:hidden")}>
                  <div style={{ ...css("height:100%;border-radius:999px"), width: sr.pct, background: sr.color }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 18px")}>
            <div style={css("font:700 12.5px/1 var(--sans);color:var(--ink);margin-bottom:14px")}>{t.an_by_dept}</div>
            {vm.anDept.map((d: any, i: number) => (
              <div key={i} style={css("display:flex;align-items:center;gap:10px;margin-bottom:12px")}>
                <div style={css("flex:1;min-width:0")}>
                  <div style={css("font:600 11.5px/1.3 var(--sans);color:#33406A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{d.label}</div>
                </div>
                <div style={css("flex:none;width:90px;height:7px;background:var(--paper);border-radius:999px;overflow:hidden")}>
                  <div style={{ ...css("height:100%;background:var(--gold);border-radius:999px"), width: d.pct }}></div>
                </div>
                <span style={css("flex:none;font:700 11px/1 var(--mono);color:var(--muted);width:22px;text-align:end")}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Workspace({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <div style={css("flex:1;overflow-y:auto;padding:22px 26px")}>
      <div style={css("max-width:1000px;margin:0 auto")}>
        <div style={css("font:800 20px/1.2 var(--sans);color:var(--ink);margin-bottom:14px")}>{vm.workTitle}</div>
        <div style={css("display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px")}>
          {vm.workTabs.map((tb: any) => (
            <button key={tb.key} onClick={tb.on} style={{ ...css("display:flex;align-items:center;gap:7px;border-radius:999px;padding:8px 14px;font:600 12px/1 var(--sans);cursor:pointer"), background: tb.bg, color: tb.fg, border: "1px solid " + tb.bd }}>{tb.label}<span style={css("font:700 10px/1 var(--mono);opacity:.7")}>{tb.count}</span></button>
          ))}
        </div>
        <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow-x:auto")}>
          <div style={css("display:grid;grid-template-columns:.7fr 1.3fr 1fr .5fr 1fr .9fr auto;gap:0;min-width:680px;background:var(--paper);border-bottom:1px solid var(--line);font:700 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted)")}>
            <div style={css("padding:10px 12px")}>{t.col_ref}</div><div style={css("padding:10px 12px")}>{t.col_employee}</div><div style={css("padding:10px 12px")}>{t.col_title}</div><div style={css("padding:10px 12px")}>{t.col_grade}</div><div style={css("padding:10px 12px")}>{t.col_jd}</div><div style={css("padding:10px 12px")}>{t.col_updated}</div><div style={css("padding:10px 12px")}></div>
          </div>
          {vm.workItems.map((w: any, i: number) => (
            <div key={i} className="hov-row" style={css("display:grid;grid-template-columns:.7fr 1.3fr 1fr .5fr 1fr .9fr auto;gap:0;min-width:680px;border-bottom:1px solid var(--paper);align-items:center")}>
              <div style={css("padding:10px 12px;font:600 11px/1.2 var(--mono);color:var(--muted)")}>{w.id}</div>
              <div style={css("padding:10px 12px;font:600 12.5px/1.3 var(--sans);color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{w.emp}</div>
              <div style={css("padding:10px 12px;font:500 12px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{w.title}</div>
              <div style={css("padding:10px 12px;font:600 12px/1 var(--mono);color:var(--ink)")}>{w.grade}</div>
              <div style={css("padding:10px 12px")}><span style={{ ...css("font:700 9px/1 var(--mono);letter-spacing:.03em;text-transform:uppercase;padding:4px 7px;border-radius:999px"), background: w.stBg, color: w.stFg }}>{w.stLabel}</span></div>
              <div style={css("padding:10px 12px;font:500 11px/1.2 var(--mono);color:var(--muted2)")}>{w.updated}</div>
              <div style={css("padding:8px 12px;display:flex;justify-content:flex-end")}>
                {w.canOpen && (
                  <button className="hov-open" onClick={w.open} style={css("font:700 10.5px/1 var(--mono);letter-spacing:.03em;padding:7px 14px;border-radius:8px;border:1px solid var(--blue);background:var(--blue);color:#fff;cursor:pointer;white-space:nowrap")}>{t.open_edit}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrgBrowse({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <div style={css("flex:1;overflow-y:auto;padding:22px 26px")}>
      <div style={css("max-width:1120px;margin:0 auto")}>
        <div style={css("font:800 20px/1.2 var(--sans);color:var(--ink);margin-bottom:3px")}>{vm.recTitle}</div>
        <div style={css("font:500 12.5px/1.4 var(--sans);color:var(--muted);margin-bottom:18px")}>{vm.recSub}</div>
        <div style={css("display:grid;grid-template-columns:210px 1fr;gap:18px;align-items:start")}>
          <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 10px")}>
            <div style={css("font:600 10px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted2);padding:4px 8px 8px")}>{t.org_tree}</div>
            {vm.orgTree.map((n: any, i: number) => (
              <button key={i} onClick={n.on} style={{ ...css("width:100%;text-align:start;display:flex;align-items:center;gap:8px;border:none;border-radius:8px;padding:8px 9px;margin-bottom:2px;cursor:pointer"), background: n.bg, paddingInlineStart: n.indent }}>
                <span style={{ ...css("font-size:11px"), color: n.dot }}>{n.icon}</span>
                <span style={{ ...css("flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"), font: n.font, color: n.fg }}>{n.label}</span>
              </button>
            ))}
          </div>
          <div style={css("min-width:0")}>
            {vm.isRecEmployees && (
              <>
                <div style={css("display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap")}>
                  <div style={css("font:700 15px/1.2 var(--sans);color:var(--ink)")}>{vm.unitName}</div>
                  <span style={css("font:600 11px/1 var(--mono);color:var(--muted2)")}>{vm.unitCount}</span>
                </div>
                <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow-x:auto")}>
                  <div style={css("display:grid;grid-template-columns:1.5fr 1fr .5fr 1fr .9fr .6fr auto;gap:0;min-width:660px;background:var(--paper);border-bottom:1px solid var(--line);font:700 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted)")}>
                    <div style={css("padding:10px 12px")}>{t.col_employee}</div><div style={css("padding:10px 12px;font-size:8px")}>{t.col_title}</div><div style={css("padding:10px 12px;font-size:8px")}>{t.col_grade}</div><div style={css("padding:10px 12px;font-size:8px")}>{t.direct_manager}</div><div style={css("padding:10px 12px;font-size:8px")}>{t.col_jd}</div><div style={css("padding:10px 12px;font-size:8px")}>{t.jd_version}</div><div style={css("padding:10px 12px")}></div>
                  </div>
                  {vm.employees.map((e: any, i: number) => (
                    <div key={i} className="hov-row" style={css("display:grid;grid-template-columns:1.5fr 1fr .5fr 1fr .9fr .6fr auto;gap:0;min-width:660px;border-bottom:1px solid var(--paper);align-items:center")}>
                      <div style={css("padding:10px 12px;min-width:0")}>
                        <div style={css("font:600 12.5px/1.3 var(--sans);color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{e.name}</div>
                        <div style={css("font:500 10.5px/1.2 var(--mono);color:var(--muted2)")}>{e.id}</div>
                      </div>
                      <div style={css("padding:10px 12px;font:500 12px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{e.title}</div>
                      <div style={css("padding:10px 12px;font:600 12px/1 var(--mono);color:var(--ink)")}>{e.grade}</div>
                      <div style={css("padding:10px 12px;font:500 11.5px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{e.manager}</div>
                      <div style={css("padding:10px 12px")}><span style={{ ...css("font:700 9px/1 var(--mono);letter-spacing:.03em;text-transform:uppercase;padding:4px 7px;border-radius:999px"), background: e.stBg, color: e.stFg }}>{e.stLabel}</span></div>
                      <div style={css("padding:10px 12px;font:600 11px/1 var(--mono);color:var(--muted)")}>{e.ver}</div>
                      <div style={css("padding:8px 12px")}><button onClick={e.open} style={css("background:var(--surface);border:1px solid var(--line2);border-radius:7px;padding:6px 11px;font:600 11px/1 var(--sans);color:var(--ink);cursor:pointer;white-space:nowrap")}>{t.open_profile}</button></div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {vm.isRecPositions && (
              <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow-x:auto")}>
                <div style={css("display:grid;grid-template-columns:1.6fr .5fr 1fr .7fr;gap:0;min-width:560px;background:var(--paper);border-bottom:1px solid var(--line);font:700 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted)")}>
                  <div style={css("padding:10px 12px")}>{t.col_position}</div><div style={css("padding:10px 12px")}>{t.col_grade}</div><div style={css("padding:10px 12px")}>{t.col_family}</div><div style={css("padding:10px 12px")}>{t.col_headcount}</div>
                </div>
                {vm.positions.map((p: any, i: number) => (
                  <div key={i} className="hov-row" style={css("display:grid;grid-template-columns:1.6fr .5fr 1fr .7fr;gap:0;min-width:560px;border-bottom:1px solid var(--paper);align-items:center")}>
                    <div style={css("padding:10px 12px;min-width:0")}>
                      <div style={css("font:600 12.5px/1.3 var(--sans);color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{p.title}</div>
                      <div style={css("font:500 10.5px/1.2 var(--sans);color:var(--muted2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{p.sub}</div>
                    </div>
                    <div style={css("padding:10px 12px;font:600 12px/1 var(--mono);color:var(--ink)")}>{p.grade}</div>
                    <div style={css("padding:10px 12px;font:500 11.5px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{p.family}</div>
                    <div style={css("padding:10px 12px;font:600 12px/1 var(--mono);color:var(--muted)")}>{p.count}</div>
                  </div>
                ))}
              </div>
            )}

            {vm.isRecOrg && (
              <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow-x:auto")}>
                <div style={css("display:grid;grid-template-columns:1.2fr 1.2fr 1.2fr .6fr auto;gap:0;min-width:600px;background:var(--paper);border-bottom:1px solid var(--line);font:700 10px/1.2 var(--mono);letter-spacing:.03em;text-transform:uppercase;color:var(--muted)")}>
                  <div style={css("padding:10px 12px")}>{t.col_department}</div><div style={css("padding:10px 12px")}>{t.col_section}</div><div style={css("padding:10px 12px")}>{t.col_unit}</div><div style={css("padding:10px 12px")}>{t.col_headcount}</div><div style={css("padding:10px 12px")}></div>
                </div>
                {vm.orgUnits.map((u: any, i: number) => (
                  <div key={i} className="hov-row" style={css("display:grid;grid-template-columns:1.2fr 1.2fr 1.2fr .6fr auto;gap:0;min-width:600px;border-bottom:1px solid var(--paper);align-items:center")}>
                    <div style={css("padding:10px 12px;font:500 11.5px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{u.department}</div>
                    <div style={css("padding:10px 12px;font:500 11.5px/1.3 var(--sans);color:#33406A;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{u.section}</div>
                    <div style={css("padding:10px 12px;font:600 12.5px/1.3 var(--sans);color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{u.unit}</div>
                    <div style={css("padding:10px 12px;font:600 12px/1 var(--mono);color:var(--muted)")}>{u.count}</div>
                    <div style={css("padding:8px 12px")}><button onClick={u.open} style={css("background:var(--surface);border:1px solid var(--line2);border-radius:7px;padding:6px 11px;font:600 11px/1 var(--sans);color:var(--ink);cursor:pointer;white-space:nowrap")}>{t.open_profile}</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmployeeProfile({ vm }: { vm: any }) {
  const t = vm.t;
  const emp = vm.emp;
  return (
    <div style={css("flex:1;overflow-y:auto;padding:22px 26px")}>
      <div style={css("max-width:820px;margin:0 auto")}>
        <button onClick={vm.backToOrg} style={css("background:none;border:none;color:var(--muted);font:600 12px/1 var(--sans);cursor:pointer;margin-bottom:14px;padding:0")}>‹ {t.back_org}</button>
        <div style={css("background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:20px 22px;margin-bottom:16px")}>
          <div style={css("display:flex;align-items:center;gap:14px")}>
            <span style={css("width:52px;height:52px;flex:none;border-radius:50%;background:#EAEEF6;display:grid;place-items:center;font:700 17px/1 var(--sans);color:#33486f")}>{emp.initials}</span>
            <div style={css("min-width:0")}>
              <div style={css("font:800 19px/1.2 var(--sans);color:var(--ink)")}>{emp.name}</div>
              <div style={css("font:500 12.5px/1.3 var(--sans);color:var(--muted)")}>{emp.title} · {t.col_grade} {emp.grade} · {emp.id}</div>
            </div>
            <span style={{ ...css("margin-inline-start:auto;font:700 9.5px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:5px 10px;border-radius:999px"), background: emp.stBg, color: emp.stFg }}>{emp.stLabel}</span>
          </div>
          <div style={css("display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px 18px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line)")}>
            <ProfileField label={t.f_department} value={emp.department} />
            <ProfileField label={t.f_section} value={emp.section} />
            <ProfileField label={t.f_unit} value={emp.unit} />
            <ProfileField label={t.direct_manager} value={emp.manager} />
            <ProfileField label={t.years_service} value={emp.yos} />
            <ProfileField label={t.jd_version} value={emp.ver} />
          </div>
          <div style={css("display:flex;gap:9px;margin-top:16px;flex-wrap:wrap")}>
            <button onClick={emp.download} disabled={emp.noApproved} style={{ ...css("background:var(--ink);border:none;border-radius:9px;padding:9px 15px;font:700 12px/1 var(--sans);color:#fff;cursor:pointer"), opacity: emp.dlOpacity }}>⭳ {t.download_jd}</button>
            <button onClick={emp.update} style={css("background:var(--gold);border:none;border-radius:9px;padding:9px 15px;font:700 12px/1 var(--sans);color:#1C2745;cursor:pointer")}>⟳ {t.update_jd}</button>
          </div>
          {emp.noApproved && (
            <div style={css("margin-top:11px;font:500 11.5px/1.5 var(--sans);color:var(--amber)")}>⚠ {t.no_approved_jd}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div style={css("font:600 9.5px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted2);margin-bottom:4px")}>{label}</div>
      <div style={css("font:600 12px/1.3 var(--sans);color:var(--ink)")}>{value}</div>
    </div>
  );
}

export function Smart({ vm }: { vm: any }) {
  const t = vm.t;
  const smart = vm.smart;
  return (
    <div style={css("flex:1;overflow-y:auto;padding:0;background:linear-gradient(180deg,#1C2745,#243154)")}>
      <div style={css("max-width:440px;margin:0 auto;padding:22px 16px 40px")}>
        <div style={css("display:flex;align-items:center;gap:10px;margin-bottom:16px")}>
          <button onClick={vm.backChat} style={css("background:rgba(255,255,255,.12);border:none;color:#fff;border-radius:8px;padding:8px 12px;font:600 12px/1 var(--sans);cursor:pointer")}>‹ {t.c_back_chat}</button>
          <span style={css("flex:1")}></span>
          <span style={css("font:700 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:#E7B7AE;background:rgba(199,70,52,.2);padding:5px 9px;border-radius:999px")}>{t.smart_title}</span>
        </div>
        <div style={css("background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.3)")}>
          <div style={css("background:linear-gradient(150deg,var(--gold),var(--gold-d));padding:20px 20px 16px;color:#1C2745")}>
            <div style={css("font:700 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;opacity:.8;margin-bottom:8px")}>{t.smart_sub}</div>
            <div style={css("font:800 20px/1.2 var(--sans)")}>{smart.title}</div>
            <div style={css("font:600 13px/1.4 var(--sans);direction:rtl;text-align:start")}>{smart.titleAr}</div>
            <div style={css("font:600 12px/1.3 var(--sans);margin-top:6px;opacity:.85")}>{t.col_grade} {smart.grade} · {smart.unit}</div>
          </div>
          <div style={css("padding:18px 20px;display:flex;flex-direction:column;gap:16px")}>
            <div>
              <div style={css("font:800 11px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d);margin-bottom:6px")}>{t.s_purpose}</div>
              <div style={css("font:400 13px/1.6 var(--sans);color:#283246")}>{smart.purpose}</div>
            </div>
            <div>
              <div style={css("font:800 11px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d);margin-bottom:6px")}>{t.s_resp}</div>
              {smart.resp.map((r: string, i: number) => (
                <div key={i} style={css("display:flex;gap:8px;align-items:flex-start;margin-bottom:7px")}>
                  <span style={css("flex:none;width:5px;height:5px;border-radius:1px;background:var(--gold-d);margin-top:7px")}></span>
                  <span style={css("font:400 12.5px/1.55 var(--sans);color:#283246")}>{r}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={css("font:800 11px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d);margin-bottom:6px")}>{t.s_quals}</div>
              <div style={css("font:400 12.5px/1.55 var(--sans);color:#283246")}>{smart.quals}</div>
            </div>
            <div>
              <div style={css("font:800 11px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--gold-d);margin-bottom:6px")}>{t.s_comp}</div>
              <div style={css("display:flex;gap:7px;flex-wrap:wrap")}>
                {smart.comps.map((c: string, i: number) => (
                  <span key={i} style={css("font:600 11.5px/1 var(--sans);background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:6px 11px;color:#33406A")}>{c}</span>
                ))}
              </div>
            </div>
            <div style={css("border-top:1px solid var(--line);padding-top:14px")}>
              <div style={css("font:400 11px/1.5 var(--sans);color:var(--muted2);margin-bottom:11px")}>{t.smart_note}</div>
              {vm.smartAcked && (
                <div style={css("background:var(--green-bg);border-radius:10px;padding:12px;text-align:center;font:700 13px/1.3 var(--sans);color:#1F6E40")}>✓ {t.smart_acked}</div>
              )}
              {vm.smartNotAcked && (
                <button onClick={vm.ackSmart} style={css("width:100%;background:var(--ink);border:none;border-radius:11px;padding:14px;font:700 14px/1 var(--sans);color:#fff;cursor:pointer")}>{t.smart_ack}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Composer({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <div style={css("padding:16px 24px 20px;border-top:1px solid var(--line);background:var(--surface)")}>
      <div style={css("max-width:780px;margin:0 auto")}>
        <div className="composer-wrap" style={css("display:flex;align-items:flex-end;gap:9px;background:var(--surface2);border:1px solid var(--line2);border-radius:22px;padding:8px;padding-inline-start:18px;box-shadow:var(--sh-sm);transition:border-color .16s ease,box-shadow .16s ease")}>
          <textarea value={vm.input} onChange={vm.onInput} onKeyDown={vm.onKey} rows={1} placeholder={t.composer_ph} style={css("flex:1;border:none;outline:none;resize:none;background:transparent;font:400 13.5px/1.5 var(--sans);color:var(--ink);max-height:120px;padding:8px 0")} />
          <button onClick={vm.send} style={css("flex:none;width:40px;height:40px;border-radius:50%;border:none;background:var(--gold);color:#141C33;font:700 17px/1 var(--sans);cursor:pointer;box-shadow:0 2px 8px rgba(184,148,63,.3);display:grid;place-items:center")}>
            <iconify-icon icon="solar:arrow-up-linear" style={css("font-size:20px")}></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  );
}
