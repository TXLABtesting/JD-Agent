import type {
  Bi,
  Competency,
  Employee,
  KbDataRec,
  KbRef,
  MasterDepartment,
  MasterEntity,
  MasterSection,
  MasterSector,
  MasterUnit,
  OrgNode,
  RequestRec,
  RoleArchetype,
  Theme,
  TitleRec,
} from "./types";

export const ORG_EN = {
  entity: "Ministry of Cabinet Affairs (MOCA)",
  sector: "Central Services Sector",
  department: "HR Services Department",
  section: "UX – Total Experience",
  unit: "Total Experience Team",
};
export const ORG_AR = {
  entity: "وزارة شؤون مجلس الوزراء (MOCA)",
  sector: "قطاع الخدمات المركزية",
  department: "إدارة خدمات الموارد البشرية",
  section: "تجربة المستخدم – التجربة المتكاملة",
  unit: "فريق التجربة المتكاملة",
};

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

export const FAM_AR: Record<string, string> = {
  Supervisory: "إشرافي",
  General: "عام",
  Advisory: "استشاري",
  "Office Managers": "مديرو المكاتب",
  Leadership: "قيادي",
};

export const EXISTING = [
  { title: "Senior Analyst", ar: "محلل أول", grade: "2.2", family: "General", approved: true, emp: "Ayoub Bari", empAr: "أيوب باري", v: "v1.0" },
  { title: "Specialist – Total Experience", ar: "—", grade: "2.2", family: "—", approved: false, emp: "Mariam Saeed", empAr: "مريم سعيد", v: "v1.0" },
];

export const ORG_TREE: Record<string, OrgNode> = {
  ministry: {
    en: "Ministry of Cabinet Affairs",
    ar: "وزارة شؤون مجلس الوزراء",
    mandate: {
      en: "Lead and enable government work by developing policies, strengthening institutional governance, supporting excellence and innovation, building government capabilities, and enabling digital transformation.",
      ar: "قيادة وتمكين العمل الحكومي من خلال تطوير السياسات الحكومية وتعزيز الحوكمة المؤسسية ودعم التميز والابتكار وبناء القدرات الحكومية وتمكين التحول الرقمي.",
    },
  },
  department: {
    en: "HR Services Department",
    ar: "إدارة الموارد البشرية",
    mandate: {
      en: "Develop and implement human-capital strategies, policies and programs ensuring talent attraction, capability development, performance management, employee engagement, wellbeing, institutional culture, talent management and workforce planning.",
      ar: "تطوير وتنفيذ استراتيجيات وسياسات وبرامج رأس المال البشري بما يضمن استقطاب الكفاءات وتنمية القدرات وإدارة الأداء وتعزيز مشاركة الموظفين والرفاه الوظيفي والثقافة المؤسسية وإدارة المواهب والتخطيط للقوى العاملة.",
    },
  },
  section: {
    en: "Total Experience Section",
    ar: "قسم التجربة الشاملة",
    mandate: {
      en: "Design, manage and develop the integrated experience for all stakeholders — employees, customers, candidates, partners and suppliers — set service standards, manage engagement initiatives, measure satisfaction and lead continuous improvement.",
      ar: "تصميم وإدارة وتطوير التجربة المتكاملة لجميع الفئات ذات العلاقة، ووضع معايير تقديم الخدمات وإدارة مبادرات المشاركة وقياس الرضا وقيادة التحسين المستمر.",
    },
  },
  unit: {
    en: "Total Experience Team",
    ar: "فريق التجربة الشاملة",
    mandate: {
      en: "Execute initiatives that improve stakeholder experience by managing feedback channels, measuring satisfaction, analysing data, proposing and implementing improvements, and coordinating across units for a consistent experience.",
      ar: "تنفيذ المبادرات التي تحسّن تجربة أصحاب العلاقة عبر إدارة قنوات التغذية الراجعة وقياس الرضا وتحليل البيانات واقتراح وتنفيذ التحسينات والتنسيق مع الوحدات لضمان تجربة متسقة.",
    },
  },
};

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

export const MASTER: {
  entities: MasterEntity[];
  sectors: MasterSector[];
  departments: MasterDepartment[];
  sections: MasterSection[];
  units: MasterUnit[];
} = {
  entities: [{ id: "moca", en: "Ministry of Cabinet Affairs", ar: "وزارة شؤون مجلس الوزراء" }],
  sectors: [
    { id: "central", entity: "moca", en: "Central Services Sector", ar: "قطاع الخدمات المركزية" },
    { id: "gov", entity: "moca", en: "Government Excellence Sector", ar: "قطاع تحسين الأداء الحكومي" },
  ],
  departments: [
    { id: "hr", sector: "central", en: "HR Services Department", ar: "إدارة الموارد البشرية" },
    { id: "fin", sector: "central", en: "Finance Department", ar: "إدارة المالية" },
    { id: "it", sector: "central", en: "IT Services Department", ar: "إدارة خدمات تقنية المعلومات" },
  ],
  sections: [
    { id: "tx", dept: "hr", en: "UX – Total Experience", ar: "تجربة المستخدم – التجربة الشاملة" },
    { id: "ops", dept: "hr", en: "HR Operations", ar: "عمليات الموارد البشرية" },
    { id: "talent", dept: "hr", en: "Talent & OD", ar: "المواهب والتطوير المؤسسي" },
  ],
  units: [
    { id: "txteam", section: "tx", en: "Total Experience Team", ar: "فريق التجربة الشاملة" },
    { id: "insight", section: "tx", en: "Experience Insights Team", ar: "فريق تحليلات التجربة" },
  ],
};

export const GRADES = ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.1", "3.2", "3.3", "4.1", "4.2", "4.3", "5"];

export const EMPLOYEES: Employee[] = [
  { id: "E-10482", en: "Ayoub Bari", ar: "أيوب باري", titleEn: "Senior Analyst", titleAr: "محلل أول", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "approved", ver: "v1.0", yos: 6, approved: true },
  { id: "E-10517", en: "Mariam Saeed", ar: "مريم سعيد", titleEn: "Specialist – Total Experience", titleAr: "أخصائي – التجربة الشاملة", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "none", ver: "—", yos: 8, approved: false },
  { id: "E-10603", en: "Khalid Rahman", ar: "خالد رحمن", titleEn: "Consultant", titleAr: "استشاري", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "draft", ver: "v0.2", yos: 4, approved: true },
  { id: "E-10322", en: "Noura Al Ali", ar: "نورة العلي", titleEn: "Head of Section", titleAr: "مدير قسم", grade: "4.1", mgrEn: "Faisal Odeh", mgrAr: "فيصل عودة", unit: "txteam", jd: "review", ver: "v2.1", yos: 11, approved: true },
  { id: "E-10711", en: "Salma Yusuf", ar: "سلمى يوسف", titleEn: "Executive", titleAr: "تنفيذي", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "none", ver: "—", yos: 2, approved: true },
  { id: "E-10804", en: "Omar Nasser", ar: "عمر ناصر", titleEn: "Analyst", titleAr: "محلل", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "insight", jd: "approved", ver: "v1.0", yos: 3, approved: true },
];

export const REQUESTS: RequestRec[] = [
  { id: "JD-2041", en: "Ayoub Bari", ar: "أيوب باري", titleEn: "Senior Analyst", titleAr: "محلل أول", grade: "2.2", status: "approved", ver: "v1.0", updated: "2026-06-24" },
  { id: "JD-2038", en: "Omar Nasser", ar: "عمر ناصر", titleEn: "Analyst", titleAr: "محلل", grade: "2.2", status: "approved", ver: "v1.0", updated: "2026-06-18" },
  { id: "JD-2033", en: "Layla Hassan", ar: "ليلى حسن", titleEn: "Executive", titleAr: "تنفيذي", grade: "2.2", status: "approved", ver: "v1.0", updated: "2026-06-11" },
  { id: "JD-2050", en: "Khalid Rahman", ar: "خالد رحمن", titleEn: "Consultant", titleAr: "استشاري", grade: "2.2", status: "draft", ver: "v0.2", updated: "2026-06-29" },
  { id: "JD-2051", en: "—", ar: "—", titleEn: "Specialist – Total Experience", titleAr: "أخصائي – التجربة الشاملة", grade: "2.2", status: "draft", ver: "v0.1", updated: "2026-06-30" },
  { id: "JD-2047", en: "Noura Al Ali", ar: "نورة العلي", titleEn: "Head of Section", titleAr: "مدير قسم", grade: "4.1", status: "review", ver: "v2.1", updated: "2026-06-27" },
];

export const KBREFS: KbRef[] = [
  { en: "Organizational Description Decision — Central Services · HR · Total Experience", ar: "قرار الوصف التنظيمي — الخدمات المركزية · الموارد البشرية · التجربة الشاملة", type: "DOCX", org: "HR Services Department", date: "2026-05-12", status: "active", used: true },
  { en: "HR Services & Total Experience — JD reference examples", ar: "أمثلة الأوصاف الوظيفية — الموارد البشرية والتجربة الشاملة", type: "DOCX", org: "Total Experience Section", date: "2026-05-12", status: "active", used: true },
  { en: "Unified Job Description Template (MOCA-1289)", ar: "قالب الوصف الوظيفي الموحد (MOCA-1289)", type: "PDF", org: "Ministry-wide", date: "2026-04-30", status: "active", used: true },
  { en: "Approved Job Titles List", ar: "جدول المسميات الوظيفية المعتمد", type: "XLSX", org: "Ministry-wide", date: "2026-04-22", status: "active", used: true },
  { en: "Qualifications & Expertise Framework", ar: "إطار المؤهلات والخبرات", type: "PDF", org: "HR Services Department", date: "2026-03-15", status: "active", used: true },
  { en: "Competency Framework & Level Matrix", ar: "إطار الكفاءات ومصفوفة المستويات", type: "PDF", org: "HR Services Department", date: "2026-03-15", status: "partial", used: true },
];

export const KBDATA: KbDataRec[] = [
  { en: "Approved Job Titles", ar: "المسميات الوظيفية المعتمدة", src: "Approved Job Titles List" },
  { en: "Job Grades (1.1–5)", ar: "الدرجات الوظيفية (1.1–5)", src: "MOCA grade scale" },
  { en: "Occupational Families", ar: "الفئات الوظيفية", src: "Approved Job Titles List" },
  { en: "Organizational Units", ar: "الوحدات التنظيمية", src: "Organizational Description" },
  { en: "Core Competencies", ar: "الكفاءات الأساسية", src: "Competency Framework" },
  { en: "Leadership Competencies", ar: "الكفاءات القيادية", src: "Competency Framework" },
];

export const THEMES: Record<string, Theme> = {
  navy: {
    name: { en: "Royal Navy", ar: "كحلي ملكي" },
    dots: ["#1F2A48", "#C6A15B", "#F5F6FA"],
    v: { "--ink": "#1F2A48", "--ink2": "#16203A", "--ink3": "#33406A", "--paper": "#F5F6FA", "--surface": "#ffffff", "--line": "#E7EBF2", "--line2": "#DBE1EA", "--muted": "#6B7388", "--muted2": "#9AA2B4", "--gold": "#C6A15B", "--gold-d": "#A07F2F", "--gold-bg": "#F6EFDD", "--blue": "#3F6FD6", "--blue-bg": "#E8EEFB", "--green": "#2F9E5B", "--green-bg": "#E6F4EC", "--amber": "#A07F2F", "--amber-bg": "#F6EFDD" },
  },
  teal: {
    name: { en: "Deep Teal", ar: "فيروزي عميق" },
    dots: ["#123A3A", "#D3A75E", "#F2F6F5"],
    v: { "--ink": "#123A3A", "--ink2": "#0C2C2C", "--ink3": "#2C5551", "--paper": "#F2F6F5", "--surface": "#ffffff", "--line": "#E1EBE8", "--line2": "#D3E0DC", "--muted": "#5E7370", "--muted2": "#93A8A3", "--gold": "#D3A75E", "--gold-d": "#A9803B", "--gold-bg": "#F3EBDA", "--blue": "#2F8F8A", "--blue-bg": "#E4F1EF", "--green": "#2F9E5B", "--green-bg": "#E6F4EC", "--amber": "#A9803B", "--amber-bg": "#F3EBDA" },
  },
  indigo: {
    name: { en: "Indigo Mint", ar: "نيلي ونعناعي" },
    dots: ["#28306B", "#16A67B", "#F4F5FB"],
    v: { "--ink": "#28306B", "--ink2": "#1D2450", "--ink3": "#3B4488", "--paper": "#F4F5FB", "--surface": "#ffffff", "--line": "#E6E8F3", "--line2": "#D8DBEC", "--muted": "#6A7091", "--muted2": "#9CA0BE", "--gold": "#16A67B", "--gold-d": "#0E8663", "--gold-bg": "#E3F4EE", "--blue": "#4F6FE0", "--blue-bg": "#E9EDFC", "--green": "#16A67B", "--green-bg": "#E3F4EE", "--amber": "#B78428", "--amber-bg": "#F6EEDB" },
  },
  slate: {
    name: { en: "Slate Emerald", ar: "رمادي وزمردي" },
    dots: ["#1E293B", "#0EA271", "#F5F7F9"],
    v: { "--ink": "#1E293B", "--ink2": "#0F172A", "--ink3": "#37475F", "--paper": "#F5F7F9", "--surface": "#ffffff", "--line": "#E6EAF0", "--line2": "#D8DEE7", "--muted": "#64748B", "--muted2": "#98A3B4", "--gold": "#0EA271", "--gold-d": "#0B7E58", "--gold-bg": "#E3F3EC", "--blue": "#3B82F6", "--blue-bg": "#E8F0FE", "--green": "#0EA271", "--green-bg": "#E3F3EC", "--amber": "#B4832A", "--amber-bg": "#F6EEDB" },
  },
};

export type { Bi };
