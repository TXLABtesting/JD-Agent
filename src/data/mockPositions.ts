import type { RequestRec } from "../types";

/**
 * Mock JD request / position records (Workspace). In production these are backed
 * by the JD workflow system; here they are seeded demo data. Approved position
 * titles themselves live in officialReferences.ts (the Approved Job Titles List).
 */
export const REQUESTS: RequestRec[] = [
  { id: "JD-2041", en: "Ayoub Bari", ar: "أيوب باري", titleEn: "Senior Analyst", titleAr: "محلل أول", grade: "2.2", status: "approved", ver: "v1.0", updated: "2026-06-24" },
  { id: "JD-2038", en: "Omar Nasser", ar: "عمر ناصر", titleEn: "Analyst", titleAr: "محلل", grade: "2.2", status: "approved", ver: "v1.0", updated: "2026-06-18" },
  { id: "JD-2033", en: "Layla Hassan", ar: "ليلى حسن", titleEn: "Executive", titleAr: "تنفيذي", grade: "2.2", status: "approved", ver: "v1.0", updated: "2026-06-11" },
  { id: "JD-2050", en: "Khalid Rahman", ar: "خالد رحمن", titleEn: "Consultant", titleAr: "استشاري", grade: "2.2", status: "draft", ver: "v0.2", updated: "2026-06-29" },
  { id: "JD-2051", en: "—", ar: "—", titleEn: "Specialist – Total Experience", titleAr: "أخصائي – التجربة الشاملة", grade: "2.2", status: "draft", ver: "v0.1", updated: "2026-06-30" },
  { id: "JD-2047", en: "Noura Al Ali", ar: "نورة العلي", titleEn: "Head of Section", titleAr: "مدير قسم", grade: "4.1", status: "review", ver: "v2.1", updated: "2026-06-27" },
];
