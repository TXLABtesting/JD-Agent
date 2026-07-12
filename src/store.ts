import {
  CORE,
  EMPLOYEES,
  EXISTING,
  LEAD,
  MASTER,
  REQUESTS,
  THEMES,
  TITLES,
} from "./data";
import { DICT } from "./i18n";
import { jobDescriptionService } from "./services/jobDescriptionService";
import type { RequestType } from "./ai/types";
import type {
  AppState,
  Bi,
  Chip,
  Employee,
  Message,
  Seed,
  TitleRec,
} from "./types";

type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);

const REDUCE_MOTION =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion:reduce)").matches;

export class Store {
  state: AppState;
  private listeners = new Set<() => void>();
  private mid = 0;
  private reduce = REDUCE_MOTION;

  constructor() {
    this.state = {
      lang: "ar",
      theme: "navy",
      view: "welcome",
      threadKey: "thread_new",
      messages: [],
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      input: "",
      draftTitle: "",
      customTitle: "",
      expOpen: {},
      orgSel: "txteam",
      empSel: null,
      smartAcked: false,
      intake: null,
      reqForm: null,
    };
    // bind all methods so closures/handlers keep `this`
    const proto = Object.getOwnPropertyNames(Store.prototype);
    for (const k of proto) {
      const v = (this as unknown as Record<string, unknown>)[k];
      if (k !== "constructor" && typeof v === "function") {
        (this as unknown as Record<string, unknown>)[k] = (v as Function).bind(
          this,
        );
      }
    }
  }

  // ---- store plumbing ----
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getState = () => this.state;
  private emit() {
    this.listeners.forEach((l) => l());
  }
  setState(patch: Patch) {
    const next = typeof patch === "function" ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.emit();
  }

  init() {
    try {
      const saved = localStorage.getItem("moca_theme");
      this.applyTheme(saved && THEMES[saved] ? saved : "navy");
    } catch {
      this.applyTheme("navy");
    }
  }
  applyTheme(id: string) {
    const th = THEMES[id];
    if (!th) return;
    const r = document.documentElement;
    Object.keys(th.v).forEach((k) => r.style.setProperty(k, th.v[k]));
    try {
      localStorage.setItem("moca_theme", id);
    } catch {
      /* ignore */
    }
    this.setState({ theme: id });
  }

  // ---------- helpers ----------
  fmt(s: string, p?: Record<string, string | number> | null) {
    return (s || "").replace(/\{(\w+)\}/g, (_m, k) =>
      p && p[k] != null ? String(p[k]) : "",
    );
  }
  T() {
    return DICT[this.state.lang];
  }
  wait(ms: number) {
    return new Promise<void>((r) => setTimeout(r, this.reduce ? 0 : ms));
  }
  coreLevel(g: string) {
    const M = +g.split(".")[0];
    return M <= 2 ? "developing" : M === 3 ? "proficient" : "advanced";
  }
  leadLevel(g: string): string | null {
    if (g === "4.1") return "proficient";
    const M = +g.split(".")[0];
    return M >= 4 ? "advanced" : null;
  }
  scrollEnd() {
    requestAnimationFrame(() => {
      const el = document.getElementById("chatscroll");
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
  push(msg: Partial<Message>) {
    (msg as Message).id = ++this.mid;
    this.setState((s) => ({
      view: "chat",
      messages: [...s.messages, msg as Message],
    }));
    this.scrollEnd();
    return (msg as Message).id;
  }
  agent(
    tkey?: string | null,
    params?: Record<string, string | number> | null,
    extra?: Partial<Message>,
  ) {
    return this.push(
      Object.assign(
        { role: "agent", tkey: tkey || null, params: params || null },
        extra || {},
      ) as Partial<Message>,
    );
  }
  user(text: string) {
    return this.push({ role: "user", text });
  }

  toggleLang() {
    this.setState((s) => ({ lang: s.lang === "en" ? "ar" : "en" }));
  }

  /** Map the current thread to a JD request type for the orchestrator. */
  private reqType(): RequestType {
    switch (this.state.threadKey) {
      case "thread_transfer": return "transfer";
      case "thread_prejoin": return "prejoin";
      case "thread_existing": return "existing";
      case "thread_update": return "update";
      default: return "create";
    }
  }

  resetThread(key: string) {
    this.setState({
      view: "chat",
      threadKey: key,
      messages: [],
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      draftTitle: "",
      customTitle: "",
      intake: null,
      reqForm: null,
    });
    this.mid = 0;
  }
  openThread(key: string, msgs: Partial<Message>[]) {
    const m = (msgs || []).map(
      (x, i) => Object.assign({ id: i + 1, role: "agent" }, x) as Message,
    );
    this.mid = m.length;
    this.setState({
      view: "chat",
      threadKey: key,
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      draftTitle: "",
      customTitle: "",
      intake: null,
      reqForm: null,
      messages: m,
    });
  }
  append(msgs: Partial<Message>[], extra?: Partial<AppState>) {
    const items = (msgs || []).map(
      (x) => Object.assign({ id: ++this.mid }, x) as Message,
    );
    this.setState((s) =>
      Object.assign({ view: "chat", messages: [...s.messages, ...items] }, extra || {}),
    );
  }
  newJD() {
    this.setState({
      view: "welcome",
      threadKey: "thread_new",
      messages: [],
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      draftTitle: "",
      customTitle: "",
      intake: null,
      reqForm: null,
    });
    this.mid = 0;
  }
  openOrg(unit?: string | null, mode?: AppState["recordsMode"]) {
    this.setState({
      view: "org",
      recordsMode: mode || "employees",
      orgSel: unit || "txteam",
      empSel: null,
    });
  }
  openWork(filter?: string) {
    this.setState({ view: "work", workFilter: filter || "all" });
  }
  openKB(tab?: string) {
    this.setState({ view: "kb", kbTab: tab || "refs" });
  }
  openAnalytics() {
    this.setState({ view: "analytics" });
  }
  selectUnit(id: string) {
    this.setState({ orgSel: id, empSel: null });
  }
  openUnitRecords(id: string) {
    this.setState({ view: "org", recordsMode: "employees", orgSel: id, empSel: null });
  }
  openEmployee(id: string) {
    this.setState({ view: "employee", empSel: id });
  }
  backToOrg() {
    this.setState({ view: "org", empSel: null });
  }
  empUpdate(id: string) {
    const e = EMPLOYEES.find((x) => x.id === id);
    if (!e) return;
    this.resetThread("thread_update");
    const rec = TITLES.find((t) => t.en === e.titleEn);
    if (rec) {
      this.setState({
        flow: "update",
        seed: {
          title: rec.en,
          ar: rec.ar,
          family: rec.family,
          grade: rec.grade,
          approved: true,
          emp: e.en,
        },
      });
      setTimeout(() => {
        this.agent(
          "m_opened_existing",
          { title: e.titleEn, emp: e.en, v: e.ver },
          {
            hasChips: true,
            chips: [{ labelKey: "c_generate_updated", action: "generate", variant: "solid" }],
          },
        );
      }, 30);
    } else {
      setTimeout(() => {
        this.agent(null, null, {
          isAlert: true,
          akey: "alert_legacy",
          params: { emp: e.en, title: e.titleEn, grade: e.grade },
        });
        this.agent("m_remap_prompt", { title: e.titleEn }, {
          hasChips: true,
          chips: [
            { labelKey: "c_remap_analyst", action: "remap", payload: "Analyst", variant: "solid" },
            { labelKey: "c_remap_sanalyst", action: "remap", payload: "Senior Analyst" },
            { labelKey: "c_remap_executive", action: "remap", payload: "Executive" },
          ],
        });
      }, 30);
    }
  }

  startCreate() {
    this.openThread("thread_create", [
      { tkey: "m_create_org", isOrgCard: true },
      { tkey: "m_pick", isPicker: true },
    ]);
  }
  startVerify() {
    if (this.state.jd) {
      this.verify();
      return;
    }
    this.openThread("thread_verify", [
      {
        tkey: "m_verify_intro",
        hasChips: true,
        chips: [
          { labelKey: "c_create", action: "create", variant: "solid" },
          { labelKey: "c_update", action: "update" },
        ],
      },
    ]);
  }
  startReview() {
    this.startVerify();
  }

  startNew() {
    this.mid = 1;
    this.setState({
      view: "chat",
      threadKey: "thread_create",
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      draftTitle: "",
      customTitle: "",
      intake: null,
      reqForm: {
        mode: "employee",
        entity: "moca",
        sector: "central",
        dept: "hr",
        section: "tx",
        unit: "txteam",
        employee: "",
        empId: "",
        title: "",
        titleAr: "",
        grade: "",
        manager: "",
        reason: "",
      },
      messages: [{ id: 1, role: "agent", isReqForm: true }],
    });
  }
  newEmp() {
    this.append([{ role: "agent", isReqForm: true }], {
      intake: null,
      reqForm: {
        mode: "employee",
        entity: "moca",
        sector: "central",
        dept: "hr",
        section: "tx",
        unit: "txteam",
        employee: "",
        empId: "",
        title: "",
        titleAr: "",
        grade: "",
        manager: "",
        reason: "",
      },
    });
  }
  newPos() {
    this.append([{ role: "agent", isReqForm: true }], {
      intake: null,
      reqForm: {
        mode: "position",
        entity: "moca",
        sector: "central",
        dept: "hr",
        section: "tx",
        unit: "txteam",
        positionId: "",
        title: "",
        titleAr: "",
        grade: "",
        manager: "",
        reason: "",
      },
    });
  }
  setForm(field: string, val: string) {
    this.setState((s) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rf: any = Object.assign({}, s.reqForm);
      rf[field] = val;
      if (field === "entity") {
        rf.sector = "";
        rf.dept = "";
        rf.section = "";
        rf.unit = "";
      }
      if (field === "sector") {
        rf.dept = "";
        rf.section = "";
        rf.unit = "";
      }
      if (field === "dept") {
        rf.section = "";
        rf.unit = "";
      }
      if (field === "section") {
        rf.unit = "";
      }
      if (field === "title") {
        const t = TITLES.find((x) => x.en === val);
        if (t) {
          rf.grade = t.grade;
          rf.titleAr = t.ar;
          rf.family = t.family;
        }
      }
      if (field === "employee") {
        const e = EMPLOYEES.find((x) => x.en === val);
        if (e) {
          rf.empId = e.id;
          rf.title = e.titleEn;
          rf.titleAr = e.titleAr;
          rf.grade = e.grade;
          rf.manager = e.mgrEn;
          const t = TITLES.find((x) => x.en === e.titleEn);
          rf.family = t ? t.family : "";
        }
      }
      return { reqForm: rf as unknown as AppState["reqForm"] };
    });
  }
  submitReqForm() {
    const rf = this.state.reqForm;
    if (!rf) return;
    const sum: string[] = [];
    sum.push(
      rf.mode === "employee"
        ? rf.employee + " · " + rf.empId
        : rf.positionId || this.T().pos_none,
    );
    sum.push(rf.title + " · " + rf.grade);
    this.append([{ role: "user", text: sum.join("  |  ") }], {
      reqForm: null,
      seed: {
        title: rf.title,
        ar: rf.titleAr,
        grade: rf.grade,
        family: rf.family,
        approved: true,
        emp: rf.employee || "",
        manager: rf.manager || "",
      },
    });
    setTimeout(() => this.generateJD(), 120);
  }
  startExisting() {
    this.mid = 1;
    this.setState({
      view: "chat",
      threadKey: "thread_existing",
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      draftTitle: "",
      customTitle: "",
      intake: null,
      reqForm: {
        mode: "employee",
        entity: "moca",
        sector: "central",
        dept: "hr",
        section: "tx",
        unit: "txteam",
        employee: "",
        empId: "",
        title: "",
        titleAr: "",
        grade: "",
        manager: "",
        reason: "",
      },
      messages: [{ id: 1, role: "agent", isReqForm: true }],
    });
  }

  // ---- intake flow (legacy chip-driven; retained for completeness) ----
  intakeEmployee() {
    this.agent("m_create_org", null, { isOrgCard: true });
    this.agent("intake_emp", null, {
      hasChips: true,
      chips: EMPLOYEES.slice(0, 4).map((e, i) => ({
        label: (this.state.lang === "ar" ? e.ar : e.en) + " · " + e.id,
        action: "pickEmp",
        payload: e.id,
        variant: i === 0 ? "solid" : null,
      })),
    });
  }
  pickPos(id: string) {
    const f = Object.assign({}, this.state.intake && this.state.intake.f, {
      positionId: id || this.T().pos_none,
    });
    this.setState({ intake: { mode: "position", f } });
    this.user(id || this.T().pos_none);
    setTimeout(() => this.agent("intake_title", null, { isPicker: true }), 200);
  }
  pickEmp(id: string) {
    const e = EMPLOYEES.find((x) => x.id === id);
    if (!e) return;
    const AR = this.state.lang === "ar";
    this.user((AR ? e.ar : e.en) + " · " + e.id);
    const rec = TITLES.find((t) => t.en === e.titleEn);
    const f = Object.assign({}, this.state.intake && this.state.intake.f, {
      mode: "employee",
      employee: AR ? e.ar : e.en,
      empId: e.id,
      empRec: e.en,
      title: e.titleEn,
      titleAr: e.titleAr,
      grade: e.grade,
      manager: AR ? e.mgrAr : e.mgrEn,
      mgrEn: e.mgrEn,
      approvedTitle: !!rec,
    });
    this.setState({ intake: { mode: "employee", f } });
    setTimeout(() => {
      if (rec) {
        this.agent("intake_confirm_title", { title: e.titleEn }, {
          isSummaryLive: true,
          hasChips: true,
          chips: [
            { labelKey: "c_keep_title", action: "keepTitle", variant: "solid" },
            { labelKey: "c_change_title", action: "changeIntakeTitle" },
          ],
        });
      } else {
        this.agent(null, null, {
          isAlert: true,
          akey: "alert_legacy",
          params: { emp: AR ? e.ar : e.en, title: e.titleEn, grade: e.grade },
        });
        this.agent("m_remap_prompt", { title: e.titleEn }, {
          hasChips: true,
          chips: [
            { labelKey: "c_remap_analyst", action: "intakeRemap", payload: "Analyst", variant: "solid" },
            { labelKey: "c_remap_sanalyst", action: "intakeRemap", payload: "Senior Analyst" },
            { labelKey: "c_remap_executive", action: "intakeRemap", payload: "Executive" },
          ],
        });
      }
    }, 220);
  }
  keepTitle() {
    const e = EMPLOYEES.find(
      (x) => x.en === (this.state.intake && (this.state.intake.f as { empRec?: string }).empRec),
    );
    const rec = TITLES.find((t) => t.en === (e && e.titleEn));
    if (rec) {
      this.setIntakeTitle(rec);
      this.intakeAskReason();
    }
  }
  changeIntakeTitle() {
    this.agent("intake_title", null, { isPicker: true });
  }
  intakeRemap(en: string) {
    const rec = TITLES.find((t) => t.en === en)!;
    this.user(this.fmt(this.T().u_remap, { title: rec.en }));
    this.setIntakeTitle(rec);
    setTimeout(() => this.intakeAskReason(), 200);
  }
  setIntakeTitle(rec: TitleRec) {
    const f = Object.assign({}, this.state.intake && this.state.intake.f, {
      title: rec.en,
      titleAr: rec.ar,
      grade: rec.grade,
      family: rec.family,
      approvedTitle: true,
    });
    this.setState({ intake: Object.assign({}, this.state.intake, { f }) as AppState["intake"] });
  }
  intakeAskManager() {
    this.agent("intake_mgr", null, {
      isSummaryLive: true,
      hasChips: true,
      chips: [
        { labelKey: "mgr1", action: "pickMgr", payload: 0, variant: "solid" },
        { labelKey: "mgr2", action: "pickMgr", payload: 1 },
      ],
    });
  }
  pickMgr(i: number) {
    const lbl = i === 0 ? this.T().mgr1 : this.T().mgr2;
    const f = Object.assign({}, this.state.intake!.f, { manager: lbl });
    this.setState({ intake: Object.assign({}, this.state.intake, { f }) as AppState["intake"] });
    this.user(lbl);
    setTimeout(() => this.intakeAskReason(), 180);
  }
  intakeAskReason() {
    this.agent("intake_reason", null, {
      isSummaryLive: true,
      hasChips: true,
      chips: [
        { labelKey: "reason1", action: "pickReason", payload: 0, variant: "solid" },
        { labelKey: "reason2", action: "pickReason", payload: 1 },
        { labelKey: "reason3", action: "pickReason", payload: 2 },
        { labelKey: "reason4", action: "pickReason", payload: 3 },
      ],
    });
  }
  pickReason(i: number) {
    const r = [this.T().reason1, this.T().reason2, this.T().reason3, this.T().reason4][i];
    const f = Object.assign({}, this.state.intake!.f, { reason: r });
    this.setState({ intake: Object.assign({}, this.state.intake, { f }) as AppState["intake"] });
    this.user(r);
    setTimeout(() => this.intakeFinish(), 180);
  }
  intakeFinish() {
    const f = this.state.intake!.f as Record<string, string>;
    this.setState({
      seed: {
        title: f.title,
        ar: f.titleAr,
        grade: f.grade,
        family: f.family,
        approved: true,
        emp: f.employee,
      },
    });
    this.agent("intake_summary", null, { isSummary: true });
    setTimeout(() => this.validationGate(), 240);
  }
  startPromotion() {
    this.openThread("thread_update", [
      { tkey: "m_promo_intro", isPromo: true },
      {
        hasChips: true,
        chips: [{ labelKey: "c_update_jd_now", action: "remap", payload: "Senior Analyst", variant: "solid" }],
      },
    ]);
  }
  startTransfer() {
    const AR = this.state.lang === "ar";
    this.openThread("thread_transfer", [
      {
        tkey: "m_transfer_intro",
        hasChips: true,
        chips: EMPLOYEES.slice(0, 3).map((e, i) => ({
          label: (AR ? e.ar : e.en) + " · " + e.id,
          action: "transferEmp",
          payload: e.id,
          variant: i === 0 ? "solid" : null,
        })),
      },
    ]);
  }
  transferEmp(id: string) {
    const e = EMPLOYEES.find((x) => x.id === id);
    if (!e) return;
    const AR = this.state.lang === "ar";
    this.append(
      [
        { role: "user", text: (AR ? e.ar : e.en) + " · " + e.id },
        { role: "agent", tkey: "tf_new_loc", isReqForm: true },
      ],
      {
        reqForm: {
          mode: "transfer",
          employee: e.en,
          empId: e.id,
          title: e.titleEn,
          titleAr: e.titleAr,
          grade: e.grade,
          manager: e.mgrEn,
          fromUnit: e.unit,
          entity: "moca",
          sector: "",
          dept: "",
          section: "",
          unit: "",
          reason: "transfer",
        },
      },
    );
  }
  unitHasMandate(unitId: string) {
    return unitId === "txteam" || unitId === "insight";
  }
  submitTransfer() {
    const rf = this.state.reqForm;
    if (!rf) return;
    const AR = this.state.lang === "ar";
    const M = MASTER;
    const fromU = M.units.find((u) => u.id === rf.fromUnit)!;
    const toU = M.units.find((u) => u.id === rf.unit)!;
    const rec = TITLES.find((t) => t.en === rf.title);
    const hasM = this.unitHasMandate(rf.unit);
    const msgs: Partial<Message>[] = [
      {
        role: "agent",
        tkey: "tf_compare",
        isTransferCompare: true,
        fromTxt: AR ? fromU.ar : fromU.en,
        toTxt: AR ? toU.ar : toU.en,
        title: (AR ? rf.titleAr : rf.title) + " · " + rf.grade,
        emp: rf.employee,
      },
    ];
    if (!hasM) {
      msgs.push({ role: "agent", isAlert: true, akey: "tf_mandate_missing" });
    }
    this.append(msgs, {
      reqForm: null,
      seed: {
        title: rf.title,
        ar: rf.titleAr,
        grade: rf.grade,
        family: rec ? rec.family : "",
        approved: true,
        emp: rf.employee,
        manager: rf.manager || "",
        targetUnit: rf.unit,
      },
    });
    setTimeout(() => this.generateJD(), 140);
  }
  startUpdate() {
    const AR = this.state.lang === "ar";
    this.openThread("thread_update", [
      {
        tkey: "m_update_which",
        hasChips: true,
        chips: EMPLOYEES.filter((e) => e.jd !== "none")
          .slice(0, 3)
          .map((e, i) => ({
            label: (AR ? e.ar : e.en) + " · " + e.titleEn,
            action: "updateEmp",
            payload: e.id,
            variant: i === 0 ? "solid" : null,
          })),
      },
    ]);
  }
  updateEmp(id: string) {
    const e = EMPLOYEES.find((x) => x.id === id);
    if (!e) return;
    const AR = this.state.lang === "ar";
    const rec = TITLES.find((t) => t.en === e.titleEn);
    if (rec) {
      this.append(
        [
          { role: "user", text: (AR ? e.ar : e.en) + " · " + e.titleEn },
          {
            role: "agent",
            tkey: "m_opened_existing",
            params: { title: e.titleEn, emp: e.en, v: e.ver },
            hasChips: true,
            chips: [{ labelKey: "c_generate_updated", action: "generate", variant: "solid" }],
          },
        ],
        {
          flow: "update",
          seed: {
            title: rec.en,
            ar: rec.ar,
            family: rec.family,
            grade: rec.grade,
            approved: true,
            emp: e.en,
            manager: AR ? e.mgrAr : e.mgrEn,
          },
        },
      );
    } else {
      this.append([
        { role: "user", text: (AR ? e.ar : e.en) + " · " + e.titleEn },
        { role: "agent", isAlert: true, akey: "alert_legacy", params: { emp: e.en, title: e.titleEn, grade: e.grade } },
        {
          role: "agent",
          tkey: "m_remap_prompt",
          params: { title: e.titleEn },
          hasChips: true,
          chips: [
            { labelKey: "c_remap_analyst", action: "remap", payload: "Analyst", variant: "solid" },
            { labelKey: "c_remap_sanalyst", action: "remap", payload: "Senior Analyst" },
            { labelKey: "c_remap_executive", action: "remap", payload: "Executive" },
          ],
        },
      ]);
    }
  }
  startPreJoin() {
    this.mid = 1;
    this.setState({
      view: "chat",
      threadKey: "thread_prejoin",
      flow: null,
      seed: null,
      jd: null,
      artifactOpen: false,
      draftTitle: "",
      customTitle: "",
      intake: null,
      reqForm: {
        mode: "prejoin",
        entity: "moca",
        sector: "",
        dept: "",
        section: "",
        unit: "",
        title: "",
        titleAr: "",
        grade: "",
        manager: "",
      },
      messages: [
        { id: 1, role: "agent", tkey: "m_prejoin_form" },
        { id: 2, role: "agent", isReqForm: true },
      ],
    });
    this.mid = 2;
  }

  promptCreate() {
    this.user(this.T().try_create);
    setTimeout(() => this.beginWithTitle("Senior Analyst"), 260);
  }
  promptUpdate() {
    this.user(this.T().try_update);
    setTimeout(() => this.loadExisting(1, true), 260);
  }
  promptVerify() {
    this.user(this.T().try_verify);
    setTimeout(() => this.startVerify(), 260);
  }

  beginWithTitle(en: string) {
    this.resetThread("thread_create");
    const rec = TITLES.find((t) => t.en === en);
    setTimeout(() => {
      this.agent("m_creating_fixed", null, { isOrgCard: true });
      if (rec) {
        this.acceptTitle(rec);
      } else {
        this.agent("m_pick_short", null, { isPicker: true });
      }
    }, 20);
  }

  dispatch(action: string, payload?: unknown) {
    switch (action) {
      case "create": this.startCreate(); break;
      case "newEmp": this.newEmp(); break;
      case "newPos": this.newPos(); break;
      case "existRecords": this.intakeEmployee(); break;
      case "intakeEmp": this.intakeEmployee(); break;
      case "pickPos": this.pickPos(payload as string); break;
      case "pickEmp": this.pickEmp(payload as string); break;
      case "keepTitle": this.keepTitle(); break;
      case "changeIntakeTitle": this.changeIntakeTitle(); break;
      case "intakeRemap": this.intakeRemap(payload as string); break;
      case "pickMgr": this.pickMgr(payload as number); break;
      case "pickReason": this.pickReason(payload as number); break;
      case "submitReqForm": this.submitReqForm(); break;
      case "transferEmp": this.transferEmp(payload as string); break;
      case "submitTransfer": this.submitTransfer(); break;
      case "updateEmp": this.updateEmp(payload as string); break;
      case "openEmpProfile": this.openEmployee(payload as string); break;
      case "empJd": this.updateEmp(payload as string); break;
      case "update": this.startUpdate(); break;
      case "loadExisting": this.loadExisting(payload as number); break;
      case "generate": this.validationGate(); break;
      case "runGen": this.generateJD(); break;
      case "differentTitle":
      case "pickApproved": this.askAgainTitle(); break;
      case "addAdmin": this.addViaAdmin(); break;
      case "remap": this.remapTo(payload as string); break;
      case "verify": this.verify(); break;
      case "openDoc": this.setState({ artifactOpen: true }); break;
      case "openApproved": this.openWork("approved"); break;
      case "approve": this.approveRoute(); break;
      case "approveFinal": this.approveFinal(); break;
      case "returnChanges": this.returnChanges(); break;
      case "submit": this.submitApproval(); break;
      case "openSmart": this.openSmart(); break;
      case "exportDoc": this.exportDoc(); break;
    }
  }

  askAgainTitle() {
    this.setState({ draftTitle: "", customTitle: "" });
    this.agent("m_no_problem_pick", null, { isPicker: true });
  }

  confirmTitle() {
    const en = this.state.draftTitle;
    if (!en) return;
    const rec = TITLES.find((t) => t.en === en);
    if (!rec) return;
    this.user(rec.en + " · " + rec.ar);
    this.setState({ draftTitle: "" });
    if (this.state.intake && this.state.intake.mode) {
      this.setIntakeTitle(rec);
      const mode = this.state.intake.mode;
      setTimeout(() => {
        if (mode === "position") this.intakeAskManager();
        else this.intakeAskReason();
      }, 180);
      return;
    }
    this.acceptTitle(rec);
  }

  acceptTitle(rec: TitleRec) {
    this.setState({
      seed: { title: rec.en, ar: rec.ar, family: rec.family, grade: rec.grade, approved: true },
    });
    setTimeout(() => {
      this.agent(null, null, {
        isValidated: true,
        vTitle: rec.en,
        vAr: rec.ar,
        vFamilyKey: rec.family,
        vGrade: rec.grade,
      });
      this.agent("m_ask_generate", { grade: rec.grade }, {
        hasChips: true,
        chips: [
          { labelKey: "c_generate", action: "generate", variant: "solid" },
          { labelKey: "c_different_title", action: "differentTitle" },
        ],
      });
    }, 280);
  }

  useCustom() {
    const t = this.state.customTitle.trim();
    if (!t) return;
    this.user(t);
    this.setState({ seed: { title: t, grade: "", approved: false } });
    setTimeout(() => {
      this.agent(null, null, { isAlert: true, akey: "alert_custom", params: { t } });
      this.agent("m_how_proceed", null, {
        hasChips: true,
        chips: [
          { labelKey: "c_choose_approved", action: "pickApproved", variant: "solid" },
          { labelKey: "c_request_admin", action: "addAdmin" },
        ],
      });
    }, 280);
  }

  addViaAdmin() {
    this.agent("m_admin_logged", null, {
      hasChips: true,
      chips: [{ labelKey: "c_choose_approved", action: "pickApproved", variant: "solid" }],
    });
  }

  loadExisting(i: number, echo?: boolean) {
    const r = EXISTING[i];
    if (echo !== true) this.user(this.fmt(this.T().u_update, { title: r.title, emp: r.emp }));
    if (!r.approved) {
      setTimeout(() => {
        this.agent(null, null, {
          isAlert: true,
          akey: "alert_legacy",
          params: { emp: r.emp, title: r.title, grade: r.grade },
        });
        this.agent("m_remap_prompt", { title: r.title }, {
          hasChips: true,
          chips: [
            { labelKey: "c_remap_analyst", action: "remap", payload: "Analyst", variant: "solid" },
            { labelKey: "c_remap_sanalyst", action: "remap", payload: "Senior Analyst" },
            { labelKey: "c_remap_executive", action: "remap", payload: "Executive" },
          ],
        });
      }, 260);
    } else {
      const rec = TITLES.find((t) => t.en === r.title)!;
      this.setState({
        flow: "update",
        seed: { title: rec.en, ar: rec.ar, family: rec.family, grade: rec.grade, approved: true, emp: r.emp },
      });
      setTimeout(() => {
        this.agent("m_opened_existing", { title: r.title, emp: r.emp, v: r.v }, {
          hasChips: true,
          chips: [{ labelKey: "c_generate_updated", action: "generate", variant: "solid" }],
        });
      }, 260);
    }
  }

  remapTo(en: string) {
    const rec = TITLES.find((t) => t.en === en)!;
    this.user(this.fmt(this.T().u_remap, { title: rec.en }));
    this.setState({
      flow: "update",
      seed: { title: rec.en, ar: rec.ar, family: rec.family, grade: rec.grade, approved: true },
    });
    setTimeout(() => {
      this.agent(null, null, {
        isValidated: true,
        vTitle: rec.en,
        vAr: rec.ar,
        vFamilyKey: rec.family,
        vGrade: rec.grade,
      });
      this.agent("m_remapped_ok", null, {
        hasChips: true,
        chips: [{ labelKey: "c_generate_updated", action: "generate", variant: "solid" }],
      });
    }, 280);
  }

  validationGate() {
    this.generateJD();
  }

  async generateJD() {
    const seed = this.state.seed;
    if (!seed || !seed.approved) return;
    const g = seed.grade;
    const AGENTS = ["phase_refs", "phase_write", "phase_validate", "phase_finalize"];
    const stepId = this.agent("m_agentrun", null, {
      isAgentRun: true,
      steps: AGENTS.map((k, i) => ({
        labelKey: k,
        icon: "",
        color: i === 0 ? "var(--gold)" : "#E7EBF2",
        textColor: i === 0 ? "var(--muted)" : "var(--muted2)",
        note: i === 0 ? this.T().running : "",
      })),
    });
    const setStep = (idx: number, patch: Record<string, string>) => {
      this.setState((s) => ({
        messages: s.messages.map((m) => {
          if (m.id !== stepId) return m;
          const steps = m.steps!.map((st, i) => (i === idx ? Object.assign({}, st, patch) : st));
          return Object.assign({}, m, { steps });
        }),
      }));
    };
    // Run the agent orchestrator (provider-agnostic). With the default `local`
    // provider this returns the grounded deterministic draft instantly; the
    // timed loop below drives the calm 4-phase progress UI.
    const result = await jobDescriptionService.generate({
      requestType: this.reqType(),
      seed,
      lang: this.state.lang,
      targetUnit: seed.targetUnit,
    });
    const jd = result.jobDescription;
    for (let i = 0; i < AGENTS.length; i++) {
      await this.wait(i === 0 ? 420 : 230);
      setStep(i, { icon: "✓", color: "var(--green)", textColor: "var(--ink)", note: "" });
      if (i + 1 < AGENTS.length)
        setStep(i + 1, { color: "var(--gold)", textColor: "var(--muted)", note: this.T().running });
    }
    await this.wait(260);
    this.setState({ jd, artifactOpen: true });
    this.agent(null, null, { isJdReady: true });
    this.agent("m_draft_note", { grade: g }, {
      hasChips: true,
      chips: [
        { labelKey: "c_open_doc", action: "openDoc", variant: "solid" },
        { labelKey: "c_approve", action: "approve" },
      ],
    });
  }

  async openRequest(id: string) {
    const r = REQUESTS.find((x) => x.id === id);
    if (!r) return;
    const rec = TITLES.find((t) => t.en === r.titleEn);
    const seed: Seed = {
      title: r.titleEn,
      ar: r.titleAr,
      grade: r.grade,
      family: rec ? rec.family : "",
      approved: true,
      emp: r.en,
    };
    const result = await jobDescriptionService.generate({
      requestType: "update",
      seed,
      lang: this.state.lang,
    });
    const jd = result.jobDescription;
    jd.status = r.status;
    this.openThread("thread_update", [
      {
        tkey: "m_opened_request",
        params: { ref: r.id, emp: r.en, title: r.titleEn },
        hasChips: true,
        chips: [
          { labelKey: "c_open_doc", action: "openDoc", variant: "solid" },
          { labelKey: "c_submit", action: "submit" },
        ],
      },
    ]);
    this.setState({ flow: "update", seed, jd, artifactOpen: true });
  }
  editResp(gi: number, ii: number, val: string) {
    this.setState((s) => {
      if (!s.jd) return {};
      const resp = s.jd.resp.map((grp, a) =>
        a !== gi
          ? grp
          : Object.assign({}, grp, {
              items: grp.items.map((it, b) =>
                b !== ii ? it : Object.assign({}, it, { override: val }),
              ),
            }),
      );
      return { jd: Object.assign({}, s.jd, { resp }) };
    });
  }

  verify() {
    const jd = this.state.jd;
    if (!jd) {
      this.startVerify();
      return;
    }
    const { rows, gaps } = jobDescriptionService.verifyMandate(jd);
    this.setState((s) => (s.jd ? { jd: Object.assign({}, s.jd, { verified: true }) } : {}));
    this.agent("m_mandate_intro", null, { isMandate: true, rows, gaps, scopeLevel: jd.scopeLevel });
  }
  verifyFromArtifact() {
    this.verify();
  }

  approveRoute() {
    this.submitApproval();
  }
  submitApproval() {
    if (!this.state.jd) return;
    this.setState((s) =>
      s.jd ? { jd: Object.assign({}, s.jd, { stage: "manager" }), artifactOpen: false } : { artifactOpen: false },
    );
    this.agent("m_submitted", null, { isTimeline: true, stage: "manager" });
    this.agent(null, null, {
      hasChips: true,
      chips: [
        { labelKey: "c_approve_final", action: "approveFinal", variant: "solid" },
        { labelKey: "c_reject", action: "returnChanges" },
      ],
    });
  }
  approveFinal() {
    if (!this.state.jd) return;
    const j = this.state.jd;
    // Publish to Records + get an audit reference via the version-control service.
    const aud = jobDescriptionService.approve(j);
    this.setState((s) =>
      s.jd
        ? { jd: Object.assign({}, s.jd, { stage: "published", status: "Approved" }), artifactOpen: false }
        : { artifactOpen: false },
    );
    this.agent("m_approved2", { aud }, { isTimeline: true, stage: "published" });
    this.agent(null, null, {
      hasChips: true,
      chips: [
        { labelKey: "c_view_records", action: "openApproved", variant: "solid" },
        { labelKey: "c_export", action: "exportDoc" },
        { labelKey: "c_start_another", action: "create" },
      ],
    });
  }
  returnChanges() {
    this.agent("m_returned", null, { isTimeline: true, stage: "compliance" });
    this.agent(null, null, {
      hasChips: true,
      chips: [
        { labelKey: "c_verify", action: "verify", variant: "solid" },
        { labelKey: "c_approve_final", action: "approveFinal" },
      ],
    });
  }
  openSmart() {
    this.setState({ view: "smart", smartAcked: false });
  }
  backChat() {
    this.setState({ view: "chat" });
  }
  exportDoc() {
    this.exportJdFile();
  }
  ackSmart() {
    this.setState({ smartAcked: true });
  }

  exportJdFile() {
    const j = this.state.jd;
    if (!j) return;
    const AR = this.state.lang === "ar";
    const esc = (s: unknown) =>
      String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const roleRep: Record<string, Bi> = {
      managerial: { en: "Central Services Sector", ar: "قطاع الخدمات المركزية" },
      advisory: { en: "Head of Total Experience Section", ar: "رئيس قسم التجربة الشاملة" },
      executive: { en: "Head of Total Experience Section", ar: "رئيس قسم التجربة الشاملة" },
    };
    const rep = roleRep[j.roleKey] || roleRep.executive;
    const scope = AR ? j.scope.ar : j.scope.en;
    let respHtml = "";
    j.resp.forEach((g) => {
      const gl = AR ? g.label.ar : g.label.en;
      respHtml += '<p class="grp">' + esc(gl) + "</p><ul>";
      g.items.forEach((it) => {
        respHtml += "<li>" + esc(it.override != null ? it.override : AR ? it.t.ar : it.t.en) + "</li>";
      });
      respHtml += "</ul>";
    });
    const quals: string[] = [];
    quals.push(
      j.quals.base
        ? AR
          ? "المؤهل والخبرة وفق إطار المؤهلات: " + j.quals.base
          : "Qualification & experience per framework: " + j.quals.base
        : AR
          ? "المؤهلات تتطلب تأكيداً يدوياً"
          : "Qualifications require manual confirmation",
    );
    quals.push(AR ? "خبرة ذات صلة بالدور ونطاق العمل." : "Relevant experience aligned to the role scope.");
    quals.push(
      AR
        ? "إتقان العربية والإنجليزية والإلمام بالأدوات الرقمية."
        : "Proficiency in Arabic and English and relevant digital tools.",
    );
    const qualHtml = "<ul>" + quals.map((q) => "<li>" + esc(q) + "</li>").join("") + "</ul>";
    const cl = this.coreLevel(j.grade);
    const clLabel = this.T()["lvl_" + cl];
    const ll = this.leadLevel(j.grade);
    const llLabel = ll ? this.T()["lvl_" + ll] : "";
    const cName = (c: { en: string; ar: string }) => (AR ? c.ar : c.en);
    let compRows = "";
    compRows +=
      '<tr class="ch"><td>' +
      esc(AR ? "الكفاءات الأساسية" : "Core Competencies") +
      "</td><td>" +
      esc(AR ? "المستوى المطلوب (تطوير / إتقان / متقدّم)" : "Required Level (Developing / Proficient / Advanced)") +
      "</td></tr>";
    CORE.forEach((c) => {
      compRows += "<tr><td>" + esc(cName(c)) + "</td><td>" + esc(clLabel) + "</td></tr>";
    });
    compRows +=
      '<tr class="ch"><td>' +
      esc(AR ? "الكفاءات القيادية" : "Leadership Competencies") +
      "</td><td>" +
      esc(AR ? "المستوى المطلوب" : "Required Level") +
      "</td></tr>";
    if (ll) {
      LEAD.forEach((c) => {
        compRows += "<tr><td>" + esc(cName(c)) + "</td><td>" + esc(llLabel) + "</td></tr>";
      });
    } else {
      compRows +=
        '<tr><td colspan="2" class="na">' +
        esc(
          AR
            ? "الكفاءات القيادية غير مطلوبة في الدرجة " + j.grade + " وفق إطار مستوى الكفاءة."
            : "Leadership competencies not required at grade " + j.grade + " per the competency-level framework.",
        ) +
        "</td></tr>";
    }
    const L = (k: string) => this.T()[k];
    const title = esc(j.title) + (j.titleAr ? " — " + esc(j.titleAr) : "");
    const html =
      '<!DOCTYPE html><html dir="' +
      (AR ? "rtl" : "ltr") +
      '"><head><meta charset="utf-8"><title>' +
      esc(j.title) +
      "</title>" +
      "<style>@page{size:A4;margin:2.2cm 2cm}" +
      "body{font-family:" +
      (AR ? '"Sakkal Majalla","Traditional Arabic",Arial' : "Calibri,Arial") +
      ",sans-serif;color:#1F2A40;font-size:11pt;line-height:1.55}" +
      ".conf{font:700 8pt/1 Arial;letter-spacing:2px;color:#8A1C1C;text-transform:uppercase}" +
      "h1{font-size:16pt;color:#0E2A47;margin:6px 0 2px;text-transform:uppercase;letter-spacing:.5px}" +
      "table.meta{width:100%;border-collapse:collapse;margin:14px 0 18px}" +
      "table.meta td{border:1px solid #C9D2DE;padding:7px 10px;font-size:10.5pt}" +
      "table.meta td.k{background:#EEF2F7;font-weight:700;width:34%;color:#33456A}" +
      "h2{font-size:12pt;color:#0E2A47;border-bottom:2px solid #C6A15B;padding-bottom:3px;margin:20px 0 8px;text-transform:uppercase;letter-spacing:.4px}" +
      "p.lead{margin:0 0 4px;font-style:italic;color:#4A5568}" +
      "p.grp{font-weight:700;color:#33456A;margin:12px 0 4px}" +
      "ul{margin:4px 0 8px;padding-inline-start:20px}li{margin:3px 0}" +
      "table.comp{width:100%;border-collapse:collapse;margin:6px 0}" +
      "table.comp td{border:1px solid #C9D2DE;padding:6px 10px;font-size:10.5pt}" +
      "table.comp tr.ch td{background:#0E2A47;color:#fff;font-weight:700;font-size:9.5pt;text-transform:uppercase}" +
      "table.comp td.na{color:#8A6D1E;font-style:italic;background:#FBF6E7}" +
      ".foot{margin-top:22px;border-top:1px solid #C9D2DE;padding-top:8px;font:8pt Arial;color:#8792A6}" +
      "</style></head><body>" +
      '<div class="conf">' +
      esc(L("confidential") || "CONFIDENTIAL") +
      "</div>" +
      "<h1>" +
      title +
      "</h1>" +
      '<table class="meta">' +
      '<tr><td class="k">' +
      esc(AR ? "المسمى الوظيفي" : "Job Title") +
      "</td><td>" +
      title +
      "</td></tr>" +
      '<tr><td class="k">' +
      esc(AR ? "الدرجة" : "Grade") +
      "</td><td>" +
      esc(j.grade) +
      "</td></tr>" +
      '<tr><td class="k">' +
      esc(AR ? "القطاع" : "Sector") +
      "</td><td>" +
      esc(AR ? "قطاع الخدمات المركزية" : "Central Services Sector") +
      "</td></tr>" +
      '<tr><td class="k">' +
      esc(AR ? "الإدارة" : "Department") +
      "</td><td>" +
      esc(AR ? "إدارة الموارد البشرية" : "HR Services Department") +
      "</td></tr>" +
      '<tr><td class="k">' +
      esc(AR ? "القسم / الوحدة" : "Section / Unit") +
      "</td><td>" +
      esc(scope) +
      "</td></tr>" +
      '<tr><td class="k">' +
      esc(AR ? "علاقة الإشراف" : "Reporting Relationship") +
      "</td><td>" +
      esc(AR ? rep.ar : rep.en) +
      "</td></tr>" +
      "</table>" +
      "<h2>" +
      esc(AR ? "الغرض من الدور" : "Purpose of the Role") +
      "</h2><p>" +
      esc(AR ? j.purposeText.ar : j.purposeText.en) +
      "</p>" +
      "<h2>" +
      esc(AR ? "المسؤوليات الرئيسية" : "Key Responsibilities") +
      "</h2>" +
      '<p class="lead">' +
      esc(AR ? "ستكون مسؤولاً عمّا يلي على سبيل المثال لا الحصر:" : "You will be responsible for the following but not limited to:") +
      "</p>" +
      respHtml +
      "<h2>" +
      esc(AR ? "المؤهلات" : "Qualifications") +
      "</h2>" +
      qualHtml +
      "<h2>" +
      esc(AR ? "الكفاءات" : "Competencies") +
      '</h2><table class="comp">' +
      compRows +
      "</table>" +
      '<div class="foot">' +
      esc(AR ? "وزارة شؤون مجلس الوزراء · مرجع الوصف: " + j.code : "Ministry of Cabinet Affairs · JD Reference: " + j.code) +
      "</div>" +
      "</body></html>";
    try {
      const blob = new Blob(["﻿" + html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = j.title.replace(/[^\w]+/g, "_") + "_" + j.code + ".doc";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {
      /* ignore */
    }
  }

  onInput(e: { target: { value: string } }) {
    this.setState({ input: e.target.value });
  }
  onKey(e: { key: string; shiftKey: boolean; preventDefault: () => void }) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }
  send() {
    const v = (this.state.input || "").trim();
    if (!v) return;
    this.setState({ input: "" });
    this.user(v);
    const low = v.toLowerCase();
    setTimeout(() => {
      this.resolve(v, low);
    }, 240);
  }
  jdStatusLabel(jd: string) {
    const T = this.T();
    const m: Record<string, string> = {
      none: "st_none",
      draft: "st_draft",
      review: "st_review",
      approved: "st_approved",
    };
    return T[m[jd] || "st_none"];
  }
  findEmployee(v: string, low: string): Employee | null {
    for (const e of EMPLOYEES) {
      if (low.includes(e.id.toLowerCase())) return e;
      if (low.includes(e.en.toLowerCase())) return e;
      if (e.ar && v.includes(e.ar)) return e;
      const enTok = e.en.toLowerCase().split(/\s+/);
      if (enTok.some((t) => t.length >= 3 && low.includes(t))) return e;
      const arTok = (e.ar || "").split(/\s+/);
      if (arTok.some((t) => t.length >= 3 && v.includes(t))) return e;
    }
    return null;
  }
  findTitle(v: string, low: string): TitleRec | null {
    return TITLES.find((t) => low.includes(t.en.toLowerCase()) || (t.ar && v.includes(t.ar))) || null;
  }
  listEmployees(list: Employee[], tkey: string) {
    const AR = this.state.lang === "ar";
    if (!list.length) {
      this.agent(tkey, { count: 0 }, {});
      return;
    }
    const chips: Chip[] = list.slice(0, 6).map((e) => ({
      label: (AR ? e.ar : e.en) + " · " + (AR ? e.titleAr : e.titleEn),
      action: "openEmpProfile",
      payload: e.id,
    }));
    this.agent(tkey, { count: list.length }, { hasChips: true, chips });
  }
  resolve(v: string, low: string) {
    const AR = this.state.lang === "ar";
    const emp = this.findEmployee(v, low);
    const wantsJd = /وصف|jd|description|أنشئ|انشئ|creat|generate|حدّث|حدث|تحديث|updat/.test(low);
    const nojd =
      /(بدون|بلا|ليس|دون|لا يملك|لا يوجد).*(وصف|jd)|without.*(jd|description)|no (approved )?jd/.test(low);
    if (emp) {
      if (wantsJd && !nojd) {
        this.updateEmp(emp.id);
        return;
      }
      this.agent(
        "m_emp_info",
        {
          name: AR ? emp.ar : emp.en,
          id: emp.id,
          title: AR ? emp.titleAr : emp.titleEn,
          grade: emp.grade,
          manager: AR ? emp.mgrAr : emp.mgrEn,
          status: this.jdStatusLabel(emp.jd),
        },
        {
          hasChips: true,
          chips: [
            { label: AR ? "فتح الملف" : "Open profile", action: "openEmpProfile", payload: emp.id, variant: "solid" },
            { label: AR ? "إنشاء / تحديث الوصف" : "Create / update JD", action: "empJd", payload: emp.id },
          ],
        },
      );
      return;
    }
    if (nojd) {
      this.listEmployees(EMPLOYEES.filter((e) => e.jd === "none" || !e.approved), "m_q_nojd");
      return;
    }
    if (/مسودات|مسودة|drafts?/.test(low)) {
      this.listEmployees(EMPLOYEES.filter((e) => e.jd === "draft"), "m_q_drafts");
      return;
    }
    if (/قيد المراجعة|مراجعة|under review/.test(low)) {
      this.listEmployees(EMPLOYEES.filter((e) => e.jd === "review"), "m_q_review");
      return;
    }
    if (/المعتمدة|معتمد|approved/.test(low)) {
      this.listEmployees(EMPLOYEES.filter((e) => e.jd === "approved"), "m_q_approved");
      return;
    }
    const title = this.findTitle(v, low);
    if (title) {
      this.beginWithTitle(title.en);
      return;
    }
    if (/updat|تحديث|حدّث|حدث/.test(low)) {
      this.startUpdate();
      return;
    }
    if (/verif|mandate|align|coverage|تحقق|مراجع|مهام|تغطية/.test(low)) {
      this.startVerify();
      return;
    }
    if (/creat|new|draft|generate|أنشئ|انشئ|جديد|مسودة/.test(low)) {
      this.agent("m_sure_create", null, { isPicker: true });
      return;
    }
    this.agent("m_help_fallback", null, {
      hasChips: true,
      chips: [
        { labelKey: "c_create", action: "create", variant: "solid" },
        { labelKey: "c_update", action: "update" },
        { labelKey: "c_review", action: "verify" },
      ],
    });
  }

  onPickerChange(e: { target: { value: string } }) {
    this.setState({ draftTitle: e.target.value });
  }
  onCustomInput(e: { target: { value: string } }) {
    this.setState({ customTitle: e.target.value });
  }
  toggleArtifact() {
    this.setState((s) => ({ artifactOpen: !s.artifactOpen }));
  }
  toggleExp(id: number) {
    this.setState((s) => {
      const e = Object.assign({}, s.expOpen);
      e[id] = !e[id];
      return { expOpen: e };
    });
  }
  closeArtifact() {
    this.setState({ artifactOpen: false });
  }

  chipStyle(variant?: "solid" | null) {
    return variant === "solid"
      ? { bg: "var(--ink)", fg: "#fff", border: "var(--ink)" }
      : { bg: "var(--surface)", fg: "var(--ink3)", border: "var(--line2)" };
  }
  confColors(c: string) {
    if (c === "high") return { confBg: "var(--green-bg)", confColor: "#1F6E40" };
    if (c === "low") return { confBg: "var(--red-bg)", confColor: "var(--red)" };
    return { confBg: "var(--amber-bg)", confColor: "#8A6D1E" };
  }
  levelColors(l: string) {
    if (l === "advanced") return { bg: "var(--green-bg)", fg: "#1F6E40" };
    if (l === "proficient") return { bg: "var(--blue-bg)", fg: "var(--blue)" };
    return { bg: "var(--gold-bg)", fg: "var(--gold-d)" };
  }
}

export const store = new Store();
