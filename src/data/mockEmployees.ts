import type { Employee } from "../types";

/**
 * Mock employee records (Total Experience Team). In production these come from
 * the real employee system / Oracle Fusion; here they are seeded demo data.
 */
export const EMPLOYEES: Employee[] = [
  { id: "E-10482", en: "Ayoub Bari", ar: "أيوب باري", titleEn: "Senior Analyst", titleAr: "محلل أول", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "approved", ver: "v1.0", yos: 6, approved: true },
  { id: "E-10517", en: "Mariam Saeed", ar: "مريم سعيد", titleEn: "Specialist – Total Experience", titleAr: "أخصائي – التجربة الشاملة", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "none", ver: "—", yos: 8, approved: false },
  { id: "E-10603", en: "Khalid Rahman", ar: "خالد رحمن", titleEn: "Consultant", titleAr: "استشاري", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "draft", ver: "v0.2", yos: 4, approved: true },
  { id: "E-10322", en: "Noura Al Ali", ar: "نورة العلي", titleEn: "Head of Section", titleAr: "مدير قسم", grade: "4.1", mgrEn: "Faisal Odeh", mgrAr: "فيصل عودة", unit: "txteam", jd: "review", ver: "v2.1", yos: 11, approved: true },
  { id: "E-10711", en: "Salma Yusuf", ar: "سلمى يوسف", titleEn: "Executive", titleAr: "تنفيذي", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "txteam", jd: "none", ver: "—", yos: 2, approved: true },
  { id: "E-10804", en: "Omar Nasser", ar: "عمر ناصر", titleEn: "Analyst", titleAr: "محلل", grade: "2.2", mgrEn: "Noura Al Ali", mgrAr: "نورة العلي", unit: "insight", jd: "approved", ver: "v1.0", yos: 3, approved: true },
];
