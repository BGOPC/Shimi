// Shared character maps and digit normalization helpers.
export const FA = "۰۱۲۳۴۵۶۷۸۹";
export const AR = "٠١٢٣٤٥٦٧٨٩";
export const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const SUB = "₀₁₂₃₄₅₆₇₈₉";

export const toFa = n => String(n).replace(/\d/g, d => FA[+d]);
export const nd = s => String(s).replace(/[۰-۹]/g, d => FA.indexOf(d)).replace(/[٠-٩]/g, d => AR.indexOf(d));
