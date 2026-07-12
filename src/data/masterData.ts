import type {
  MasterDepartment,
  MasterEntity,
  MasterSection,
  MasterSector,
  MasterUnit,
  OrgNode,
} from "../types";

/**
 * Master Data — the official organizational hierarchy used for cascading
 * dropdowns and org browsing. In production this is sourced from Oracle Fusion /
 * the Organizational Description decision; here it is seeded demo data.
 */

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

export const FAM_AR: Record<string, string> = {
  Supervisory: "إشرافي",
  General: "عام",
  Advisory: "استشاري",
  "Office Managers": "مديرو المكاتب",
  Leadership: "قيادي",
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

/** Official organizational description (mandates per org level). */
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
