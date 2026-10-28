// Cations, anions, and polyatomic ions.
import { toFa } from "./constants.js";

export const mk = (kind, f, c, n, extra) => Object.assign({ kind, f, c, n, fa: [f] }, extra || {});
const TM = (f, base, c) => mk("cat", f, c, [base + " " + toFa(c)], { base, tm: true });

export const CATS = [
  mk("cat", "H", 1, ["هیدروژن"]),
  mk("cat", "Li", 1, ["لیتیم"]),
  mk("cat", "Ag", 1, ["نقره"]),
  mk("cat", "Mg", 2, ["منیزیم"]),
  mk("cat", "Ca", 2, ["کلسیم"]),
  mk("cat", "Zn", 2, ["روی", "زینک"]),
  mk("cat", "Cd", 2, ["کادمیم"]),
  mk("cat", "Al", 3, ["آلومینیوم", "الومینیوم"]),
  mk("cat", "Ga", 3, ["گالیم"]),
  mk("cat", "Sc", 3, ["اسکاندیم"]),
  mk("cat", "Sr", 2, ["استرانسیم", "استرونسیم"]),
  TM("Cu", "مس", 1), TM("Cu", "مس", 2),
  TM("Fe", "آهن", 2), TM("Fe", "آهن", 3),
  TM("Cr", "کروم", 2), TM("Cr", "کروم", 3),
  TM("V", "وانادیم", 2), TM("V", "وانادیم", 3),
  TM("Mn", "منگنز", 2), TM("Mn", "منگنز", 3)
];

export const ANS = [
  mk("an", "H", -1, ["هیدرید"]),
  mk("an", "F", -1, ["فلوئورید", "فلورید"]),
  mk("an", "O", -2, ["اکسید"]),
  mk("an", "S", -2, ["سولفید"]),
  mk("an", "N", -3, ["نیترید"]),
  mk("an", "P", -3, ["فسفید"])
];

export const POLY = [
  mk("poly", "OH", -1, ["هیدروکسید"]),
  mk("poly", "HS", -1, ["هیدروژن سولفید"]),
  mk("poly", "CO3", -2, ["کربنات"]),
  mk("poly", "SO4", -2, ["سولفات"]),
  mk("poly", "SO3", -2, ["سولفیت"]),
  mk("poly", "ClO4", -1, ["پرکلرات"]),
  mk("poly", "SiO4", -4, ["سیلیکات"]),
  mk("poly", "NH4", 1, ["آمونیوم", "امونیوم"]),
  mk("poly", "NO3", -1, ["نیترات"]),
  mk("poly", "HCO3", -1, ["هیدروژن کربنات", "بی کربنات"]),
  mk("poly", "CN", -1, ["سیانید"]),
  mk("poly", "CH3COO", -1, ["استات"], { fa: ["CH3COO", "CH3CO2", "C2H3O2"] }),
  mk("poly", "HCOO", -1, ["فرمات"], { fa: ["HCOO", "HCO2"] }),
  mk("poly", "C6H5COO", -1, ["بنزوات"], { fa: ["C6H5COO", "C7H5OO", "C6H5CO2", "C7H5O2"] }),
  mk("poly", "MnO4", -1, ["پرمنگنات", "پرمنگانات"]),
  mk("poly", "Cr2O7", -2, ["دی‌کرومات", "دیکرومات"]),
];
