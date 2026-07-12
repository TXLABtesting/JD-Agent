/**
 * Data layer barrel. Splits the seeded demo data into master data, official
 * references, mock employees and mock positions. `THEMES` (UI palettes) is
 * re-exported from ../theme for backward compatibility with existing imports.
 */
export * from "./masterData";
export * from "./officialReferences";
export * from "./mockEmployees";
export * from "./mockPositions";
export { THEMES } from "../theme";
export type { Bi } from "../types";
