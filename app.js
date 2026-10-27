"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const FA = "۰۱۲۳۴۵۶۷۸۹", AR = "٠١٢٣٤٥٦٧٨٩", SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
const toFa = n => String(n).replace(/\d/g, d => FA[+d]);
const nd = s => String(s).replace(/[۰-۹]/g, d => FA.indexOf(d)).replace(/[٠-٩]/g, d => AR.indexOf(d));

const normName = s => {
  s = nd(s).toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[آأإ]/g, "ا").replace(/ة/g, "ه")
    .replace(/[\s\u200c\u200d\u200e\u200f]/g, "")
    .replace(/iii/g, "3").replace(/ii/g, "2").replace(/i/g, "1")
    .replace(/[()\[\]{}+\-–—_.،,]/g, "");
  return s.replace(/(مس|اهن|کروم|وانادیم|منگنز)(یک|دو|سه)/g, (m, a, b) => a + { "یک": 1, "دو": 2, "سه": 3 }[b]);
};
const nI = s => normName(s).replace(/^یون/, "");

const normF = s => {
  s = nd(s)
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => SUB.indexOf(d))
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, d => SUP.indexOf(d))
    .replace(/⁺/g, "+").replace(/⁻/g, "-").replace(/[−–—]/g, "-")
    .replace(/[\s\u200c\u200d]/g, "")
    .replace(/[（［\[{]/g, "(").replace(/[）］\]}]/g, ")");
  return /^\([^()]*\)$/.test(s) ? s.slice(1, -1) : s;
};

const parseCharge = s => {
  s = nd(s).replace(/[\s\u200c^(){}]/g, "").replace(/[−–—﹣－]/g, "-").replace(/＋/g, "+")
    .replace(/⁺/g, "+").replace(/⁻/g, "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, d => SUP.indexOf(d));
  if (!s) return { why: "empty" };
  let m = s.match(/^([+-])(\d*)$/), sg, n;
  if (m) { sg = m[1]; n = m[2]; }
  else if ((m = s.match(/^(\d*)([+-])$/))) { n = m[1]; sg = m[2]; }
  else return /^\d+$/.test(s) ? { why: "nosign" } : { why: "bad" };
  return { val: (sg === "-" ? -1 : 1) * (n === "" ? 1 : +n) };
};

const fmt = f => f.replace(/\d+/g, "<sub>$&</sub>");
const chStr = c => (Math.abs(c) > 1 ? Math.abs(c) : "") + (c > 0 ? "+" : "−");
const fHtml = f => `<span class="chem">${fmt(f)}</span>`;
const ionHtml = i => `<span class="chem">${fmt(i.f)}<sup>${chStr(i.c)}</sup></span>`;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const rnd = n => Math.floor(Math.random() * n);
const dir = () => Math.random() < 0.6 ? "n2f" : "f2n";


const MOLAR = [
  { name: "اکسیژن", names: ["اکسیژن", "oxygen"], formula: "O", weight: 16 },
  { name: "نیتروژن", names: ["نیتروژن", "nitrogen"], formula: "N", weight: 14 },
  { name: "کربن", names: ["کربن", "carbon"], formula: "C", weight: 12 },
  { name: "هیدروژن", names: ["هیدروژن", "hydrogen"], formula: "H", weight: 1 },
  { name: "کلسیم", names: ["کلسیم", "calcium"], formula: "Ca", weight: 40 },
  { name: "سدیم", names: ["سدیم", "sodium"], formula: "Na", weight: 23 },
  { name: "کربنات", names: ["کربنات", "carbonate"], formula: "CO3", weight: 60 },
  { name: "دی‌اکسید گوگرد", names: ["دی‌اکسید گوگرد", "دی اکسید گوگرد", "sulfur dioxide", "sulphur dioxide"], formula: "SO2", weight: 64 },
  { name: "سولفیت", names: ["سولفیت", "sulfite"], formula: "SO3", weight: 80 },
  { name: "سولفات", names: ["سولفات", "sulfate", "sulphate"], formula: "SO4", weight: 96 },
  { name: "کربنات کلسیم", names: ["کربنات کلسیم", "calcium carbonate"], formula: "CaCO3", weight: 100 },
  { name: "نیترات", names: ["نیترات", "nitrate"], formula: "NO3", weight: 62 },
  { name: "دی‌اکسید کربن", names: ["دی‌اکسید کربن", "carbon dioxide"], formula: "CO2", weight: 44 },
  { name: "پروپان", names: ["پروپان", "propane"], formula: "C3H8", weight: 44 },
  { name: "گلوکز", names: ["گلوکز", "glucose"], formula: "C6H12O6", weight: 180 },
  { name: "هیدروژن کربنات", names: ["هیدروژن کربنات", "بی کربنات", "بی‌کربنات", "Hydrogen Carbonate"], formula: "HCO3", weight: 61 },
  { name: "سدیم بی‌کربنات", names: ["بی‌کربنات سدیم", "sodium bicarbonate", "sodium hydrogen carbonate"], formula: "NaHCO3", weight: 84 },
  { name: "باریم سولفات", names: ["سولفات باریم", "barium sulfate", "barium sulphate"], formula: "BaSO4", weight: 233 },
  { name: "آهن(III) اکسید", names: ["اکسید آهن", "iron(III) oxide", "ferric oxide"], formula: "Fe2O3", weight: 160 },
  { name: "آهن", names: ["آهن", "iron"], formula: "Fe", weight: 56 },
  { name: "آهن(II) اکسید", names: ["اکسید آهن(II)", "iron(II) oxide", "ferrous oxide"], formula: "FeO", weight: 62 },
  { name: "پتاسیم کلرات", names: ["کلرات پتاسیم", "potassium chlorate"], formula: "KClO3", weight: 122.5 },
  { name: "پتاسیم نیترات", names: ["نیترات پتاسیم", "potassium nitrate"], formula: "KNO3", weight: 101 },
  { name: "آب", names: ["آب", "Water"], formula: "H20", weight: 18 }
];

const ELEMENTS = [
  { z: 1, s: "H", n: ["هیدروژن", "hydrogen"], groups: [1] },
  { z: 2, s: "He", n: ["هلیم", "هلیوم", "helium"], groups: [18] },
  { z: 3, s: "Li", n: ["لیتیم", "لیتیوم", "lithium"], groups: [1] },
  { z: 4, s: "Be", n: ["بریلیم", "beryllium"], groups: [2] },
  { z: 5, s: "B", n: ["بور", "boron"], groups: [13] },
  { z: 6, s: "C", n: ["کربن", "carbon"], groups: [14] },
  { z: 7, s: "N", n: ["نیتروژن", "nitrogen"], groups: [15] },
  { z: 8, s: "O", n: ["اکسیژن", "oxygen"], groups: [16] },
  { z: 9, s: "F", n: ["فلوئور", "فلور", "fluorine"], groups: [17] },
  { z: 10, s: "Ne", n: ["نئون", "neon"], groups: [18] },
  { z: 11, s: "Na", n: ["سدیم", "sodium"], groups: [1] },
  { z: 12, s: "Mg", n: ["منیزیم", "magnesium"], groups: [2] },
  { z: 13, s: "Al", n: ["آلومینیوم", "الومینیوم", "aluminum", "aluminium"], groups: [13] },
  { z: 14, s: "Si", n: ["سیلیسیم", "سیلیکون", "silicon"], groups: [14] },
  { z: 15, s: "P", n: ["فسفر", "phosphorus"], groups: [15] },
  { z: 16, s: "S", n: ["گوگرد", "sulfur", "sulphur"], groups: [16] },
  { z: 17, s: "Cl", n: ["کلر", "chlorine"], groups: [17] },
  { z: 18, s: "Ar", n: ["آرگون", "argon"], groups: [18] },
  { z: 19, s: "K", n: ["پتاسیم", "potassium"], groups: [1] },
  { z: 20, s: "Ca", n: ["کلسیم", "calcium"], groups: [2] },
  { z: 21, s: "Sc", n: ["اسکاندیم", "scandium"], groups: [3], transition4: true },
  { z: 22, s: "Ti", n: ["تیتانیم", "تیتانیوم", "titanium"], groups: [4], transition4: true },
  { z: 23, s: "V", n: ["وانادیم", "وانادیوم", "vanadium"], groups: [5], transition4: true },
  { z: 24, s: "Cr", n: ["کروم", "chromium"], groups: [6], transition4: true },
  { z: 25, s: "Mn", n: ["منگنز", "manganese"], groups: [7], transition4: true },
  { z: 26, s: "Fe", n: ["آهن", "iron"], groups: [8], transition4: true },
  { z: 27, s: "Co", n: ["کبالت", "cobalt"], groups: [9], transition4: true },
  { z: 28, s: "Ni", n: ["نیکل", "nickel"], groups: [10], transition4: true },
  { z: 29, s: "Cu", n: ["مس", "copper"], groups: [11], transition4: true },
  { z: 30, s: "Zn", n: ["روی", "زینک", "zinc"], groups: [12], transition4: true },
  { z: 31, s: "Ga", n: ["گالیم", "gallium"], groups: [13] },
  { z: 32, s: "Ge", n: ["ژرمانیم", "germanium"], groups: [14] },
  { z: 33, s: "As", n: ["آرسنیک", "arsenic"], groups: [15] },
  { z: 34, s: "Se", n: ["سلنیم", "سلنیوم", "selenium"], groups: [16] },
  { z: 35, s: "Br", n: ["برم", "bromine"], groups: [17] },
  { z: 36, s: "Kr", n: ["کریپتون", "krypton"], groups: [18] }
];

const asciiDigits = s => String(s)
  .replace(/[۰-۹]/g, d => String(FA.indexOf(d)))
  .replace(/[٠-٩]/g, d => String(AR.indexOf(d)));
const chkNumber = (inp, expected, label) => {
  const x = asciiDigits(inp).trim();
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (!/^\d+(?:\.\d+)?$/.test(x)) return { ok: false, msg: "عدد نامعتبر است" };
  if (Number(x) === expected) return { ok: true };
  return { ok: false, msg: label === "weight" ? "جرم مولی اشتباه است" : "عدد اتمی اشتباه است" };
};

const mk = (kind, f, c, n, extra) => Object.assign({ kind, f, c, n, fa: [f] }, extra || {});
const TM = (f, base, c) => mk("cat", f, c, [base + " " + toFa(c)], { base, tm: true });

const CATS = [
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

const ANS = [
  mk("an", "H", -1, ["هیدرید"]),
  mk("an", "F", -1, ["فلوئورید", "فلورید"]),
  mk("an", "O", -2, ["اکسید"]),
  mk("an", "S", -2, ["سولفید"]),
  mk("an", "N", -3, ["نیترید"]),
  mk("an", "P", -3, ["فسفید"])
];

const POLY = [
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

const pick = (arr, f, c) => arr.find(x => x.f === f && x.c === c);
const Ag = mk("cat", "Ag", 1, ["نقره"]);
const Ba = mk("cat", "Ba", 2, ["باریم"]);
const Cl = mk("an", "Cl", -1, ["کلرید"]);
const NM = [Cl, mk("an", "Br", -1, ["برمید"]), mk("an", "I", -1, ["یدید"]), mk("an", "Se", -2, ["سلنید"])];
const PO4 = mk("poly", "PO4", -3, ["فسفات"]);
const OH = pick(POLY, "OH", -1), SO4 = pick(POLY, "SO4", -2), O2 = pick(ANS, "O", -2);
const Mg = pick(CATS, "Mg", 2), Ca = pick(CATS, "Ca", 2), Fe2 = pick(CATS, "Fe", 2), Fe3 = pick(CATS, "Fe", 3);

const PREC = [
  { f: "AgCl", n: ["نقره کلرید"], col: "سفید", ca: Ag, an: Cl },
  { f: "Ca3(PO4)2", n: ["کلسیم فسفات"], col: "سفید", ca: Ca, an: PO4 },
  { f: "BaSO4", n: ["باریم سولفات"], col: "سفید", ca: Ba, an: SO4 },
  { f: "Mg(OH)2", n: ["منیزیم هیدروکسید"], col: "سفید", ca: Mg, an: OH },
  { f: "Fe(OH)2", n: ["آهن ۲ هیدروکسید"], col: "سبز", ca: Fe2, an: OH, fe: true },
  { f: "FeO", n: ["آهن ۲ اکسید"], col: "سبز", ca: Fe2, an: O2, fe: true },
  { f: "Fe2O3", n: ["آهن ۳ اکسید"], col: "قهوه‌ای", ca: Fe3, an: O2, fe: true },
  { f: "Fe(OH)3", n: ["آهن ۳ هیدروکسید"], col: "آجری", ca: Fe3, an: OH, fe: true }
];

const COLORS = {
  "سفید": ["سفید"],
  "سبز": ["سبز"],
  "قهوه‌ای": ["قهوه‌ای", "قهوه ای", "قهوهای", "قهوه ای رنگ"],
  "آجری": ["آجری", "قرمز آجری"]
};

const chkF = (inp, fas) => {
  const x = normF(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (fas.some(a => normF(a) === x)) return { ok: true };
  if (fas.some(a => a.toLowerCase() === x.toLowerCase())) return { ok: false, msg: "حروف بزرگ و کوچک مهم‌اند" };
  return { ok: false, msg: "فرمول اشتباه است" };
};

const chkC = (inp, c) => {
  const r = parseCharge(inp);
  if (r.why === "empty") return { ok: false, msg: "بار را ننوشتی" };
  if (r.why === "nosign") return { ok: false, msg: "علامت بار (+ یا −) را ننوشتی" };
  if (r.why) return { ok: false, msg: "فرمت بار نامعتبر است" };
  if (r.val === c) return { ok: true };
  if (Math.abs(r.val) === Math.abs(c)) return { ok: false, msg: "علامت بار اشتباه است" };
  if (Math.sign(r.val) === Math.sign(c)) return { ok: false, msg: "عدد بار اشتباه است" };
  return { ok: false, msg: "بار اشتباه است" };
};

const chkIon = (inp, it) => {
  const x = nI(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (it.n.some(a => nI(a) === x)) return { ok: true };
  if (it.tm) {
    const b = nI(it.base);
    if (x === b) return { ok: false, msg: "عدد بار فلز را ننوشتی" };
    if (x.startsWith(b) && /^\d+$/.test(x.slice(b.length))) return { ok: false, msg: "عدد بار فلز اشتباه است" };
  }
  return { ok: false, msg: "نام اشتباه است" };
};

const chkNames = (inp, names) => {
  const x = normName(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (names.some(a => normName(a) === x)) return { ok: true };
  return { ok: false, msg: "نام اشتباه است" };
};

const chkColor = (inp, col) => {
  const x = normName(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (COLORS[col].some(a => normName(a) === x)) return { ok: true };
  return { ok: false, msg: "رنگ اشتباه است" };
};

const chkPartner = (inp, an) => {
  const x = nI(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (an.n.some(a => nI(a) === x)) return { ok: true };
  const fx = normF(inp).replace(/\^/g, "");
  const ab = Math.abs(an.c), sg = an.c < 0 ? "-" : "+";
  const acc = [];
  an.fa.forEach(f => acc.push(f, f + sg, f + ab + sg, f + sg + ab));
  if (acc.includes(fx)) return { ok: true };
  return { ok: false, msg: "یون اشتباه است" };
};

const buildC = (ca, an) => {
  const a = ca.c, b = -an.c, g = gcd(a, b), nc = b / g, na = a / g;
  const part = (x, n) => x.kind === "poly" && n > 1 ? x.fa.map(f => "(" + f + ")" + n) : x.fa.map(f => f + (n > 1 ? n : ""));
  const forms = [];
  part(ca, nc).forEach(c => part(an, na).forEach(d => forms.push(c + d)));
  return { nc, na, forms };
};

const eat = (s, cores, poly) => {
  for (const core of cores) {
    if (poly && s.startsWith("(" + core + ")")) {
      const after = s.slice(core.length + 2), m = after.match(/^\d*/)[0];
      return { rest: after.slice(m.length), count: m ? +m : 1, paren: true };
    }
    if (s.startsWith(core)) {
      const after = s.slice(core.length), m = after.match(/^\d*/)[0];
      return { rest: after.slice(m.length), count: m ? +m : 1, paren: false };
    }
  }
  return null;
};

const diagF = (x, B, ca, an) => {
  const msgs = [];
  const c = eat(x, ca.fa, ca.kind === "poly");
  if (!c) return ["فرمول کاتیون (" + ca.f + ") اشتباه است یا اول فرمول نیامده"];
  const a = eat(c.rest, an.fa, an.kind === "poly");
  if (!a) return ["فرمول آنیون (" + an.f + ") اشتباه است"];
  if (a.rest) msgs.push("چیز اضافه‌ای نوشتی");
  if (c.count !== B.nc) msgs.push("تعداد " + ca.f + " باید " + B.nc + " باشد، نه " + c.count);
  if (a.count !== B.na) msgs.push("تعداد " + an.f + " باید " + B.na + " باشد، نه " + a.count);
  if (ca.kind === "poly") {
    if (B.nc > 1 && !c.paren) msgs.push("یون چنداتمی با ضریب بیشتر از ۱ باید داخل پرانتز باشد");
    if (B.nc === 1 && c.paren) msgs.push("با ضریب ۱ پرانتز لازم نیست");
  }
  if (an.kind === "poly") {
    if (B.na > 1 && !a.paren) msgs.push("یون چنداتمی با ضریب بیشتر از ۱ باید داخل پرانتز باشد");
    if (B.na === 1 && a.paren) msgs.push("با ضریب ۱ پرانتز لازم نیست");
  }
  return msgs;
};

const chkCompF = (inp, B, ca, an) => {
  const x = normF(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  if (B.forms.some(f => normF(f) === x)) return { ok: true };
  return { ok: false, msg: diagF(x, B, ca, an).join(" • ") || "فرمول اشتباه است" };
};

const chkCompN = (inp, ca, an) => {
  const x = normName(inp);
  if (!x) return { ok: false, msg: "چیزی ننوشتی" };
  const cn = ca.n.map(normName), am = an.n.map(normName), exp = [];
  cn.forEach(c => am.forEach(a => exp.push(c + a)));
  if (exp.includes(x)) return { ok: true };
  const msgs = [], cOk = cn.some(c => x.startsWith(c)), aOk = am.some(a => x.endsWith(a));
  if (!cOk) {
    if (ca.tm && x.startsWith(normName(ca.base))) {
      const rest = x.slice(normName(ca.base).length);
      msgs.push(/^\d/.test(rest) ? "عدد بار فلز اشتباه است" : "عدد بار فلز را ننوشتی");
    } else msgs.push("نام کاتیون اشتباه است");
  }
  if (!aOk) msgs.push("نام آنیون اشتباه است");
  if (cOk && aOk) msgs.push("نام کامل درست نیست (اول کاتیون، بعد آنیون)");
  return { ok: false, msg: msgs.join(" • ") };
};

const FD = (id, label, ph, dir) => ({ id, label, ph, dir });
const fF = ph => FD("f", "فرمول", ph || "مثلاً FeO", "ltr");
const fC = () => Object.assign(FD("c", "بار", "مثلاً 2+ یا 1−", "ltr"), { charge: true });
const fN = l => FD("n", l || "نام", "به فارسی", "rtl");
const fK = () => FD("k", "رنگ", "مثلاً سفید", "rtl");

const ionQ = (it, d) => {
  const nm = "یون " + it.n[0];
  const badge = it.kind === "cat" ? "یون تک‌اتمی مثبت" : it.kind === "an" ? "یون تک‌اتمی منفی" : "یون چنداتمی";
  if (d === "n2f") {
    const extra = it.fa.length > 1 ? ` <small>(یا ${it.fa.slice(1).map(fHtml).join("، ")})</small>` : "";
    return {
      badge, prompt: `فرمول و بار <b>${nm}</b> را بنویس`,
      fields: [fF("مثلاً Fe"), fC()],
      check: v => ({ f: chkF(v.f, it.fa), c: chkC(v.c, it.c) }),
      answer: ionHtml(it) + extra
    };
  }
  return {
    badge, prompt: `نام این یون چیست؟<div class="big">${ionHtml(it)}</div>`,
    fields: [fN("نام یون")],
    check: v => ({ n: chkIon(v.n, it) }),
    answer: nm
  };
};

const precQ = (p, t) => {
  const fh = fHtml(p.f), badge = "رسوب";
  const ans = `${fh} — ${p.n[0]} — ${p.col}`;
  if (t === "p1") return {
    badge, prompt: `نام و رنگ این رسوب را بنویس<div class="big">${fh}</div>`,
    fields: [fN("نام رسوب"), fK()],
    check: v => ({ n: chkNames(v.n, p.n), k: chkColor(v.k, p.col) }), answer: ans
  };
  if (t === "p2") return {
    badge, prompt: `فرمول و رنگ رسوب <b>${p.n[0]}</b> را بنویس`,
    fields: [fF(), fK()],
    check: v => ({ f: chkF(v.f, [p.f]), k: chkColor(v.k, p.col) }), answer: ans
  };
  if (t === "p3") return {
    badge, prompt: `رنگ رسوب <b>${p.n[0]}</b> چیست؟<div class="big">${fh}</div>`,
    fields: [fK()],
    check: v => ({ k: chkColor(v.k, p.col) }), answer: ans
  };
  return {
    badge, prompt: `<div class="big">${ionHtml(p.ca)}</div>با چه یونی رسوب می‌دهد؟`,
    fields: [FD("a", "یون (نام یا فرمول)", "مثلاً کلرید یا Cl", "rtl")],
    check: v => ({ a: chkPartner(v.a, p.an) }),
    answer: `${p.an.n[0]} (${ionHtml(p.an)}) ← ${fh}، ${p.n[0]}، ${p.col}`
  };
};

const compQ = (ca, an, d) => {
  const B = buildC(ca, an), F = B.forms[0], nameFull = ca.n[0] + " " + an.n[0];
  const note = `${ionHtml(ca)} و ${ionHtml(an)}: ${B.nc}×(+${ca.c}) + ${B.na}×(−${-an.c}) = 0 ← ${fHtml(F)}`;
  const badge = "ساخت ترکیب";
  if (d === "n2f") return {
    badge, prompt: `فرمول ترکیب <b>${nameFull}</b> را بنویس`,
    fields: [fF("مثلاً Fe(HCO3)2")],
    check: v => ({ f: chkCompF(v.f, B, ca, an) }),
    answer: `${fHtml(F)}`, note
  };
  return {
    badge, prompt: `نام این ترکیب چیست؟<div class="big">${fHtml(F)}</div>`,
    fields: [fN("نام ترکیب")],
    check: v => ({ n: chkCompN(v.n, ca, an) }),
    answer: nameFull, note
  };
};

const molarQ = (item, type) => {
  if (type === "formulaToMass") return {
    badge: "",
    prompt: `جرم مولی این فرمول چقدر است؟<div class="big">${fHtml(item.formula)}</div>`,
    fields: [FD("w", "جرم مولی", "مثلاً 16", "ltr")],
    check: v => ({ w: chkNumber(v.w, item.weight, "weight") }),
    answer: String(item.weight)
  };
  return {
    badge: "",
    prompt: `جرم مولی <b>${item.name}</b> چقدر است؟`,
    fields: [FD("w", "جرم مولی", "مثلاً 16", "ltr")],
    check: v => ({ w: chkNumber(v.w, item.weight, "weight") }),
    answer: String(item.weight)
  };
};

const elementQ = (e, t) => {
  if (t === "nameFromSymbol") return {
    badge: "عناصر جدول",
    prompt: `نام این عنصر چیست؟<div class="big"><span class="chem">${e.s}</span></div>`,
    fields: [fN("نام عنصر")],
    check: v => ({ n: chkNames(v.n, e.n) }),
    answer: e.n[0]
  };
  if (t === "numberFromSymbol") return {
    badge: "عناصر جدول",
    prompt: `عدد اتمی این عنصر چند است؟<div class="big"><span class="chem">${e.s}</span></div>`,
    fields: [FD("z", "عدد اتمی", "مثلاً 1", "ltr")],
    check: v => ({ z: chkNumber(v.z, e.z, "atomic") }),
    answer: String(e.z)
  };
  return {
    badge: "عناصر جدول",
    prompt: `نام و نماد عنصر با عدد اتمی <div class="big">${toFa(e.z)}</div> چیست؟`,
    fields: [fN("نام عنصر"), FD("s", "نماد", "مثلاً H", "ltr")],
    check: v => ({ n: chkNames(v.n, e.n), s: chkF(v.s, [e.s]) }),
    answer: `${e.n[0]} (${e.s})`
  };
};

const mkQ = d => d.k === "ion" ? ionQ(d.i, d.d) : d.k === "prec" ? precQ(d.p, d.t) : d.k === "comp" ? compQ(d.ca, d.an, d.d) : d.k === "molar" ? molarQ(d.item, d.t) : elementQ(d.e, d.t);

const S = { mode: "quiz", bag: [], last: null, right: 0, total: 0, streak: 0, best: 0, missed: [], cur: null, locked: false, cfg: {}, timerEnabled: true, timerStartedAt: null, elapsedMs: 0, timerInterval: null };

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const buildBagFor = (mode, c) => {
  const a = [];
  if (mode === "quiz") {
    const ions = [];
    if (c.cat) ions.push(...CATS);
    if (c.an) ions.push(...ANS);
    if (c.poly) ions.push(...POLY);
    ions.forEach(i => a.push({ k: "ion", i, d: dir() }));
    if (c.prec) PREC.forEach(p => {
      ["p1", "p2", "p3"].forEach(t => a.push({ k: "prec", p, t }));
      if (!p.fe) a.push({ k: "prec", p, t: "p4" });
    });
  } else if (mode === "precip") {
    PREC.forEach(p => {
      ["p1", "p2", "p3"].forEach(t => a.push({ k: "prec", p, t }));
      if (!p.fe) a.push({ k: "prec", p, t: "p4" });
    });
  } else if (mode === "comp") {
    const cs = [];
    if (c.g) cs.push(...CATS.filter(x => !x.tm && x.f !== "H"));
    if (c.tm) cs.push(...CATS.filter(x => x.tm));
    if (c.nh4) cs.push(pick(POLY, "NH4", 1));
    const as = [];
    if (c.mono) as.push(...ANS);
    if (c.nm) as.push(...NM);
    if (c.poly) as.push(...POLY.filter(x => x.c < 0));
    cs.forEach(ca => as.forEach(an => a.push({ k: "comp", ca, an, d: dir() })));
  } else if (mode === "molar") {
    const types = [];
    if (c.nameToMass) types.push("nameToMass");
    if (c.formulaToMass) types.push("formulaToMass");
    MOLAR.forEach(item => types.forEach(t => a.push({ k: "molar", item, t })));
  } else if (mode === "elements") {
    const selected = new Set();
    if (c.first36) ELEMENTS.forEach(e => selected.add(e.z));
    for (const group of [1, 2, 13, 14, 15, 16, 17, 18]) {
      if (c["g" + group]) ELEMENTS.filter(e => e.groups.includes(group)).forEach(e => selected.add(e.z));
    }
    if (c.tm4) ELEMENTS.filter(e => e.transition4).forEach(e => selected.add(e.z));
    const types = [];
    if (c.nameFromSymbol) types.push("nameFromSymbol");
    if (c.numberFromSymbol) types.push("numberFromSymbol");
    if (c.nameAndSymbolFromNumber) types.push("nameAndSymbolFromNumber");
    ELEMENTS.filter(e => selected.has(e.z)).forEach(e => {
      types.forEach(t => a.push({ k: "element", e, t }));
    });
  }
  return a;
};

const buildBag = () => {
  if (S.mode === "mixed") {
    const c = S.cfg;
    return shuffle([
      ...buildBagFor("quiz", c.quiz),
      ...buildBagFor("comp", c.comp),
      ...buildBagFor("molar", c.molar),
      ...buildBagFor("elements", c.elements)
    ]);
  }
  return shuffle(buildBagFor(S.mode, S.cfg));
};

const show = id => $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));

const PRAISE = ["درسته! ✅", "آفرین! 🎉", "عالی! 👏", "دقیقاً! 💚", "کاملاً درست! ✨", "بی‌نقص! 🔥"];

const renderStats = () => {
  $("#stRight").textContent = toFa(S.right) + " ✔";
  $("#stTotal").textContent = toFa(S.total) + " سؤال";
  $("#stStreak").textContent = "🔥 " + toFa(S.streak);
};

const formatDuration = ms => {
  const seconds = Math.floor(ms / 1000);
  const pad = n => toFa(n).padStart(2, "۰");
  return pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
};

const updateTimer = () => {
  if (!S.timerEnabled || S.timerStartedAt === null) return;
  S.elapsedMs = Date.now() - S.timerStartedAt;
  $("#stTimer").textContent = "⏱ " + formatDuration(S.elapsedMs);
};

const nextQ = () => {
  if (!S.bag.length) {
    S.bag = buildBag();
    if (S.bag.length > 1 && S.last && S.bag[S.bag.length - 1] === S.last) {
      const j = rnd(S.bag.length - 1);
      [S.bag[j], S.bag[S.bag.length - 1]] = [S.bag[S.bag.length - 1], S.bag[j]];
    }
  }
  const d = S.bag.pop();
  S.last = d;
  const q = mkQ(d);
  S.cur = { d, q };
  S.locked = false;
  $("#qBadge").textContent = q.badge;
  $("#qBadge").classList.toggle("hidden", !q.badge);
  $("#qPrompt").innerHTML = q.prompt;
  $("#fields").innerHTML = q.fields.map(f =>
    `<div class="fld" id="fld_${f.id}"><label for="in_${f.id}"><span>${f.label}</span></label>` +
    `<input class="in ${f.dir}" id="in_${f.id}" dir="${f.dir}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${f.ph}">` +
    (f.charge ? `<div class="charge-options" role="group" aria-label="انتخاب بار">${["-1", "-2", "-3", "+1", "+2", "+3"].map(c => `<button class="charge-option" type="button" data-charge="${c}" data-charge-for="${f.id}" aria-pressed="false">${c}</button>`).join("")}</div>` : "") +
    `<small class="fb" id="fb_${f.id}"></small></div>`).join("");
  $$("#fields .charge-option").forEach(btn => btn.addEventListener("click", () => {
    if (S.locked) return;
    const input = $("#in_" + btn.dataset.chargeFor);
    if (!input || input.readOnly) return;
    input.value = btn.dataset.charge;
    $$("#fields .charge-option").forEach(option => option.setAttribute("aria-pressed", String(option === btn)));
  }));
  const chargeInput = $("#fields input#in_c");
  if (chargeInput) chargeInput.addEventListener("input", () => {
    $$("#fields .charge-option").forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.charge === chargeInput.value)));
  });
  $("#result").className = "result hidden";
  $("#result").innerHTML = "";
  $("#actBtn").textContent = "بررسی";
  const first = $("#fields input");
  if (first) first.focus();
};

const act = () => {
  if (!S.cur) return;
  if (S.locked) { nextQ(); return; }
  const q = S.cur.q, v = {};
  q.fields.forEach(f => v[f.id] = $("#in_" + f.id).value);
  const res = q.check(v);
  let ok = true;
  q.fields.forEach(f => {
    const r = res[f.id];
    ok = ok && r.ok;
    $("#fld_" + f.id).classList.add(r.ok ? "ok" : "bad");
    $("#fb_" + f.id).textContent = r.ok ? "✓ درست" : "✗ " + r.msg;
    $("#in_" + f.id).readOnly = true;
  });
  $$("#fields .charge-option").forEach(btn => btn.disabled = true);
  S.locked = true;
  S.total++;
  if (ok) {
    S.right++; S.streak++; S.best = Math.max(S.best, S.streak);
  } else {
    S.streak = 0;
    if (!S.missed.some(m => m.a === q.answer)) S.missed.push({ p: q.prompt, a: q.answer });
    if (S.mode !== "elements") {
      const idx = Math.max(0, S.bag.length - (4 + rnd(5)));
      S.bag.splice(idx, 0, S.cur.d);
    }
  }
  const box = $("#result");
  box.className = "result " + (ok ? "ok" : "bad");
  box.innerHTML = ok
    ? `<div class="rt">${PRAISE[rnd(PRAISE.length)]}</div>`
    : `<div class="rt">غلطه ❌</div><div>پاسخ درست: ${q.answer}</div>`;
  if (q.note) box.innerHTML += `<div class="note">${q.note}</div>`;
  $("#actBtn").textContent = "بعدی";
  renderStats();
};

const start = (mode, cfg) => {
  if (S.timerInterval) clearInterval(S.timerInterval);
  const timerEnabled = $("#timerEnabled").checked;
  Object.assign(S, { mode, cfg, bag: [], last: null, right: 0, total: 0, streak: 0, best: 0, missed: [], cur: null, locked: false, timerEnabled, timerStartedAt: null, elapsedMs: 0, timerInterval: null });
  S.timerStartedAt = S.timerEnabled ? Date.now() : null;
  S.bag = buildBag();
  if (!S.bag.length) {
    S.timerStartedAt = null;
    return;
  }
  $("#stTimer").classList.toggle("hidden", !S.timerEnabled);
  if (S.timerEnabled) {
    updateTimer();
    S.timerInterval = setInterval(updateTimer, 1000);
  }
  renderStats();
  show("quiz");
  nextQ();
};

const finish = () => {
  if (S.timerInterval) clearInterval(S.timerInterval);
  S.timerInterval = null;
  if (S.timerEnabled && S.timerStartedAt !== null) S.elapsedMs = Date.now() - S.timerStartedAt;
  const t = S.total, r = S.right;
  $("#sumScore").textContent = toFa(r) + " از " + toFa(t);
  $("#sumPct").textContent = t ? toFa(Math.round(100 * r / t)) + "٪" : "—";
  $("#sumBest").textContent = toFa(S.best);
  $("#sumTime").textContent = S.timerEnabled ? formatDuration(S.elapsedMs) : "خاموش";
  $("#sumMissed").innerHTML = S.missed.length
    ? S.missed.map(x => `<li><div class="mp">${x.p}</div><div class="ma">${x.a}</div></li>`).join("")
    : `<li class="none">هیچ اشتباهی نداشتی 🎉</li>`;
  show("summary");
};

const readChips = id => { const o = {}; $$(`#${id} input`).forEach(i => o[i.value] = i.checked); return o; };
const anyOn = o => Object.values(o).some(Boolean);

const saveCfg = () => {
  try {
    localStorage.setItem("ionquiz", JSON.stringify($$(".chip input").map(i => i.checked)));
  } catch (e) {}
};
const loadCfg = () => {
  try {
    const a = JSON.parse(localStorage.getItem("ionquiz"));
    const ins = $$(".chip input");
    if (Array.isArray(a) && a.length === ins.length) {
      ins.forEach((i, k) => i.checked = !!a[k]);
    } else if (Array.isArray(a) && a.length === ins.length + 1) {
      // Migrate settings saved before the precipitation quiz became a separate section.
      const migrated = a.slice(0, 3).concat(a.slice(4));
      ins.forEach((i, k) => i.checked = !!migrated[k]);
    }
    const timer = localStorage.getItem("ionquizTimer");
    if (timer !== null) $("#timerEnabled").checked = timer === "1";
  } catch (e) {}
};

$("#timerEnabled").addEventListener("change", () => {
  try { localStorage.setItem("ionquizTimer", $("#timerEnabled").checked ? "1" : "0"); } catch (e) {}
});

const flash = el => {
  el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
};

$("#startQuiz").addEventListener("click", () => {
  const c = readChips("quizChips");
  if (!anyOn(c)) { flash($("#quizChips")); return; }
  saveCfg();
  start("quiz", c);
});

$("#startPrecipQuiz").addEventListener("click", () => {
  saveCfg();
  start("precip", {});
});

$("#startComp").addEventListener("click", () => {
  const a = readChips("compCat"), b = readChips("compAn");
  if (!anyOn(a) || !anyOn(b)) { flash($(!anyOn(a) ? "#compCat" : "#compAn")); return; }
  saveCfg();
  start("comp", Object.assign({}, a, b));
});

$("#startMolar").addEventListener("click", () => {
  const types = readChips("molarTypes");
  if (!anyOn(types)) { flash($("#molarTypes")); return; }
  saveCfg();
  start("molar", types);
});

$("#startElements").addEventListener("click", () => {
  const categories = readChips("elementCats"), types = readChips("elementTypes");
  if (!anyOn(categories) || !anyOn(types)) {
    flash($(!anyOn(categories) ? "#elementCats" : "#elementTypes"));
    return;
  }
  saveCfg();
  start("elements", Object.assign({}, categories, types));
});

$("#startMixed").addEventListener("click", () => {
  const cfg = {
    quiz: Object.assign({}, readChips("quizChips"), { prec: true }),
    comp: Object.assign({}, readChips("compCat"), readChips("compAn")),
    molar: readChips("molarTypes"),
    elements: Object.assign({}, readChips("elementCats"), readChips("elementTypes"))
  };
  start("mixed", cfg);
});

$("#actBtn").addEventListener("click", act);
$("#finish").addEventListener("click", finish);
$("#backHome").addEventListener("click", () => show("home"));

document.addEventListener("keydown", e => {
  if (e.key !== "Enter" || !$("#quiz").classList.contains("active")) return;
  if (e.target.closest && e.target.closest(".charge-option")) return;
  e.preventDefault();
  const ins = $$("#fields input"), i = ins.indexOf(document.activeElement);
  if (!S.locked && i >= 0 && i < ins.length - 1) { ins[i + 1].focus(); return; }
  act();
});

loadCfg();
