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
const fF = ph => FD("f", "فرمول", ph || "مثلاً Ca3(PO4)2", "ltr");
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

const mkQ = d => d.k === "ion" ? ionQ(d.i, d.d) : d.k === "prec" ? precQ(d.p, d.t) : compQ(d.ca, d.an, d.d);

const S = { mode: "quiz", bag: [], last: null, right: 0, total: 0, streak: 0, best: 0, missed: [], cur: null, locked: false, cfg: {} };

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const buildBag = () => {
  const a = [], c = S.cfg;
  if (S.mode === "quiz") {
    const ions = [];
    if (c.cat) ions.push(...CATS);
    if (c.an) ions.push(...ANS);
    if (c.poly) ions.push(...POLY);
    ions.forEach(i => ["n2f", "f2n"].forEach(d => a.push({ k: "ion", i, d })));
    if (c.prec) PREC.forEach(p => {
      ["p1", "p2", "p3"].forEach(t => a.push({ k: "prec", p, t }));
      if (!p.fe) a.push({ k: "prec", p, t: "p4" });
    });
  } else {
    const cs = [];
    if (c.g) cs.push(...CATS.filter(x => !x.tm && x.f !== "H"));
    if (c.tm) cs.push(...CATS.filter(x => x.tm));
    if (c.nh4) cs.push(pick(POLY, "NH4", 1));
    const as = [];
    if (c.mono) as.push(...ANS);
    if (c.poly) as.push(...POLY.filter(x => x.c < 0));
    cs.forEach(ca => as.forEach(an => ["n2f", "f2n"].forEach(d => a.push({ k: "comp", ca, an, d }))));
  }
  return shuffle(a);
};

const show = id => $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));

const PRAISE = ["درسته! ✅", "آفرین! 🎉", "عالی! 👏", "دقیقاً! 💚", "کاملاً درست! ✨", "بی‌نقص! 🔥"];

const renderStats = () => {
  $("#stRight").textContent = toFa(S.right) + " ✔";
  $("#stTotal").textContent = toFa(S.total) + " سؤال";
  $("#stStreak").textContent = "🔥 " + toFa(S.streak);
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
    const idx = Math.max(0, S.bag.length - (4 + rnd(5)));
    S.bag.splice(idx, 0, S.cur.d);
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
  Object.assign(S, { mode, cfg, bag: [], last: null, right: 0, total: 0, streak: 0, best: 0, missed: [], cur: null, locked: false });
  S.bag = buildBag();
  if (!S.bag.length) return;
  renderStats();
  show("quiz");
  nextQ();
};

const finish = () => {
  const t = S.total, r = S.right;
  $("#sumScore").textContent = toFa(r) + " از " + toFa(t);
  $("#sumPct").textContent = t ? toFa(Math.round(100 * r / t)) + "٪" : "—";
  $("#sumBest").textContent = toFa(S.best);
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
    if (Array.isArray(a) && a.length === ins.length) ins.forEach((i, k) => i.checked = !!a[k]);
  } catch (e) {}
};

const flash = el => {
  el.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
};

$("#startQuiz").addEventListener("click", () => {
  const c = readChips("quizChips");
  if (!anyOn(c)) { flash($("#quizChips")); return; }
  saveCfg();
  start("quiz", c);
});

$("#startComp").addEventListener("click", () => {
  const a = readChips("compCat"), b = readChips("compAn");
  if (!anyOn(a) || !anyOn(b)) { flash($(!anyOn(a) ? "#compCat" : "#compAn")); return; }
  saveCfg();
  start("comp", Object.assign({}, a, b));
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
