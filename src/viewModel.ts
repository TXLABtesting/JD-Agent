import {
  CORE,
  EMPLOYEES,
  FAM_AR,
  KBDATA,
  KBREFS,
  LEAD,
  MASTER,
  ORG_AR,
  ORG_EN,
  ORG_TREE,
  QUALS,
  REQUESTS,
  THEMES,
  TITLES,
} from "./data";
import { DICT } from "./i18n";
import type { Store } from "./store";
import type { Chip } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function buildVM(s: Store): any {
  const st = s.state;
  const lang = st.lang;
  const T = DICT[lang];
  const fam = (f: string) => (lang === "ar" ? FAM_AR[f] || f : f);

  // ---- approved-title picker groups ----
  const groups: { family: string; items: { value: string; label: string }[] }[] = [];
  const order = ["Supervisory", "General", "Advisory", "Office Managers", "Leadership"];
  order.forEach((f) => {
    const items = TITLES.filter((t) => t.family === f).map((t) => ({
      value: t.en,
      label: t.en + " — " + t.ar + "  ·  " + t.grade,
    }));
    if (items.length) groups.push({ family: fam(f), items });
  });

  const chip = (c: Chip) => {
    const stl = s.chipStyle(c.variant);
    return {
      label: c.label != null ? c.label : T[c.labelKey as string],
      bg: stl.bg,
      fg: stl.fg,
      border: stl.border,
      on: () => s.dispatch(c.action, c.payload),
    };
  };

  const messages = (st.messages || []).map((m: any) => {
    const vm: any = { id: m.id, isUser: m.role === "user", isAgent: m.role === "agent" };
    if (m.role === "user") {
      vm.text = m.text || "";
      return vm;
    }
    vm.text = m.tkey ? s.fmt(T[m.tkey], m.params) : "";
    vm.hasText = !!m.tkey;
    vm.isOrgCard = !!m.isOrgCard;
    vm.isPicker = !!m.isPicker;
    vm.isValidated = !!m.isValidated;
    vm.isAlert = !!m.isAlert;
    vm.isSteps = !!m.isSteps;
    vm.isJdReady = !!m.isJdReady;
    vm.isMandate = !!m.isMandate;
    vm.isValGate = !!m.isValGate;
    vm.isAgentRun = !!m.isAgentRun;
    vm.isReview = !!m.isReview;
    vm.isExplain = !!m.isExplain;
    vm.isSummaryCard = !!m.isSummary || !!m.isSummaryLive;
    vm.isReqForm = !!m.isReqForm;
    vm.isTransferCompare = !!m.isTransferCompare;
    if (m.isTransferCompare) {
      vm.title = m.title;
      vm.fromTxt = m.fromTxt;
      vm.toTxt = m.toTxt;
    }
    if (vm.isSummaryCard) {
      const f = (st.intake && st.intake.f) || ({} as any);
      const pend = T.f_pending;
      const val = "#243154";
      const dim = "var(--muted2)";
      const rows: any[] = [];
      rows.push({ k: T.f_reqtype, v: f.reqtype === "existing" ? T.rt_existing_label : T.rt_new_label, color: val });
      if ((st.intake && st.intake.mode) === "position") {
        rows.push({ k: T.f_positionid, v: f.positionId || pend, color: f.positionId ? val : dim });
      } else {
        rows.push({ k: T.f_employee, v: f.employee || pend, color: f.employee ? val : dim });
        rows.push({ k: T.f_empid, v: f.empId || pend, color: f.empId ? val : dim });
      }
      rows.push({ k: T.f_jobtitle, v: f.title ? f.title + (f.titleAr ? " · " + f.titleAr : "") : pend, color: f.title ? val : dim });
      rows.push({ k: T.f_grade, v: f.grade || pend, color: f.grade ? val : dim });
      rows.push({ k: T.f_manager, v: f.manager || pend, color: f.manager ? val : dim });
      rows.push({ k: T.f_reason, v: f.reason || pend, color: f.reason ? val : dim });
      vm.sumRows = rows;
    }
    if (m.isValGate) {
      const gradeOk = !!QUALS[m.grade];
      const AR = lang === "ar";
      const ok = { icon: "✓", color: "var(--green)" };
      const warn = { icon: "!", color: "var(--amber)" };
      vm.checks = [
        Object.assign({ text: T.vg_title_ok }, ok),
        Object.assign({ text: T.vg_grade_ok }, ok),
        Object.assign({ text: T.vg_org_ok }, ok),
        Object.assign({ text: T.vg_mandate_ok }, ok),
        Object.assign({ text: T.vg_quals_ok }, gradeOk ? ok : warn),
        Object.assign({ text: T.vg_comp_ok }, ok),
        Object.assign({ text: T.vg_dup_ok }, ok),
      ];
      vm.vgReady = gradeOk ? "92%" : "74%";
      vm.vgConf = gradeOk ? (AR ? "عالية" : "High") : AR ? "متوسطة" : "Medium";
    }
    if (m.isAgentRun) {
      vm.steps = m.steps.map((step: any) => ({
        label: T[step.labelKey],
        icon: step.icon,
        color: step.color,
        textColor: step.textColor,
      }));
    }
    if (m.isReview) {
      vm.rvCards = [
        { label: T.rv_overall, value: lang === "ar" ? "عالية" : "High", bg: "var(--green-bg)", fg: "#1F6E40" },
        { label: T.rv_quality, value: "92 / 100", bg: "var(--green-bg)", fg: "#1F6E40" },
        { label: T.rv_compliance, value: lang === "ar" ? "مطابق" : "Pass", bg: "var(--green-bg)", fg: "#1F6E40" },
        { label: T.rv_dup, value: T.rv_dup_low, bg: "var(--blue-bg)", fg: "var(--blue)" },
        { label: T.rv_risk, value: T.rv_risk_low, bg: "var(--blue-bg)", fg: "var(--blue)" },
        { label: T.rv_rec, value: "✓", bg: "var(--gold-bg)", fg: "#8A6D1E" },
      ];
      vm.rvRec = T.rv_rec_val;
    }
    if (m.isExplain) {
      const scopeName = st.jd ? (lang === "ar" ? st.jd.scope.ar : st.jd.scope.en) : "";
      vm.expLines = [
        T.exp_1,
        s.fmt(T.exp_2, { scope: scopeName }),
        s.fmt(T.exp_3, { scope: scopeName }),
        s.fmt(T.exp_4, { grade: m.grade }),
        T.exp_5,
        T.exp_6,
      ];
      const open = !!(st.expOpen && st.expOpen[m.id]);
      vm.expOpen = open;
      vm.expChevron = open ? "⌄" : "›";
      vm.toggleExp = () => s.toggleExp(m.id);
    }
    vm.isTimeline = !!m.isTimeline;
    if (m.isTimeline) {
      const stages = ["draft", "generated", "validated", "compliance", "manager", "hr", "published"];
      const labels: Record<string, string> = {
        draft: T.tl_draft,
        generated: T.tl_generated,
        validated: T.tl_validated,
        compliance: T.tl_compliance,
        manager: T.tl_manager,
        hr: T.tl_hr,
        published: T.tl_published,
      };
      const curIdx = stages.indexOf(m.stage);
      vm.tlSteps = stages.map((step, i) => {
        const done = i < curIdx,
          cur = i === curIdx;
        return {
          label: labels[step],
          icon: done ? "✓" : cur ? "●" : "",
          color: done ? "var(--green)" : cur ? "var(--gold)" : "#E7EBF2",
          fg: done || cur ? "#243154" : "var(--muted2)",
          font: (cur ? "700" : "500") + " 12.5px/1.3 var(--sans)",
        };
      });
    }
    if (m.isValidated) {
      vm.vTitle = m.vTitle;
      vm.vAr = m.vAr;
      vm.vFamily = fam(m.vFamilyKey);
      vm.vGrade = m.vGrade;
    }
    if (m.isAlert) {
      vm.alertTitle = T[m.akey + "_title"];
      vm.alertBody = s.fmt(T[m.akey + "_body"], m.params);
      vm.alertBadge = T.badge_low;
    }
    if (m.isSteps) {
      vm.steps = m.steps.map((step: any) => ({
        label: T[step.labelKey],
        icon: step.icon,
        color: step.color,
        textColor: step.textColor,
        note: step.note,
      }));
    }
    if (m.isJdReady && st.jd) {
      const cc = s.confColors(st.jd.confidence);
      vm.jdTitle = st.jd.title;
      vm.jdMeta = s.fmt(T.jd_meta, { grade: st.jd.grade, code: st.jd.code });
      vm.confLabel = T["conf_" + st.jd.confidence];
      vm.confBg = cc.confBg;
      vm.confColor = cc.confColor;
      vm.jdSources = T.jd_sources;
      vm.openDoc = () => s.setState({ artifactOpen: true });
    }
    if (m.isMandate) {
      const AR = lang === "ar";
      vm.rows = m.rows.map((r: any) => {
        const it = r.item;
        return {
          text: it.override != null ? it.override : AR ? it.t.ar : it.t.en,
          status: AR ? it.src.ar : it.src.en,
          bg: "var(--green-bg)",
          fg: "#1F6E40",
        };
      });
      vm.gapText = T.gap_none;
      vm.gapBg = "var(--green-bg)";
      vm.gapFg = "#1F6E40";
    }
    if (m.hasChips || m.chips) {
      vm.hasChips = true;
      vm.chips = (m.chips || []).map(chip);
    }
    return vm;
  });

  // ---- artifact JD view model ----
  let jdvm: any = null;
  if (st.jd) {
    const j = st.jd;
    const cc = s.confColors(j.confidence);
    const AR = lang === "ar";
    const respGroups = j.resp.map((grp, gi) => ({
      grp: AR ? grp.label.ar : grp.label.en,
      items: grp.items.map((it, ii) => {
        const srcTxt = AR ? it.src.ar : it.src.en;
        return {
          text: it.override != null ? it.override : AR ? it.t.ar : it.t.en,
          tag: srcTxt,
          tagBg: "var(--green-bg)",
          tagFg: "#1F6E40",
          onEdit: (e: { target: { value: string } }) => s.editResp(gi, ii, e.target.value),
        };
      }),
    }));
    const cl = s.coreLevel(j.grade);
    const clc = s.levelColors(cl);
    const clLabel = T["lvl_" + cl];
    const coreRows = CORE.map((c) => ({
      name: AR ? c.ar : c.en + "  ·  " + c.ar,
      level: clLabel,
      bg: clc.bg,
      fg: clc.fg,
    }));
    const ll = s.leadLevel(j.grade);
    const llc = ll ? s.levelColors(ll) : null;
    const llLabel = ll ? T["lvl_" + ll] : "";
    const leadRows = ll
      ? LEAD.map((c) => ({ name: AR ? c.ar : c.en + "  ·  " + c.ar, level: llLabel, bg: llc!.bg, fg: llc!.fg }))
      : [];
    const quals: any[] = [];
    if (j.quals.base) quals.push({ text: s.fmt(T.qual_edu, { q: j.quals.base }), color: "#283246" });
    else quals.push({ text: s.fmt(T.qual_edu_missing, { grade: j.grade }), color: "var(--red)" });
    quals.push({ text: T.qual_exp, color: "#283246" });
    quals.push({ text: T.qual_lang, color: "#283246" });
    const org = AR ? ORG_AR : ORG_EN;
    const repMap: Record<string, { en: string; ar: string }> = {
      managerial: { en: "Central Services Sector", ar: "قطاع الخدمات المركزية" },
      advisory: { en: "Head of Total Experience Section", ar: "رئيس قسم التجربة الشاملة" },
      executive: { en: "Head of Total Experience Section", ar: "رئيس قسم التجربة الشاملة" },
    };
    const rep = repMap[j.roleKey] || repMap.executive;
    jdvm = {
      title: j.title,
      titleAr: j.titleAr,
      grade: j.grade,
      code: j.code,
      hasEmp: !!(j.emp && j.emp !== "—"),
      empName: j.emp || "",
      sector: org.sector,
      department: org.department,
      section: org.section,
      unit: org.unit,
      reporting: j.manager && j.manager !== "—" ? j.manager : AR ? rep.ar : rep.en,
      purpose: AR ? j.purposeText.ar : j.purposeText.en,
      respGroups,
      qualsLines: quals,
      natureLine: AR ? j.natureLine.ar : j.natureLine.en,
      authority: AR ? j.authorityText.ar : j.authorityText.en,
      mandateSrc: AR ? "مهام " + j.scope.ar : j.scope.en + " mandate",
      mandateText: AR ? j.mandate.ar : j.mandate.en,
      kpis: (j.kpis || []).map((k) => (AR ? k.ar : k.en)),
      coreRows,
      leadRows,
      hasLead: !!ll,
      noLead: !ll,
      noLeadText: s.fmt(T.no_lead, { grade: j.grade }),
      confidence: j.confidence,
      confLabel: T["conf_" + j.confidence],
      confBg: cc.confBg,
      confColor: cc.confColor,
      flags: (j.flags || []).map((f) => s.fmt(T[f.key], f.params)),
      hasFlags: j.flags && j.flags.length > 0,
    };
  }

  // ---- MOCA Smart employee view model ----
  let smartVM: any = null;
  if (st.jd) {
    const j = st.jd;
    const AR3 = lang === "ar";
    const cl = s.coreLevel(j.grade);
    const clLabel = T["lvl_" + cl];
    smartVM = {
      title: j.title,
      titleAr: j.titleAr,
      grade: j.grade,
      unit: AR3 ? ORG_TREE.unit.ar : ORG_TREE.unit.en,
      purpose: AR3 ? j.purposeText.ar : j.purposeText.en,
      resp: j.resp.reduce(
        (a: string[], g) => a.concat(g.items.map((it) => (it.override != null ? it.override : AR3 ? it.t.ar : it.t.en))),
        [],
      ),
      quals: j.quals.base || (AR3 ? "يتطلب تأكيداً يدوياً" : "Manual confirmation required"),
      comps: CORE.map((c) => (AR3 ? c.ar : c.en) + " — " + clLabel),
    };
  }
  const orgCard = lang === "ar" ? ORG_AR : ORG_EN;

  // ---- Request-details form (cascading Master-Data dropdowns) ----
  let rf: any = null;
  if (st.reqForm) {
    const R: any = st.reqForm;
    const AR4 = lang === "ar";
    const M = MASTER;
    const opts = (arr: any[]) => arr.map((o) => ({ value: o.id, label: AR4 ? o.ar : o.en }));
    const mk = (label: string, field: string, options: any[], extra?: any) =>
      Object.assign(
        {
          label,
          value: R[field] || "",
          options,
          span: "auto",
          lock: "",
          disabled: false,
          bg: "var(--paper)",
          onChange: (e: { target: { value: string } }) => s.setForm(field, e.target.value),
        },
        extra || {},
      );
    const fields: any[] = [];
    if (R.mode === "transfer") {
      const fromU = M.units.find((u) => u.id === R.fromUnit);
      fields.push(mk(T.f_employee, "employee", [{ value: R.employee, label: (AR4 ? R.titleAr : R.title) + " · " + R.empId }], { disabled: true, bg: "#F0F2F6", span: "1 / -1" }));
      fields.push(mk(T.tf_current, "fromUnit", [{ value: R.fromUnit, label: fromU ? (AR4 ? fromU.ar : fromU.en) : "" }], { disabled: true, bg: "#F0F2F6", span: "1 / -1" }));
      fields.push(mk(T.f_new_entity, "entity", opts(M.entities), { span: "1 / -1" }));
      fields.push(mk(T.f_new_sector, "sector", opts(M.sectors.filter((x) => x.entity === R.entity))));
      fields.push(mk(T.f_new_department, "dept", opts(M.departments.filter((x) => x.sector === R.sector))));
      fields.push(mk(T.f_new_section, "section", opts(M.sections.filter((x) => x.dept === R.dept))));
      fields.push(mk(T.f_new_unit, "unit", opts(M.units.filter((x) => x.section === R.section))));
      fields.push(mk(T.f_new_jobtitle, "title", TITLES.map((t) => ({ value: t.en, label: t.en + " — " + t.ar + " · " + t.grade })), { span: "1 / -1" }));
      const incompleteT = !R.unit || !R.title;
      rf = { fields, incomplete: incompleteT, opacity: incompleteT ? ".5" : "1", submitLabel: T.c_confirm_transfer, submit: () => s.submitTransfer() };
    } else {
      if (R.mode === "position") {
        fields.push(mk(T.f_positionid, "positionId", [{ value: "POS-TX-014", label: "POS-TX-014" }, { value: "POS-TX-021", label: "POS-TX-021" }, { value: "__new", label: T.pos_none }], { span: "1 / -1" }));
      } else if (R.mode === "prejoin") {
        // candidate not yet an employee — no employee / position-id field
      } else {
        fields.push(mk(T.f_employee, "employee", EMPLOYEES.map((e) => ({ value: e.en, label: (AR4 ? e.ar : e.en) + " · " + e.id }))));
        fields.push(mk(T.f_empid, "empId", [{ value: R.empId, label: R.empId || "—" }], { disabled: true, bg: "#F0F2F6" }));
      }
      fields.push(mk(T.f_entity, "entity", opts(M.entities), { span: "1 / -1" }));
      fields.push(mk(T.f_sector, "sector", opts(M.sectors.filter((x) => x.entity === R.entity))));
      fields.push(mk(T.f_department, "dept", opts(M.departments.filter((x) => x.sector === R.sector))));
      fields.push(mk(T.f_section, "section", opts(M.sections.filter((x) => x.dept === R.dept))));
      fields.push(mk(T.f_unit, "unit", opts(M.units.filter((x) => x.section === R.section))));
      fields.push(mk(T.f_jobtitle, "title", TITLES.map((t) => ({ value: t.en, label: t.en + " — " + t.ar + " · " + t.grade })), { span: "1 / -1" }));
      fields.push(mk(T.f_manager, "manager", [{ value: R.mgrEn || "Noura Al Ali", label: T.mgr1 }, { value: "Faisal Odeh", label: T.mgr2 }], { span: "1 / -1" }));
      const incomplete = !R.title || !R.grade || !R.manager || !R.unit || (R.mode === "employee" && !R.employee);
      rf = { fields, incomplete, opacity: incomplete ? ".5" : "1", submitLabel: T.c_validate_continue, submit: () => s.submitReqForm() };
    }
  }
  if (!rf) rf = { fields: [], incomplete: true, opacity: "1", submitLabel: "", submit: () => {} };

  // ---- sidebar ----
  const navItem = (icon: string, icColor: string, labelKey: string, action?: () => void, count?: number) => ({
    icon,
    icColor,
    label: T[labelKey],
    on: action ? () => action() : () => s.newJD(),
    bg: "transparent",
    fg: "#D7DEEC",
    hasCount: count != null,
    count: count != null ? count : "",
  });
  const themeSwatches = Object.keys(THEMES).map((id) => {
    const th = THEMES[id];
    const active = st.theme === id;
    return {
      id,
      name: lang === "ar" ? th.name.ar : th.name.en,
      grad: "linear-gradient(135deg," + th.dots[0] + " 0 50%," + th.dots[1] + " 50% 100%)",
      ring: active ? "#fff" : "rgba(255,255,255,.25)",
      on: () => s.applyTheme(id),
    };
  });
  const navGroups = [
    {
      label: T.nav_workspace,
      items: [
        navItem("solar:documents-linear", "var(--gold)", "w_requests", () => s.openWork("all"), 6),
        navItem("solar:pen-2-linear", "#9FB0C9", "w_drafts", () => s.openWork("draft"), 2),
        navItem("solar:clock-circle-linear", "#9FB0C9", "w_review", () => s.openWork("review"), 1),
        navItem("solar:check-circle-linear", "#7FC79B", "w_approved", () => s.openWork("approved"), 3),
      ],
    },
    {
      label: T.nav_records,
      items: [
        navItem("solar:users-group-rounded-linear", "#9FB0C9", "r_employees", () => s.openOrg(null, "employees")),
        navItem("solar:case-minimalistic-linear", "#9FB0C9", "r_positions", () => s.openOrg(null, "positions")),
        navItem("solar:buildings-2-linear", "#9FB0C9", "r_org", () => s.openOrg(null, "org")),
      ],
    },
    {
      label: T.nav_kb,
      items: [
        navItem("solar:book-2-linear", "#9FB0C9", "kb_refs", () => s.openKB("refs")),
        navItem("solar:database-linear", "#9FB0C9", "kb_data", () => s.openKB("data")),
      ],
    },
    {
      label: T.nav_admin,
      items: [
        navItem("solar:chart-2-linear", "#9FB0C9", "a_analytics", () => s.openAnalytics()),
        navItem("solar:settings-linear", "#9FB0C9", "a_settings", () => s.newJD()),
      ],
    },
  ];
  const rc = (icon: string, iconBg: string, iconFg: string, tk: string, dk: string, action: () => void, span?: string) => ({
    icon,
    iconBg,
    iconFg,
    title: T[tk],
    desc: T[dk],
    on: action,
    span: span || "auto",
  });
  const requestCards = [
    rc("solar:document-add-linear", "var(--gold-bg)", "var(--gold-d)", "rt_new_t", "rt_new_d", () => s.startNew()),
    rc("solar:user-plus-rounded-linear", "#EAF0FB", "var(--blue)", "rt_existing_t", "rt_existing_d", () => s.startExisting()),
    rc("solar:transfer-horizontal-linear", "#EAF0FB", "var(--blue)", "rt_transfer_t", "rt_transfer_d", () => s.startTransfer()),
    rc("solar:user-check-rounded-linear", "#EAF0FB", "var(--blue)", "rt_prejoin_t", "rt_prejoin_d", () => s.startPreJoin()),
  ];

  // ---- Org browse + employee profile ----
  const AR2 = lang === "ar";
  const nm = (o: any) => (o ? (AR2 ? o.ar : o.en) : "");
  const stMap: Record<string, { k: string; bg: string; fg: string }> = {
    none: { k: "st_none", bg: "#EEF0F4", fg: "#7B8390" },
    draft: { k: "st_draft", bg: "var(--gold-bg)", fg: "#8A6D1E" },
    review: { k: "st_review", bg: "var(--blue-bg)", fg: "var(--blue)" },
    approved: { k: "st_approved", bg: "var(--green-bg)", fg: "#1F6E40" },
    published: { k: "st_published", bg: "var(--green-bg)", fg: "#1F6E40" },
  };
  const selUnit = st.orgSel || "txteam";
  const orgTree: any[] = [];
  MASTER.entities.forEach((en) => {
    orgTree.push({ label: nm(en), icon: "▣", dot: "var(--gold-d)", font: "800 12.5px/1.3 var(--sans)", fg: "var(--ink)", indent: "10px", bg: "transparent", on: () => {} });
    MASTER.sectors.filter((x) => x.entity === en.id).forEach((se) => {
      orgTree.push({ label: nm(se), icon: "▸", dot: "#B6BECC", font: "600 11.5px/1.3 var(--sans)", fg: "var(--ink3)", indent: "22px", bg: "transparent", on: () => {} });
      MASTER.departments.filter((x) => x.sector === se.id).forEach((de) => {
        orgTree.push({ label: nm(de), icon: "▸", dot: "#B6BECC", font: "600 11.5px/1.3 var(--sans)", fg: "var(--muted)", indent: "34px", bg: "transparent", on: () => {} });
        MASTER.sections.filter((x) => x.dept === de.id).forEach((sc) => {
          MASTER.units.filter((x) => x.section === sc.id).forEach((u) => {
            const active = u.id === selUnit;
            orgTree.push({
              label: nm(u),
              icon: active ? "●" : "○",
              dot: active ? "var(--gold-d)" : "#B6BECC",
              font: (active ? "700" : "500") + " 11.5px/1.3 var(--sans)",
              fg: active ? "var(--gold-d)" : "var(--muted)",
              indent: "46px",
              bg: active ? "var(--gold-bg)" : "transparent",
              on: () => s.selectUnit(u.id),
            });
          });
        });
      });
    });
  });
  const unitObj = MASTER.units.find((u) => u.id === selUnit);
  const empList = EMPLOYEES.filter((e) => e.unit === selUnit);
  const employees = empList.map((e) => {
    const st2 = stMap[e.jd];
    return {
      id: e.id,
      name: AR2 ? e.ar : e.en,
      title: AR2 ? e.titleAr : e.titleEn,
      grade: e.grade,
      manager: AR2 ? e.mgrAr : e.mgrEn,
      ver: e.ver,
      stLabel: T[st2.k],
      stBg: st2.bg,
      stFg: st2.fg,
      open: () => s.openEmployee(e.id),
    };
  });
  const recMode = st.recordsMode || "employees";
  const positions = TITLES.map((t) => {
    const cnt = EMPLOYEES.filter((e) => e.titleEn === t.en).length;
    return {
      title: AR2 ? t.ar : t.en,
      sub: AR2 ? t.en : t.ar,
      grade: t.grade,
      family: AR2 ? (t as any).familyAr || t.family || "—" : t.family || "—",
      count: cnt,
    };
  });
  const orgUnits: any[] = [];
  MASTER.units.forEach((u) => {
    const sec = MASTER.sections.find((x) => x.id === u.section);
    const dep = sec ? MASTER.departments.find((x) => x.id === sec.dept) : null;
    const cnt = EMPLOYEES.filter((e) => e.unit === u.id).length;
    orgUnits.push({
      unit: nm(u),
      section: sec ? nm(sec) : "—",
      department: dep ? nm(dep) : "—",
      count: cnt,
      active: u.id === selUnit,
      open: () => s.openUnitRecords(u.id),
    });
  });
  const recTitle = recMode === "positions" ? T.rec_pos_title : recMode === "org" ? T.rec_org_title : T.rec_emp_title;
  const recSub = recMode === "positions" ? T.rec_pos_sub : recMode === "org" ? T.rec_org_sub : T.rec_emp_sub;

  // ---- Workspace requests ----
  const wFilter = st.workFilter || "all";
  const wCounts = {
    all: REQUESTS.length,
    draft: REQUESTS.filter((r) => r.status === "draft").length,
    review: REQUESTS.filter((r) => r.status === "review").length,
    approved: REQUESTS.filter((r) => r.status === "approved").length,
  };
  const workTabs = [
    { key: "all", label: T.w_requests, count: wCounts.all, active: wFilter === "all", on: () => s.openWork("all") },
    { key: "draft", label: T.w_drafts, count: wCounts.draft, active: wFilter === "draft", on: () => s.openWork("draft") },
    { key: "review", label: T.w_review, count: wCounts.review, active: wFilter === "review", on: () => s.openWork("review") },
    { key: "approved", label: T.w_approved, count: wCounts.approved, active: wFilter === "approved", on: () => s.openWork("approved") },
  ].map((t) => ({ ...t, bg: t.active ? "var(--ink2)" : "var(--surface)", fg: t.active ? "#fff" : "var(--muted)", bd: t.active ? "var(--ink2)" : "var(--line2)" }));

  // ---- Analytics ----
  const totalReq = REQUESTS.length;
  const anCounts: any = {
    draft: REQUESTS.filter((r) => r.status === "draft").length,
    review: REQUESTS.filter((r) => r.status === "review").length,
    approved: REQUESTS.filter((r) => r.status === "approved").length,
  };
  anCounts.other = totalReq - anCounts.draft - anCounts.review - anCounts.approved;
  const noJdCount = EMPLOYEES.filter((e) => e.jd === "none" || !e.approved).length;
  const anKpis = [
    { label: T.an_k_total, value: String(totalReq), note: T.an_k_total_n, color: "var(--ink)" },
    { label: T.an_k_nojd, value: String(noJdCount), note: T.an_k_nojd_n, color: "#B4431F" },
    { label: T.an_k_review, value: String(anCounts.review), note: T.an_k_review_n, color: "var(--blue)" },
    { label: T.an_k_approved, value: String(anCounts.approved), note: T.an_k_approved_n, color: "#1F6E40" },
    { label: T.an_k_time, value: AR2 ? "٤ أيام" : "4 days", note: T.an_k_time_n, color: "var(--gold-d)" },
  ];
  const pct = (n: number) => (totalReq ? Math.round((n / totalReq) * 100) + "%" : "0%");
  const anStatus = [
    { label: T.w_drafts, count: anCounts.draft, pct: pct(anCounts.draft), color: "var(--gold)" },
    { label: T.w_review, count: anCounts.review, pct: pct(anCounts.review), color: "var(--blue)" },
    { label: T.w_approved, count: anCounts.approved, pct: pct(anCounts.approved), color: "#1F6E40" },
  ];
  const deptAgg: Record<string, number> = {};
  REQUESTS.forEach((r) => {
    const d = r.dept || (AR2 ? "إدارة الموارد البشرية" : "HR Services Department");
    deptAgg[d] = (deptAgg[d] || 0) + 1;
  });
  const maxDept = Math.max(1, ...Object.values(deptAgg));
  const anDept = Object.keys(deptAgg).map((k) => ({ label: k, count: deptAgg[k], pct: Math.round((deptAgg[k] / maxDept) * 100) + "%" }));
  if (!anDept.length) anDept.push({ label: AR2 ? "إدارة الموارد البشرية" : "HR Services Department", count: totalReq, pct: "100%" });

  const workItems = REQUESTS.filter((r) => wFilter === "all" || r.status === wFilter).map((r) => {
    const st2 = stMap[r.status] || stMap.draft;
    const canOpen = r.status === "draft" || r.status === "review";
    return {
      id: r.id,
      emp: AR2 ? r.ar : r.en,
      title: AR2 ? r.titleAr : r.titleEn,
      grade: r.grade,
      ver: r.ver,
      updated: r.updated,
      stLabel: T[st2.k],
      stBg: st2.bg,
      stFg: st2.fg,
      canOpen,
      open: () => s.openRequest(r.id),
    };
  });
  const workTitle = wFilter === "draft" ? T.w_drafts : wFilter === "review" ? T.w_review : wFilter === "approved" ? T.w_approved : T.w_requests;

  // ---- Knowledge Base ----
  const kbTab = st.kbTab || "refs";
  const kbStatusMap: Record<string, { k: string; bg: string; fg: string }> = {
    active: { k: "kb_active", bg: "var(--green-bg)", fg: "#1F6E40" },
    partial: { k: "kb_partial", bg: "var(--gold-bg)", fg: "#8A6D1E" },
  };
  const kbRefs = KBREFS.map((r) => {
    const st2 = kbStatusMap[r.status] || kbStatusMap.active;
    return {
      name: AR2 ? r.ar : r.en,
      type: r.type,
      org: r.org,
      date: r.date,
      stLabel: T[st2.k],
      stBg: st2.bg,
      stFg: st2.fg,
      usedLabel: r.used ? T.kb_yes : T.kb_no,
      usedBg: r.used ? "var(--green-bg)" : "#EEF0F4",
      usedFg: r.used ? "#1F6E40" : "#7B8390",
    };
  });
  const kbData = KBDATA.map((d) => ({ name: AR2 ? d.ar : d.en, src: d.src }));
  const kbTabs = [
    { key: "refs", label: T.kb_refs, active: kbTab === "refs", on: () => s.openKB("refs") },
    { key: "data", label: T.kb_data, active: kbTab === "data", on: () => s.openKB("data") },
  ].map((t) => ({ ...t, bg: t.active ? "var(--ink2)" : "var(--surface)", fg: t.active ? "#fff" : "var(--muted)", bd: t.active ? "var(--ink2)" : "var(--line2)" }));

  // ---- Employee profile ----
  let empVM: any = null;
  if (st.empSel) {
    const e = EMPLOYEES.find((x) => x.id === st.empSel);
    if (e) {
      const st2 = stMap[e.jd];
      const u = MASTER.units.find((x) => x.id === e.unit);
      const sec = u ? MASTER.sections.find((x) => x.id === u.section) : null;
      const dep = sec ? MASTER.departments.find((x) => x.id === sec.dept) : null;
      const initials = (e.en || "").split(" ").map((w) => w[0]).slice(0, 2).join("");
      const hasApproved = e.jd === "approved";
      empVM = {
        id: e.id,
        name: AR2 ? e.ar : e.en,
        title: AR2 ? e.titleAr : e.titleEn,
        grade: e.grade,
        initials,
        department: nm(dep),
        section: nm(sec),
        unit: nm(u),
        manager: AR2 ? e.mgrAr : e.mgrEn,
        yos: e.yos + (AR2 ? " سنوات" : " yrs"),
        ver: e.ver,
        stLabel: T[st2.k],
        stBg: st2.bg,
        stFg: st2.fg,
        noApproved: !hasApproved,
        dlOpacity: hasApproved ? "1" : ".45",
        download: () => {
          if (hasApproved) s.empUpdate(e.id);
        },
        update: () => s.empUpdate(e.id),
      };
    }
  }

  return {
    navGroups,
    requestCards,
    themeSwatches,
    t: T,
    dir: lang === "ar" ? "rtl" : "ltr",
    langBtnLabel: T.lang_btn,
    org: orgCard,
    threadTitle: T[st.threadKey],
    isWelcome: st.view === "welcome",
    isChat: st.view === "chat",
    isOrg: st.view === "org",
    isEmployee: st.view === "employee",
    isWork: st.view === "work",
    workTabs,
    workItems,
    workTitle,
    isAnalytics: st.view === "analytics",
    anKpis,
    anStatus,
    anDept,
    isKB: st.view === "kb",
    kbTabs,
    kbRefs,
    kbData,
    isKBRefs: kbTab === "refs",
    isKBData: kbTab === "data",
    isSmart: st.view === "smart",
    smart: smartVM,
    smartAcked: !!st.smartAcked,
    smartNotAcked: !st.smartAcked,
    backChat: () => s.backChat(),
    ackSmart: () => s.ackSmart(),
    showComposer: st.view === "welcome" || st.view === "chat",
    orgTree,
    employees,
    positions,
    orgUnits,
    recTitle,
    recSub,
    isRecEmployees: recMode === "employees",
    isRecPositions: recMode === "positions",
    isRecOrg: recMode === "org",
    unitName: nm(unitObj),
    unitCount: empList.length + (AR2 ? " موظفين" : " employees"),
    emp: empVM,
    rf,
    backToOrg: () => s.backToOrg(),
    messages,
    hasJd: !!st.jd,
    isArtifactOpen: !!st.jd && st.artifactOpen,
    artifactToggleLabel: st.artifactOpen
      ? lang === "ar"
        ? "إخفاء المستند"
        : "Hide document"
      : lang === "ar"
        ? "عرض المستند"
        : "Show document",
    mainPadEnd: !!st.jd && st.artifactOpen ? "min(600px,94vw)" : "0px",
    jd: jdvm,
    input: st.input,
    draftTitle: st.draftTitle,
    customTitle: st.customTitle,
    pickerGroups: groups,
    pickerEmpty: !st.draftTitle,
    confirmOpacity: st.draftTitle ? "1" : ".5",
    newJD: () => s.newJD(),
    toggleLang: () => s.toggleLang(),
    onPickerChange: (e: any) => s.onPickerChange(e),
    confirmTitle: () => s.confirmTitle(),
    onCustomInput: (e: any) => s.onCustomInput(e),
    useCustom: () => s.useCustom(),
    onInput: (e: any) => s.onInput(e),
    onKey: (e: any) => s.onKey(e),
    send: () => s.send(),
    toggleArtifact: () => s.toggleArtifact(),
    closeArtifact: () => s.closeArtifact(),
    verifyFromArtifact: () => s.verifyFromArtifact(),
    exportDoc: () => s.exportDoc(),
    approveRoute: () => s.approveRoute(),
  };
}
