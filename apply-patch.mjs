import fs from "node:fs";

const read = path => fs.readFileSync(path, "utf8");
const write = (path, value) => fs.writeFileSync(path, value, "utf8");
const replaceOnce = (source, from, to, label) => {
  const index = source.indexOf(from);
  if (index < 0) throw new Error(`Could not find ${label}. No files were written.`);
  if (source.indexOf(from, index + from.length) >= 0) throw new Error(`Found more than one match for ${label}. No files were written.`);
  return source.slice(0, index) + to + source.slice(index + from.length);
};
const replaceSection = (source, start, end, replacement, label) => {
  const from = source.indexOf(start);
  if (from < 0) throw new Error(`Could not find the start of ${label}. No files were written.`);
  const to = source.indexOf(end, from + start.length);
  if (to < 0) throw new Error(`Could not find the end of ${label}. No files were written.`);
  return source.slice(0, from) + replacement + source.slice(to + end.length);
};

const appPath = "src/app.js";
const htmlPath = "index.html";
let app = read(appPath);
let html = read(htmlPath);

if (app.includes('from "./chemistry.js"') || html.includes('id="chemistryGrid"')) {
  throw new Error("Chemistry modules already appear to be installed. No files were written.");
}

app = replaceOnce(app, 'import "./element-picker.css";\n', 'import "./element-picker.css";\nimport { buildChemistryBag, makeChemistryQuestion, mountStructureEditor } from "./chemistry.js";\nimport "./chemistry.css";\n', "the chemistry imports");
app = replaceOnce(app,
  'const mkQ = d => d.k === "ion" ? ionQ(d.i, d.d) : d.k === "prec" ? precQ(d.p, d.t) : d.k === "comp" ? compQ(d.ca, d.an, d.d) : d.k === "molar" ? molarQ(d.item, d.t) : elementQ(d.e, d.t);',
  'const mkQ = d => d.k === "ion" ? ionQ(d.i, d.d) : d.k === "prec" ? precQ(d.p, d.t) : d.k === "comp" ? compQ(d.ca, d.an, d.d) : d.k === "molar" ? molarQ(d.item, d.t) : d.k === "chem" ? makeChemistryQuestion(d) : elementQ(d.e, d.t);',
  "the question factory");
app = replaceOnce(app,
  '  return a;\n};\n\nconst buildBag = () => {',
  '  if (mode === "hydrocarbon" || mode === "functional" || mode === "chemMixed") return buildChemistryBag(mode, c);\n  return a;\n};\n\nconst buildBag = () => {',
  "the chemistry question bag branch");
app = replaceOnce(app,
  '    }));\n    return shuffle(a);\n  }\n  return shuffle(buildBagFor(S.mode, S.cfg));',
  '    }));\n    if (c.hydro) a.push(...buildChemistryBag("hydrocarbon", c.hydroCfg || {}));\n    if (c.functional) a.push(...buildChemistryBag("functional", c.functionalCfg || {}));\n    return shuffle(a);\n  }\n  return shuffle(buildBagFor(S.mode, S.cfg));',
  "the existing mixed quiz integration");

const fieldRenderer = [
  'const renderQuizField = f => {',
  '  if (f.type === "structure") return `<div class="fld chem-structure-field" id="fld_${f.id}"><span>${f.label}</span><div id="chemEditorMount"></div><small class="fb" id="fb_${f.id}"></small></div>`;',
  '  if (f.type === "multi") return `<div class="fld chem-multi-field" id="fld_${f.id}"><span>${f.label}</span><div class="chem-multi-options">${f.options.map(option => `<label class="chem-answer-option"><input type="checkbox" name="in_${f.id}" value="${option.value}"><span>${option.label}</span></label>`).join("")}</div><small class="fb" id="fb_${f.id}"></small></div>`;',
  '  if (f.type === "choice") return `<div class="fld chem-choice-field" id="fld_${f.id}"><span>${f.label}</span><div class="chem-choice-options">${f.options.map(option => `<label class="chem-answer-option"><span><input type="radio" name="in_${f.id}" value="${option.value}">${option.label}</span>${option.html || ""}</label>`).join("")}</div><small class="fb" id="fb_${f.id}"></small></div>`;',
  '  return `<div class="fld" id="fld_${f.id}"><label for="in_${f.id}"><span>${f.label}</span></label><input class="in ${f.dir}" id="in_${f.id}" dir="${f.dir}" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${f.ph}">${f.charge ? `<div class="charge-options" role="group" aria-label="انتخاب بار">${["-1", "-2", "-3", "+1", "+2", "+3"].map(c => `<button class="charge-option" type="button" data-charge="${c}" data-charge-for="${f.id}" aria-pressed="false">${c}</button>`).join("")}</div>` : ""}<small class="fb" id="fb_${f.id}"></small></div>`;',
  '};',
  ''
].join("\n");
app = replaceOnce(app, 'const nextQ = () => {\n', fieldRenderer + 'const nextQ = () => {\n', "the custom quiz field renderer");
app = replaceOnce(app, 'const nextQ = () => {\n', 'const nextQ = () => {\n  if (S.cur?.editor) S.cur.editor.destroy();\n', "the previous structure editor cleanup");
app = replaceSection(app,
  '  $("#fields").innerHTML = q.fields.map(f =>',
  ').join("");',
  '  $("#fields").innerHTML = q.fields.map(renderQuizField).join("");\n  S.cur.editor = q.editor ? mountStructureEditor($("#chemEditorMount")) : null;',
  "the question field markup");
app = replaceOnce(app, '  const first = $("#fields input");\n', '  const first = $("#fields input, #fields textarea");\n', "the initial focus selector");
const valueCollection = [
  '  q.fields.forEach(f => {',
  '    if (f.type === "structure") v[f.id] = S.cur.editor?.getValue();',
  '    else if (f.type === "multi") v[f.id] = [...$$("#fld_" + f.id + " input:checked")].map(input => input.value);',
  '    else if (f.type === "choice") v[f.id] = $("#fld_" + f.id + " input:checked")?.value || "";',
  '    else v[f.id] = $("#in_" + f.id).value;',
  '  });'
].join("\n");
app = replaceOnce(app,
  '  q.fields.forEach(f => v[f.id] = $("#in_" + f.id).value);',
  valueCollection,
  "the answer value collection");
app = replaceOnce(app,
  '    $("#in_" + f.id).readOnly = true;',
  [
    '    if (f.type === "structure") S.cur.editor?.setDisabled(true);',
    '    else if (f.type === "multi" || f.type === "choice") $$("#fld_" + f.id + " input").forEach(input => input.disabled = true);',
    '    else $("#in_" + f.id).readOnly = true;'
  ].join("\n"),
  "the field locking behavior");

const configHelpers = [
  'const readHydroConfig = () => {',
  '  const extra = readChips("hydroExtra");',
  '  return { types: readChips("hydroTypes"), models: readChips("hydroModels"), chains: readChips("hydroChains"), cyclic: !!extra.cyclic };',
  '};',
  'const readFunctionalConfig = () => ({ types: readChips("functionalTypes") });',
  'const CHEM_SETTINGS_KEY = "organicChemistrySettings";',
  'const saveChemSettings = () => { try { const settings = {}; $$("[data-chem-setting]").forEach(input => settings[input.id] = input.checked); localStorage.setItem(CHEM_SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {} };',
  'const loadChemSettings = () => { try { const settings = JSON.parse(localStorage.getItem(CHEM_SETTINGS_KEY) || "{}"); $$("[data-chem-setting]").forEach(input => { if (Object.prototype.hasOwnProperty.call(settings, input.id)) input.checked = !!settings[input.id]; }); } catch (e) {} };',
  'loadChemSettings();',
  '$$("[data-chem-setting]").forEach(input => input.addEventListener("change", saveChemSettings));',
  ''
].join("\n");
app = replaceOnce(app, 'const flash = el => {\n', configHelpers + 'const flash = el => {\n', "the chemistry settings helpers");

const oldMixedHandlers = [
  '$("#startMixed").addEventListener("click", () => {',
  '  const cfg = readChips("mixedOptions");',
  '  if (!anyOn(cfg)) { flash($("#mixedOptions")); return; }',
  '  start("mixed", cfg);',
  '});'
].join("\n");
const newChemistryHandlers = [
  '$("#startMixed").addEventListener("click", () => {',
  '  const cfg = readChips("mixedOptions");',
  '  if (!anyOn(cfg)) { flash($("#mixedOptions")); return; }',
  '  cfg.hydroCfg = readHydroConfig();',
  '  cfg.functionalCfg = readFunctionalConfig();',
  '  start("mixed", cfg);',
  '});',
  '',
  '$("#startHydrocarbon").addEventListener("click", () => {',
  '  const cfg = readHydroConfig();',
  '  if (!anyOn(cfg.types) || (!anyOn(cfg.chains) && !cfg.cyclic) || (cfg.types.structureToName && !anyOn(cfg.models))) {',
  '    flash(!anyOn(cfg.types) ? $("#hydroTypes") : !anyOn(cfg.chains) && !cfg.cyclic ? $("#hydroChains") : $("#hydroModels"));',
  '    return;',
  '  }',
  '  saveChemSettings();',
  '  start("hydrocarbon", cfg);',
  '});',
  '',
  '$("#startFunctional").addEventListener("click", () => {',
  '  const cfg = readFunctionalConfig();',
  '  if (!anyOn(cfg.types)) { flash($("#functionalTypes")); return; }',
  '  saveChemSettings();',
  '  start("functional", cfg);',
  '});',
  '',
  '$("#startChemMixed").addEventListener("click", () => {',
  '  const parts = readChips("chemMixedParts");',
  '  if (!anyOn(parts)) { flash($("#chemMixedParts")); return; }',
  '  const hydroConfig = readHydroConfig();',
  '  const functionalConfig = readFunctionalConfig();',
  '  if (parts.hydro && (!anyOn(hydroConfig.types) || (!anyOn(hydroConfig.chains) && !hydroConfig.cyclic) || (hydroConfig.types.structureToName && !anyOn(hydroConfig.models)))) { flash(!anyOn(hydroConfig.types) ? $("#hydroTypes") : !anyOn(hydroConfig.chains) && !hydroConfig.cyclic ? $("#hydroChains") : $("#hydroModels")); return; }',
  '  if (parts.functional && !anyOn(functionalConfig.types)) { flash($("#functionalTypes")); return; }',
  '  const cfg = { hydro: parts.hydro ? hydroConfig : null, functional: parts.functional ? functionalConfig : null, hydroConfig, functionalConfig, integrated: !!parts.integrated };',
  '  saveChemSettings();',
  '  start("chemMixed", cfg);',
  '});'
].join("\n");
app = replaceOnce(app, oldMixedHandlers, newChemistryHandlers, "the chemistry quiz start buttons");

app = replaceOnce(app,
  '  if (e.target.closest && e.target.closest(".charge-option")) return;\n',
  '  if (e.target.closest && e.target.closest(".charge-option")) return;\n  if (e.target.closest && (e.target.closest(".chem-editor-tools") || e.target.closest(".chem-editor-canvas"))) return;\n  if (e.target.matches && e.target.matches(\'input[type="checkbox"], input[type="radio"]\')) { e.preventDefault(); act(); return; }\n',
  "the Enter key handling for selectable answers");

const chemistryMarkup = [
  '    <div class="chemistry-grid" id="chemistryGrid">',
  '      <section class="chemistry-card">',
  '        <h2>نام‌گذاری هیدروکربن‌ها</h2>',
  '        <p class="hint">از متان تا دکان، زنجیره‌ای، شاخه‌دار و حلقوی</p>',
  '        <p class="sub">نوع سؤال</p>',
  '        <div class="chips" id="hydroTypes">',
  '          <label class="chip"><input data-chem-setting id="hydroTypeDraw" type="checkbox" value="nameToStructure" checked><span>نام ← رسم ساختار</span></label>',
  '          <label class="chip"><input data-chem-setting id="hydroTypeName" type="checkbox" value="structureToName" checked><span>ساختار ← نام‌گذاری</span></label>',
  '        </div>',
  '        <p class="sub">مدل نمایش ساختار سؤال (می‌توانی چند مورد را انتخاب کنی)</p>',
  '        <div class="chips" id="hydroModels">',
  '          <label class="chip"><input data-chem-setting id="hydroModelSkeletal" type="checkbox" value="skeletal" checked><span>خط و زاویه</span></label>',
  '          <label class="chip"><input data-chem-setting id="hydroModelStructural" type="checkbox" value="structural" checked><span>بدون هیدروژن</span></label>',
  '          <label class="chip"><input data-chem-setting id="hydroModelExplicit" type="checkbox" value="explicit" checked><span>با هیدروژن‌ها</span></label>',
  '        </div>',
  '        <p class="sub">نوع زنجیره</p>',
  '        <div class="chips" id="hydroChains">',
  '          <label class="chip"><input data-chem-setting id="hydroChainSingle" type="checkbox" value="single" checked><span>تک‌زنجیره</span></label>',
  '          <label class="chip"><input data-chem-setting id="hydroChainMultiple" type="checkbox" value="multiple" checked><span>چندزنجیره / شاخه‌دار</span></label>',
  '        </div>',
  '        <div class="chips" id="hydroExtra">',
  '          <label class="chip"><input data-chem-setting id="hydroCyclic" type="checkbox" value="cyclic" checked><span>ترکیبات حلقوی</span></label>',
  '        </div>',
  '        <button class="btn primary" id="startHydrocarbon" type="button">شروع نام‌گذاری هیدروکربن‌ها</button>',
  '      </section>',
  '',
  '      <section class="chemistry-card">',
  '        <h2>گروه‌های عاملی</h2>',
  '        <p class="hint">تشخیص گروه، رسم ساختار، نام گروه و خانوادهٔ آن</p>',
  '        <p class="sub">نوع سؤال‌ها</p>',
  '        <div class="chips" id="functionalTypes">',
  '          <label class="chip"><input data-chem-setting id="functionalIdentify" type="checkbox" value="identify" checked><span>ترکیب ← گروه‌های عاملی</span></label>',
  '          <label class="chip"><input data-chem-setting id="functionalShapeName" type="checkbox" value="structureToName" checked><span>شکل گروه ← نام گروه</span></label>',
  '          <label class="chip"><input data-chem-setting id="functionalNameShape" type="checkbox" value="nameToStructure" checked><span>نام گروه ← رسم شکل</span></label>',
  '          <label class="chip"><input data-chem-setting id="functionalNameFamily" type="checkbox" value="nameToFamily" checked><span>نام گروه ← خانواده</span></label>',
  '          <label class="chip"><input data-chem-setting id="functionalShapeFamily" type="checkbox" value="shapeToFamily" checked><span>شکل گروه ← خانواده</span></label>',
  '        </div>',
  '        <p class="chem-setting-note">در تشخیص ترکیب، گروه‌های جامع‌تر مثل کربوکسیل، استر و آمید بر هم‌پوشانی‌های ساده‌تر اولویت دارند.</p>',
  '        <button class="btn primary" id="startFunctional" type="button">شروع آزمون گروه‌های عاملی</button>',
  '      </section>',
  '',
  '      <section class="chemistry-card chem-mixed-card">',
  '        <h2>آزمون جامع شیمی آلی</h2>',
  '        <p class="hint">ترکیب‌ها را نام‌گذاری کن و همهٔ گروه‌های عاملی آن‌ها را مشخص کن</p>',
  '        <div class="chips chem-mixed-options" id="chemMixedParts">',
  '          <label class="chip"><input data-chem-setting id="chemMixedHydro" type="checkbox" value="hydro" checked><span>سؤال‌های هیدروکربن</span></label>',
  '          <label class="chip"><input data-chem-setting id="chemMixedFunctional" type="checkbox" value="functional" checked><span>سؤال‌های گروه عاملی</span></label>',
  '          <label class="chip"><input data-chem-setting id="chemMixedIntegrated" type="checkbox" value="integrated" checked><span>سؤال ترکیبی: نام + گروه‌های عاملی</span></label>',
  '        </div>',
  '        <button class="btn primary" id="startChemMixed" type="button">شروع آزمون جامع شیمی آلی</button>',
  '      </section>',
  '    </div>'
].join("\n");
html = replaceOnce(html,
  '    </div>\n\n  </section>\n\n  <section id="quiz"',
  `    </div>\n${chemistryMarkup}\n  </section>\n\n  <section id="quiz"`,
  "the chemistry settings cards in the home page");
html = replaceOnce(html,
  '<label class="chip"><input type="checkbox" value="elements" checked><span>عناصر جدول</span></label>',
  '<label class="chip"><input type="checkbox" value="elements" checked><span>عناصر جدول</span></label>\n            <label class="chip"><input type="checkbox" value="hydro"><span>نام‌گذاری هیدروکربن‌ها</span></label>\n            <label class="chip"><input type="checkbox" value="functional"><span>گروه‌های عاملی</span></label>',
  "the chemistry options in the existing mixed quiz");

write(appPath, app);
write(htmlPath, html);
console.log("Chemistry quiz integration applied to src/app.js and index.html.");
