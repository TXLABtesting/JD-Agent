import type { Competency, KbDataRec, KbRef, RoleArchetype, TitleRec } from "../types";

/**
 * Official reference documents the agent grounds every JD in:
 * approved job titles, qualifications framework, competency framework,
 * role archetypes (from JD reference examples), section mandate, and the
 * Knowledge Base catalog. Seeded demo data in this prototype.
 */

export const MANDATE: [string, string][] = [
  ["M1", "Develop and deliver a comprehensive strategy to improve employee experience through proactive, flexible services."],
  ["M2", "Lead automation of central services and improve user experience through digital journey design with technical teams."],
  ["M3", "Reduce administrative and paper procedures and raise operational efficiency (zero bureaucracy)."],
  ["M4", "Run internal events and loyalty initiatives that strengthen communication, belonging and satisfaction."],
  ["M5", "Measure employee and customer satisfaction via periodic surveys; analyse results and recommend improvements."],
  ["M6", "Manage customer communication channels; handle complaints and feedback and follow corrective actions."],
  ["M7", "Manage supplier registration and relations and keep the e-platform easy to use with current data."],
  ["M8", "Oversee special initiatives and projects; prepare performance reports and follow improvement plans."],
  ["M9", "Contribute to team plans and programs aligned to department and sector strategy; execute after approval."],
  ["M10", "Any other tasks and responsibilities assigned."],
];

/** Qualifications & Expertise Framework — education/experience by grade. */
export const QUALS: Record<string, string> = {
  "5": "Doctorate (12+ yrs) · Master’s (14+ yrs) · Bachelor’s (16+ yrs)",
  "4.3": "Doctorate (10+) · Master’s (12+) · Bachelor’s (14+)",
  "4.2": "Doctorate (8+) · Master’s (9+) · Bachelor’s (12+)",
  "4.1": "Doctorate (6+) · Master’s (8+) · Bachelor’s (9+)",
  "3.3": "Doctorate (4+) · Master’s (6+) · Bachelor’s/High Diploma (8+)",
  "3.2": "Doctorate (2+) · Master’s (4+) · Bachelor’s/High Diploma (6+)",
  "3.1": "Doctorate (0–2) · Master’s (2+) · Bachelor’s/High Diploma (4+) · Diploma (11+)",
  "2.3": "Master’s (0–2) · Bachelor’s/High Diploma (2+) · Diploma (8+)",
  "2.2": "Bachelor’s/High Diploma (0–2) · Diploma (5+) · High School (12+)",
  "2.1": "Diploma (2+) · High School (7+)",
  "1.3": "Diploma (0–2) · High School (3+)",
  "1.2": "High School (1–3)",
  "1.1": "High School (0–1)",
};

/** Competency Framework — core + leadership competencies. */
export const CORE: Competency[] = [
  { en: "Communication", ar: "الاتصال" },
  { en: "Teamwork", ar: "العمل بروح الفريق" },
  { en: "Accountability", ar: "المساءلة" },
  { en: "Flexibility & Willingness for New Challenges", ar: "المرونة والاستعداد للتحدي" },
];
export const LEAD: Competency[] = [
  { en: "Strategic Thinking", ar: "التفكير الاستراتيجي" },
  { en: "Decision Making", ar: "صنع القرار" },
  { en: "Leading Change", ar: "قيادة التغيير" },
  { en: "Employee Empowerment & Skill Development", ar: "تمكين وتطوير الموظفين" },
];

/** Approved Job Titles List — title × occupational family × grade. */
export const TITLES: TitleRec[] = [
  { en: "Head of Section", ar: "مدير قسم", family: "Supervisory", grade: "4.1" },
  { en: "Lead", ar: "قائد فريق", family: "Supervisory", grade: "4.1" },
  { en: "Deputy Director", ar: "نائب مدير إدارة", family: "Supervisory", grade: "4.1" },
  { en: "Director", ar: "مدير إدارة", family: "Supervisory", grade: "4.2" },
  { en: "Senior Director", ar: "مدير إدارة أول", family: "Supervisory", grade: "4.2" },
  { en: "Senior Manager", ar: "مدير أول", family: "General", grade: "3.3" },
  { en: "Senior Project Manager", ar: "مدير مشاريع أول", family: "General", grade: "3.3" },
  { en: "Manager", ar: "مدير", family: "General", grade: "3.2" },
  { en: "Project Manager", ar: "مدير مشاريع", family: "General", grade: "3.2" },
  { en: "Assistant Manager", ar: "مساعد مدير", family: "General", grade: "3.1" },
  { en: "Assistant Project Manager", ar: "مساعد مدير مشاريع", family: "General", grade: "3.1" },
  { en: "Senior Associate", ar: "ملحق أول", family: "General", grade: "2.3" },
  { en: "Associate", ar: "ملحق", family: "General", grade: "2.3" },
  { en: "Senior Consultant", ar: "استشاري أول", family: "General", grade: "2.3" },
  { en: "Consultant", ar: "استشاري", family: "General", grade: "2.3" },
  { en: "Senior Analyst", ar: "محلل أول", family: "General", grade: "2.2" },
  { en: "Analyst", ar: "محلل", family: "General", grade: "2.2" },
  { en: "Senior Executive", ar: "تنفيذي أول", family: "General", grade: "2.2" },
  { en: "Executive", ar: "تنفيذي", family: "General", grade: "2.2" },
  { en: "Senior Advisor", ar: "مستشار أول", family: "Advisory", grade: "4.3" },
  { en: "Advisor", ar: "مستشار", family: "Advisory", grade: "4.2" },
  { en: "Senior Office Manager", ar: "مدير أول مكتب", family: "Office Managers", grade: "4.1" },
  { en: "Office Manager", ar: "مدير مكتب", family: "Office Managers", grade: "3.2" },
  { en: "Assistant Office Manager", ar: "مساعد مدير مكتب", family: "Office Managers", grade: "3.1" },
  { en: "Senior Executive Assistant", ar: "مساعد تنفيذي أول", family: "Office Managers", grade: "2.3" },
  { en: "Executive Assistant", ar: "مساعد تنفيذي", family: "Office Managers", grade: "2.2" },
];

/** Legacy (pre-approval) title records used by the update flow. */
export const EXISTING = [
  { title: "Senior Analyst", ar: "محلل أول", grade: "2.2", family: "General", approved: true, emp: "Ayoub Bari", empAr: "أيوب باري", v: "v1.0" },
  { title: "Specialist – Total Experience", ar: "—", grade: "2.2", family: "—", approved: false, emp: "Mariam Saeed", empAr: "مريم سعيد", v: "v1.0" },
];

/**
 * Role archetypes by work level (from the JD reference doc). Determines Purpose,
 * Key Responsibilities, authority and KPIs, and which mandate scope to ground in.
 */
export const ROLE_ARCHETYPES: Record<string, RoleArchetype> = {
  managerial: {
    scopeLevel: "department",
    nature: { en: "Lead · Approve · Direct · Govern", ar: "قيادة · اعتماد · توجيه · حوكمة" },
    authority: {
      en: "Full approval authority for plans, initiatives and resource allocation.",
      ar: "صلاحية اعتماد كاملة للخطط والمبادرات وتخصيص الموارد.",
    },
    purpose: {
      en: "Lead and develop the human-capital system by setting and executing strategies, policies and initiatives that strengthen talent attraction, HR readiness, employee experience and institutional culture in support of the ministry's strategic priorities.",
      ar: "قيادة وتطوير منظومة رأس المال البشري من خلال وضع وتنفيذ الاستراتيجيات والسياسات والمبادرات التي تعزز استقطاب الكفاءات ورفع جاهزية الموارد البشرية وتحسين تجربة الموظف وتعزيز الثقافة المؤسسية بما يدعم الأولويات الاستراتيجية للوزارة.",
    },
    resp: [
      { en: "Prepare and approve the HR strategy and its execution plans.", ar: "إعداد واعتماد استراتيجية الموارد البشرية وخطط التنفيذ." },
      { en: "Oversee workforce planning and management of staffing needs.", ar: "الإشراف على تخطيط القوى العاملة وإدارة الاحتياجات الوظيفية." },
      { en: "Lead development of HR policies, procedures and governance.", ar: "قيادة تطوير السياسات والإجراءات والحوكمة الخاصة بالموارد البشرية." },
      { en: "Oversee the performance-management and professional-development system.", ar: "الإشراف على منظومة إدارة الأداء والتطوير المهني." },
      { en: "Approve employee-experience, wellbeing and engagement initiatives.", ar: "اعتماد مبادرات تجربة الموظف والرفاه الوظيفي والمشاركة المؤسسية." },
      { en: "Oversee KPIs and raise recommendations to senior management.", ar: "الإشراف على مؤشرات الأداء ورفع التوصيات للإدارة العليا." },
      { en: "Ensure integration across ministry departments for a unified experience.", ar: "ضمان التكامل بين إدارات الوزارة لتحقيق تجربة موحدة." },
      { en: "Supervise the sections and units reporting to the department.", ar: "الإشراف على الأقسام والوحدات التابعة للإدارة." },
    ],
    kpis: [
      { en: "Employee satisfaction", ar: "رضا الموظفين" },
      { en: "HR-plan compliance rate", ar: "نسبة الالتزام بخطط الموارد البشرية" },
      { en: "Strategic-initiative delivery", ar: "نسبة تنفيذ المبادرات الاستراتيجية" },
      { en: "Employee-experience quality", ar: "جودة تجربة الموظف" },
    ],
  },
  advisory: {
    scopeLevel: "section",
    nature: { en: "Design · Analyse · Develop · Advise", ar: "تصميم · تحليل · تطوير · استشارة" },
    authority: {
      en: "Leads initiatives and gives recommendations — no final approval authority.",
      ar: "قيادة المبادرات وتقديم التوصيات دون صلاحية الاعتماد النهائي.",
    },
    purpose: {
      en: "Design, develop and manage the total-experience system and lead analysis and innovation to raise service quality and improve stakeholder experience.",
      ar: "تصميم وتطوير وإدارة منظومة التجربة الشاملة وقيادة التحليل والابتكار بما يسهم في رفع جودة الخدمات وتحسين تجربة أصحاب العلاقة.",
    },
    resp: [
      { en: "Prepare and develop the total-experience strategy.", ar: "إعداد وتطوير استراتيجية التجربة الشاملة." },
      { en: "Design the stakeholder journey and experience.", ar: "تصميم رحلة وتجربة أصحاب العلاقة." },
      { en: "Develop service-delivery and user-experience standards.", ar: "تطوير معايير تقديم الخدمات وتجربة المستخدم." },
      { en: "Analyse satisfaction and engagement data and extract recommendations.", ar: "تحليل بيانات الرضا والتفاعل واستخراج التوصيات." },
      { en: "Lead continuous-improvement initiatives.", ar: "قيادة مبادرات التحسين المستمر." },
      { en: "Develop measurement tools and indicators.", ar: "تطوير أدوات القياس والمؤشرات." },
      { en: "Prepare analytical studies and reports.", ar: "إعداد الدراسات والتقارير التحليلية." },
      { en: "Propose development solutions and raise recommendations.", ar: "اقتراح الحلول التطويرية ورفع التوصيات." },
      { en: "Track the impact of initiatives on institutional performance.", ar: "متابعة أثر المبادرات على الأداء المؤسسي." },
    ],
    kpis: [
      { en: "Improvement in satisfaction indicators", ar: "تحسن مؤشرات الرضا" },
      { en: "Initiatives implemented", ar: "نسبة المبادرات المنفذة" },
      { en: "Impact of improvements on experience", ar: "أثر التحسينات على التجربة" },
      { en: "Quality of studies and recommendations", ar: "جودة الدراسات والتوصيات" },
    ],
  },
  executive: {
    scopeLevel: "unit",
    nature: { en: "Execute · Operate · Follow up · Coordinate", ar: "تنفيذ · تشغيل · متابعة · تنسيق" },
    authority: {
      en: "Executes and operates daily work — no authority to approve initiatives.",
      ar: "التنفيذ وتشغيل الأعمال اليومية — لا يملك صلاحية اعتماد المبادرات.",
    },
    purpose: {
      en: "Execute total-experience programs and initiatives, support operation of engagement channels, and measure stakeholder satisfaction to ensure a consistent, effective experience.",
      ar: "تنفيذ برامج ومبادرات التجربة الشاملة ودعم تشغيل قنوات التفاعل وقياس رضا أصحاب العلاقة بما يضمن تقديم تجربة متسقة وفعالة.",
    },
    resp: [
      { en: "Execute employee, customer, candidate and partner experience activities.", ar: "تنفيذ أنشطة وبرامج تجربة الموظف والمتعامل والمرشح والشريك." },
      { en: "Operate and follow up feedback channels.", ar: "تشغيل ومتابعة قنوات التغذية الراجعة." },
      { en: "Collect and analyse initial feedback and escalate it.", ar: "جمع وتحليل الملاحظات الأولية ورفعها." },
      { en: "Run satisfaction and engagement surveys.", ar: "تنفيذ استطلاعات الرضا والمشاركة." },
      { en: "Prepare periodic operational reports.", ar: "إعداد تقارير تشغيلية دورية." },
      { en: "Follow up implementation of approved improvement initiatives.", ar: "متابعة تنفيذ مبادرات التحسين المعتمدة." },
      { en: "Coordinate with departments to ensure experience quality.", ar: "التنسيق مع الإدارات لضمان جودة التجربة." },
      { en: "Support wellbeing programs and internal communication.", ar: "دعم برامج الرفاه الوظيفي والتواصل الداخلي." },
      { en: "Track service and beneficiary-experience indicators; maintain initiative records.", ar: "متابعة مؤشرات الخدمة وتجربة المستفيد وتحديث سجلات المبادرات." },
    ],
    kpis: [
      { en: "Response speed", ar: "سرعة الاستجابة" },
      { en: "Initiatives implemented", ar: "نسبة تنفيذ المبادرات" },
      { en: "Engagement rate", ar: "معدل المشاركة" },
      { en: "Report accuracy", ar: "دقة التقارير" },
    ],
  },
};

/** Knowledge Base — official reference documents. */
export const KBREFS: KbRef[] = [
  { en: "Organizational Description Decision — Central Services · HR · Total Experience", ar: "قرار الوصف التنظيمي — الخدمات المركزية · الموارد البشرية · التجربة الشاملة", type: "DOCX", org: "HR Services Department", date: "2026-05-12", status: "active", used: true },
  { en: "HR Services & Total Experience — JD reference examples", ar: "أمثلة الأوصاف الوظيفية — الموارد البشرية والتجربة الشاملة", type: "DOCX", org: "Total Experience Section", date: "2026-05-12", status: "active", used: true },
  { en: "Unified Job Description Template (MOCA-1289)", ar: "قالب الوصف الوظيفي الموحد (MOCA-1289)", type: "PDF", org: "Ministry-wide", date: "2026-04-30", status: "active", used: true },
  { en: "Approved Job Titles List", ar: "جدول المسميات الوظيفية المعتمد", type: "XLSX", org: "Ministry-wide", date: "2026-04-22", status: "active", used: true },
  { en: "Qualifications & Expertise Framework", ar: "إطار المؤهلات والخبرات", type: "PDF", org: "HR Services Department", date: "2026-03-15", status: "active", used: true },
  { en: "Competency Framework & Level Matrix", ar: "إطار الكفاءات ومصفوفة المستويات", type: "PDF", org: "HR Services Department", date: "2026-03-15", status: "partial", used: true },
];

/** Knowledge Base — reference datasets (master data). */
export const KBDATA: KbDataRec[] = [
  { en: "Approved Job Titles", ar: "المسميات الوظيفية المعتمدة", src: "Approved Job Titles List" },
  { en: "Job Grades (1.1–5)", ar: "الدرجات الوظيفية (1.1–5)", src: "MOCA grade scale" },
  { en: "Occupational Families", ar: "الفئات الوظيفية", src: "Approved Job Titles List" },
  { en: "Organizational Units", ar: "الوحدات التنظيمية", src: "Organizational Description" },
  { en: "Core Competencies", ar: "الكفاءات الأساسية", src: "Competency Framework" },
  { en: "Leadership Competencies", ar: "الكفاءات القيادية", src: "Competency Framework" },
];
