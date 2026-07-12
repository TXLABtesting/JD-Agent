import { css } from "../css";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Sidebar({ vm }: { vm: any }) {
  const t = vm.t;
  return (
    <aside style={css("width:262px;flex:none;background:var(--ink2);color:#fff;display:flex;flex-direction:column;border-radius:var(--r-lg);box-shadow:var(--sh-md);overflow:hidden")}>
      <div style={css("display:flex;align-items:center;gap:10px;padding:15px 15px 12px")}>
        <div style={css("width:38px;height:38px;flex:none;border-radius:10px;overflow:hidden;background:#0E1830;box-shadow:0 1px 4px rgba(0,0,0,.35)")}>
          <img src="/assets/logo.png" alt="" style={css("width:100%;height:100%;object-fit:cover;display:block")} />
        </div>
        <div style={css("display:flex;flex-direction:column;line-height:1.2")}>
          <span style={css("font:700 13.5px/1.25 var(--sans)")}>{t.brand_title}</span>
        </div>
      </div>

      <div style={css("padding:2px 14px 0")}>
        <button onClick={vm.newJD} style={css("width:100%;display:flex;align-items:center;justify-content:center;gap:7px;background:var(--gold);color:#141C33;border:none;border-radius:999px;padding:12px;font:700 13px/1 var(--sans);cursor:pointer;box-shadow:0 2px 10px rgba(184,148,63,.28)")}>
          <iconify-icon icon="solar:add-circle-linear" style={css("font-size:18px")}></iconify-icon>{t.new_request}
        </button>
      </div>

      <nav style={css("flex:1;overflow-y:auto;padding:14px 10px 8px;display:flex;flex-direction:column;gap:13px")}>
        {vm.navGroups.map((g: any, gi: number) => (
          <div key={gi} style={css("display:flex;flex-direction:column;gap:2px")}>
            <div style={css("font:600 9.5px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:#7E8DA8;padding:3px 8px 6px;font-size:12px;text-align:right")}>{g.label}</div>
            {g.items.map((it: any, ii: number) => (
              <button key={ii} className="hov-nav" onClick={it.on} style={{ ...css("text-align:start;display:flex;align-items:center;gap:10px;border:none;border-radius:8px;padding:8px 9px;font:600 12.5px/1.25 var(--sans);cursor:pointer"), background: it.bg, color: it.fg }}>
                <iconify-icon icon={it.icon} style={{ ...css("width:18px;font-size:18px"), color: it.icColor }}></iconify-icon>
                <span style={css("flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{it.label}</span>
                {it.hasCount && (
                  <span style={css("flex:none;font:700 10px/1 var(--mono);background:rgba(255,255,255,.09);color:#C7D0E0;padding:3px 7px;border-radius:999px")}>{it.count}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div style={css("padding:9px 15px 13px;display:flex;flex-direction:column;gap:9px;border-top:1px solid rgba(255,255,255,.08)")}>
        <div style={css("display:flex;align-items:center;gap:7px")}>
          <span style={css("font:600 9px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:#7E8DA8;flex:1")}>{t.theme_label}</span>
          {vm.themeSwatches.map((th: any) => (
            <button key={th.id} onClick={th.on} title={th.name} style={{ ...css("width:22px;height:22px;flex:none;border-radius:50%;cursor:pointer;padding:0;box-shadow:0 1px 3px rgba(0,0,0,.3)"), background: th.grad, border: "2px solid " + th.ring }}></button>
          ))}
        </div>
        <div style={css("display:flex;align-items:center;gap:8px;background:var(--gold-bg);border-radius:9px;padding:8px 10px")}>
          <span style={css("width:8px;height:8px;border-radius:50%;background:var(--gold);flex:none")}></span>
          <span style={css("font:600 10.5px/1.4 var(--sans);color:var(--gold-d)")}>{t.oracle_status}</span>
        </div>
        <div style={css("display:flex;align-items:center;gap:9px")}>
          <span style={css("width:28px;height:28px;flex:none;border-radius:50%;background:#33486f;display:grid;place-items:center;font:700 11px/1 var(--sans);color:#fff")}>TS</span>
          <div style={css("line-height:1.25;min-width:0")}>
            <div style={css("font:600 12px/1.25 var(--sans);color:#fff")}>{t.role_name}</div>
            <div style={css("font:500 10.5px/1.25 var(--sans);color:#9FB0C9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>{t.role_team}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
