import { FA, AR, SUP, SUB, toFa, nd } from "./data/constants.js";
import { MOLAR } from "./data/molar.js";
import { ELEMENTS } from "./data/elements.js";
import { CATS, ANS, POLY } from "./data/ions.js";
import { NM, PREC, COLORS } from "./data/precipitates.js";
import { createElementPicker } from "./element-picker.js";
import "./element-picker.css";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const MANUAL_ELEMENTS_KEY = "elementQuizManualSelection";
const MANUAL_ELEMENTS_VERSION_KEY = "elementQuizManualSelectionVersion";

const getSavedManualElements = () => {
  try {
    const saved = localStorage.getItem(MANUAL_ELEMENTS_KEY);
    const version = localStorage.getItem(MANUAL_ELEMENTS_VERSION_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const valid = new Set(parsed.filter(z => ELEMENTS.some(e => e.z === z)));
        if (version !== "2") {
          ELEMENTS.filter(e => e.z > 36).forEach(e => valid.add(e.z));
          localStorage.setItem(MANUAL_ELEMENTS_KEY, JSON.stringify([...valid]));
          localStorage.setItem(MANUAL_ELEMENTS_VERSION_KEY, "2");
        }
        return [...valid];
      }
    }
    localStorage.setItem(MANUAL_ELEMENTS_VERSION_KEY, "2");
  } catch (e) {}
  return ELEMENTS.map(e => e.z);
};

const elementCategoryOptions = $("#elementCats");
const manualElementsOption = document.createElement("label");
manualElementsOption.className = "chip";
manualElementsOption.innerHTML = '<input type="checkbox" value="manualElements"><span>انتخاب دستی عناصر</span>';
elementCategoryOptions.append(manualElementsOption);

const elementPicker = createElementPicker({
  anchor: elementCategoryOptions,
  elements: ELEMENTS,
  initialSelected: getSavedManualElements(),
  onChange: selected => {
    try { localStorage.setItem("elementQuizManualSelection", JSON.stringify(selected)); } catch (e) {}
  }
});

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
const pick = (arr, f, c) => arr.find(x => x.f === f && x.c === c);

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
  if (t === "symbolFromNumber") return {
    badge: "عناصر جدول",
    prompt: `نماد عنصر با عدد اتمی<div class="big">${toFa(e.z)}</div>چیست؟`,
    fields: [FD("s", "نماد", "مثلاً Na", "ltr")],
    check: v => ({ s: chkF(v.s, [e.s]) }),
    answer: e.s
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
    if (c.first36) ELEMENTS.filter(e => e.z <= 36).forEach(e => selected.add(e.z));
    for (const group of [1, 2, 13, 14, 15, 16, 17, 18]) {
      if (c["g" + group]) ELEMENTS.filter(e => e.groups.includes(group)).forEach(e => selected.add(e.z));
    }
    if (c.tm4) ELEMENTS.filter(e => e.transition4).forEach(e => selected.add(e.z));
    if (c.manualElements && Array.isArray(c.selectedElements)) {
      c.selectedElements.forEach(z => selected.add(z));
    }
    const types = [];
    if (c.nameFromSymbol) types.push("nameFromSymbol");
    if (c.numberFromSymbol) types.push("numberFromSymbol");
    if (c.symbolFromNumber) types.push("symbolFromNumber");
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
    const a = [];
    if (c.ions) a.push(...buildBagFor("quiz", { cat: true, an: true, poly: true }));
    if (c.precip) a.push(...buildBagFor("precip", {}));
    if (c.molar) a.push(...buildBagFor("molar", { nameToMass: true, formulaToMass: true }));
    if (c.comp) a.push(...buildBagFor("comp", { g: true, tm: true, nh4: true, mono: true, nm: true, poly: true }));
    if (c.elements) a.push(...buildBagFor("elements", {
      manualElements: true,
      nameFromSymbol: true,
      numberFromSymbol: true,
      symbolFromNumber: true,
      nameAndSymbolFromNumber: true,
      selectedElements: elementPicker.getSelected()
    }));
    return shuffle(a);
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
    localStorage.setItem("ionquiz", JSON.stringify($$(".home-grid .card:not(.mixed-card) .chip input").map(i => i.checked)));
  } catch (e) {}
};
const loadCfg = () => {
  try {
    const a = JSON.parse(localStorage.getItem("ionquiz"));
    const ins = $$(".home-grid .card:not(.mixed-card) .chip input");
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
  const selectedElements = elementPicker.getSelected();
  const needsManualSelection = categories.manualElements;
  if (!anyOn(categories) || !anyOn(types) || (needsManualSelection && !selectedElements.length)) {
    flash(!anyOn(categories) ? $("#elementCats") : !anyOn(types) ? $("#elementTypes") : $(".element-picker-launcher"));
    return;
  }
  saveCfg();
  start("elements", Object.assign({}, categories, types, { selectedElements }));
});

$("#startMixed").addEventListener("click", () => {
  const cfg = readChips("mixedOptions");
  if (!anyOn(cfg)) { flash($("#mixedOptions")); return; }
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

