import { useEffect, useSyncExternalStore } from "react";
import { css } from "./css";
import { store } from "./store";
import { buildVM } from "./viewModel";
import { Sidebar } from "./components/Sidebar";
import { MessageCard } from "./components/MessageCard";
import { Artifact } from "./components/Artifact";
import {
  Analytics,
  Chat,
  Composer,
  EmployeeProfile,
  KnowledgeBase,
  OrgBrowse,
  Smart,
  Welcome,
  Workspace,
} from "./components/Views";

/* eslint-disable @typescript-eslint/no-explicit-any */
function Header({ vm }: { vm: any }) {
  return (
    <header style={css("display:flex;align-items:center;gap:12px;padding:13px 24px;border-bottom:1px solid var(--line);background:var(--surface)")}>
      <div style={css("display:flex;flex-direction:column;line-height:1.25;min-width:0")}>
        <span style={css("font:700 14px/1.2 var(--sans);color:var(--ink)")}>{vm.threadTitle}</span>
      </div>
      <span style={css("flex:1")}></span>
      <button onClick={vm.toggleLang} style={css("display:flex;align-items:center;gap:7px;background:var(--surface);border:1px solid var(--line2);border-radius:999px;padding:7px 14px;font:600 12px/1 var(--sans);color:var(--ink);cursor:pointer;box-shadow:var(--sh-sm)")}>
        <iconify-icon icon="solar:global-linear" style={css("font-size:16px;color:var(--gold-d)")}></iconify-icon>{vm.langBtnLabel}
      </button>
      {vm.hasJd && (
        <button onClick={vm.toggleArtifact} style={css("display:flex;align-items:center;gap:7px;background:var(--surface);border:1px solid var(--line2);border-radius:999px;padding:7px 14px;font:600 12px/1 var(--sans);color:var(--ink);cursor:pointer;box-shadow:var(--sh-sm)")}>
          <iconify-icon icon="solar:document-text-linear" style={css("font-size:16px;color:var(--gold-d)")}></iconify-icon>{vm.artifactToggleLabel}
        </button>
      )}
    </header>
  );
}

export default function App() {
  useSyncExternalStore(store.subscribe, store.getState);
  useEffect(() => {
    store.init();
  }, []);

  const vm = buildVM(store);

  return (
    <div
      dir={vm.dir}
      style={css("display:flex;height:100vh;width:100%;background:var(--canvas);position:relative;padding:10px;gap:10px")}
    >
      <Sidebar vm={vm} />

      <main style={{ ...css("flex:1;min-width:0;display:flex;flex-direction:column;background:var(--surface);border-radius:var(--r-lg);box-shadow:var(--sh-md);overflow:hidden;transition:padding .28s ease"), paddingInlineEnd: vm.mainPadEnd }}>
        <Header vm={vm} />

        <div style={css("flex:1;min-height:0;display:flex;flex-direction:column")}>
          {vm.isWelcome && <Welcome vm={vm} />}
          {vm.isChat && <Chat vm={vm} MessageCard={MessageCard} />}
          {vm.isKB && <KnowledgeBase vm={vm} />}
          {vm.isAnalytics && <Analytics vm={vm} />}
          {vm.isWork && <Workspace vm={vm} />}
          {vm.isOrg && <OrgBrowse vm={vm} />}
          {vm.isEmployee && vm.emp && <EmployeeProfile vm={vm} />}
          {vm.isSmart && vm.smart && <Smart vm={vm} />}
          {vm.showComposer && <Composer vm={vm} />}
        </div>
      </main>

      {vm.isArtifactOpen && <Artifact vm={vm} />}
    </div>
  );
}
