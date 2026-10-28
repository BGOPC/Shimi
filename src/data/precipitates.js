// Precipitation quiz data and accepted color names.
import { mk, CATS, ANS, POLY } from "./ions.js";

const pick = (arr, f, c) => arr.find(x => x.f === f && x.c === c);
const Ag = mk("cat", "Ag", 1, ["نقره"]);
const Ba = mk("cat", "Ba", 2, ["باریم"]);
const Cl = mk("an", "Cl", -1, ["کلرید"]);
export const NM = [Cl, mk("an", "Br", -1, ["برمید"]), mk("an", "I", -1, ["یدید"]), mk("an", "Se", -2, ["سلنید"])];
const PO4 = mk("poly", "PO4", -3, ["فسفات"]);
const OH = pick(POLY, "OH", -1), SO4 = pick(POLY, "SO4", -2), O2 = pick(ANS, "O", -2);
const Mg = pick(CATS, "Mg", 2), Ca = pick(CATS, "Ca", 2), Fe2 = pick(CATS, "Fe", 2), Fe3 = pick(CATS, "Fe", 3);

export const PREC = [
  { f: "AgCl", n: ["نقره کلرید"], col: "سفید", ca: Ag, an: Cl },
  { f: "Ca3(PO4)2", n: ["کلسیم فسفات"], col: "سفید", ca: Ca, an: PO4 },
  { f: "BaSO4", n: ["باریم سولفات"], col: "سفید", ca: Ba, an: SO4 },
  { f: "Mg(OH)2", n: ["منیزیم هیدروکسید"], col: "سفید", ca: Mg, an: OH },
  { f: "Fe(OH)2", n: ["آهن ۲ هیدروکسید"], col: "سبز", ca: Fe2, an: OH, fe: true },
  { f: "FeO", n: ["آهن ۲ اکسید"], col: "سبز", ca: Fe2, an: O2, fe: true },
  { f: "Fe2O3", n: ["آهن ۳ اکسید"], col: "قهوه‌ای", ca: Fe3, an: O2, fe: true },
  { f: "Fe(OH)3", n: ["آهن ۳ هیدروکسید"], col: "آجری", ca: Fe3, an: OH, fe: true }
];

export const COLORS = {
  "سفید": ["سفید"],
  "سبز": ["سبز"],
  "قهوه‌ای": ["قهوه‌ای", "قهوه ای", "قهوهای", "قهوه ای رنگ"],
  "آجری": ["آجری", "قرمز آجری"]
};
