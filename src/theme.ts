import type { Theme } from "./types";

/**
 * UI colour palettes for the theme switcher. This is presentation config, not
 * mock domain data, so it lives outside src/data/ (which holds only demo data).
 */
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
