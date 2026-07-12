export type Lang = "en" | "ar";

export interface Bi {
  en: string;
  ar: string;
}

export interface TitleRec {
  en: string;
  ar: string;
  family: string;
  grade: string;
  familyAr?: string;
}

export interface Competency {
  en: string;
  ar: string;
}

export interface RoleArchetype {
  scopeLevel: "department" | "section" | "unit";
  nature: Bi;
  authority: Bi;
  purpose: Bi;
  resp: Bi[];
  kpis: Bi[];
}

export interface OrgNode {
  en: string;
  ar: string;
  mandate: Bi;
}

export interface MasterEntity {
  id: string;
  en: string;
  ar: string;
}
export interface MasterSector extends MasterEntity {
  entity: string;
}
export interface MasterDepartment extends MasterEntity {
  sector: string;
}
export interface MasterSection extends MasterEntity {
  dept: string;
}
export interface MasterUnit extends MasterEntity {
  section: string;
}

export interface Employee {
  id: string;
  en: string;
  ar: string;
  titleEn: string;
  titleAr: string;
  grade: string;
  mgrEn: string;
  mgrAr: string;
  unit: string;
  jd: "approved" | "draft" | "review" | "none";
  ver: string;
  yos: number;
  approved: boolean;
}

export interface RequestRec {
  id: string;
  en: string;
  ar: string;
  titleEn: string;
  titleAr: string;
  grade: string;
  status: "approved" | "draft" | "review";
  ver: string;
  updated: string;
  dept?: string;
}

export interface KbRef {
  en: string;
  ar: string;
  type: string;
  org: string;
  date: string;
  status: "active" | "partial";
  used: boolean;
}

export interface KbDataRec {
  en: string;
  ar: string;
  src: string;
}

export interface Theme {
  name: Bi;
  dots: [string, string, string];
  v: Record<string, string>;
}

export interface Seed {
  title: string;
  ar?: string;
  family?: string;
  grade: string;
  approved: boolean;
  emp?: string;
  manager?: string;
  targetUnit?: string;
}

export interface RespItem {
  t: Bi;
  src: Bi;
  override?: string;
}
export interface RespGroup {
  label: Bi;
  items: RespItem[];
}

export interface Flag {
  key: string;
  params?: Record<string, string | number>;
}

export interface Jd {
  title: string;
  titleAr: string;
  grade: string;
  code: string;
  resp: RespGroup[];
  quals: { base?: string };
  flags: Flag[];
  confidence: "high" | "medium" | "low";
  verified: boolean;
  emp: string;
  manager: string;
  roleKey: string;
  scopeLevel: string;
  scope: Bi;
  mandate: Bi;
  purposeText: Bi;
  natureLine: Bi;
  authorityText: Bi;
  kpis: Bi[];
  status?: string;
  stage?: string;
}

export interface ReqForm {
  mode: "employee" | "position" | "prejoin" | "transfer";
  entity: string;
  sector: string;
  dept: string;
  section: string;
  unit: string;
  title: string;
  titleAr: string;
  grade: string;
  manager: string;
  employee?: string;
  empId?: string;
  positionId?: string;
  reason?: string;
  family?: string;
  mgrEn?: string;
  fromUnit?: string;
}

export interface Chip {
  label?: string;
  labelKey?: string;
  action: string;
  payload?: unknown;
  variant?: "solid" | null;
}

export interface StepDef {
  labelKey: string;
  icon: string;
  color: string;
  textColor: string;
  note: string;
}

export interface Message {
  id: number;
  role: "user" | "agent";
  text?: string;
  tkey?: string | null;
  params?: Record<string, string | number> | null;
  isOrgCard?: boolean;
  isPicker?: boolean;
  isValidated?: boolean;
  isAlert?: boolean;
  isSteps?: boolean;
  isJdReady?: boolean;
  isMandate?: boolean;
  isValGate?: boolean;
  isAgentRun?: boolean;
  isReview?: boolean;
  isExplain?: boolean;
  isSummary?: boolean;
  isSummaryLive?: boolean;
  isReqForm?: boolean;
  isTransferCompare?: boolean;
  isTimeline?: boolean;
  isPromo?: boolean;
  hasChips?: boolean;
  chips?: Chip[];
  // extras carried on specific message kinds
  steps?: StepDef[];
  vTitle?: string;
  vAr?: string;
  vFamilyKey?: string;
  vGrade?: string;
  akey?: string;
  grade?: string;
  stage?: string;
  rows?: { item: RespItem; mapped: boolean }[];
  gaps?: string[];
  scopeLevel?: string;
  title?: string;
  fromTxt?: string;
  toTxt?: string;
  emp?: string;
}

export interface AppState {
  lang: Lang;
  theme: string;
  view:
    | "welcome"
    | "chat"
    | "kb"
    | "analytics"
    | "work"
    | "org"
    | "employee"
    | "smart";
  threadKey: string;
  messages: Message[];
  flow: string | null;
  seed: Seed | null;
  jd: Jd | null;
  artifactOpen: boolean;
  input: string;
  draftTitle: string;
  customTitle: string;
  expOpen: Record<number, boolean>;
  orgSel: string;
  empSel: string | null;
  smartAcked: boolean;
  intake: { mode: string; f: Record<string, unknown> } | null;
  reqForm?: ReqForm | null;
  recordsMode?: "employees" | "positions" | "org";
  workFilter?: string;
  kbTab?: string;
}
