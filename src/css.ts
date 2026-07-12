import type { CSSProperties } from "react";

const cache = new Map<string, CSSProperties>();

/**
 * Convert a CSS declaration string ("padding:8px;color:red") into a React
 * style object. Lets us port the prototype's inline styles almost verbatim.
 * Custom properties (--x) are preserved as-is; other props are camelCased.
 */
export function css(str: string): CSSProperties {
  const hit = cache.get(str);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of str.split(";")) {
    const i = decl.indexOf(":");
    if (i === -1) continue;
    const rawKey = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!rawKey || val === "") continue;
    const key = rawKey.startsWith("--")
      ? rawKey
      : rawKey.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
    out[key] = val;
  }
  const styleObj = out as CSSProperties;
  cache.set(str, styleObj);
  return styleObj;
}

/** Merge several CSS strings / style objects into one style object. */
export function merge(...parts: (string | CSSProperties | undefined)[]): CSSProperties {
  let acc: CSSProperties = {};
  for (const p of parts) {
    if (!p) continue;
    acc = { ...acc, ...(typeof p === "string" ? css(p) : p) };
  }
  return acc;
}
