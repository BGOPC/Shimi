import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseStructure,
  sameStructure,
  renderMoleculeSvg,
  detectFunctionalGroups,
  buildChemistryBag,
  makeChemistryQuestion,
  structureEditorMarkup,
  layoutEditorGraph,
  appendEditorCarbonFragment
} from "../src/chemistry.js";


test("home screen closes before the quiz screen and quiz controls are inside #quiz", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const chemistryCard = html.indexOf('id="mobile-chem-mixed-content"');
  const quizStart = html.indexOf('<section id="quiz" class="screen">');
  const summaryStart = html.indexOf('<section id="summary" class="screen">');
  assert.ok(chemistryCard >= 0);
  assert.ok(quizStart > chemistryCard);
  assert.ok(summaryStart > quizStart);
  assert.equal((html.match(/<section id="quiz" class="screen">/g) || []).length, 1);
  const quizMarkup = html.slice(quizStart, summaryStart);
  assert.ok(quizMarkup.includes('id="qPrompt"'));
  assert.ok(quizMarkup.includes('id="fields"'));
  assert.ok(quizMarkup.includes('id="actBtn"'));
  assert.equal(html.includes('\ns="screen">'), false);
});

test("SMILES-like parser handles chains, branches, multiple bonds and rings", () => {
  const chain = parseStructure("C-C=C");
  const branch = parseStructure("CC(C)C");
  const ring = parseStructure("C1=CC=CC=C1");
  assert.equal(chain.atoms.length, 3);
  assert.equal(chain.bonds.find(b => b.order === 2) !== undefined, true);
  assert.equal(branch.atoms.length, 4);
  assert.equal(branch.bonds.length, 3);
  assert.equal(ring.atoms.length, 6);
  assert.equal(ring.bonds.length, 6);
  assert.equal(parseStructure("C1CC"), null);
  assert.equal(parseStructure("C="), null);
  assert.equal(parseStructure("C==O"), null);
  assert.equal(parseStructure("[CH3]"), null);
});

test("interactive editor redraw does not call the removed question-layout helper", () => {
  const source = readFileSync(new URL("../src/chemistry.js", import.meta.url), "utf8");
  const editor = source.slice(source.indexOf("export function mountStructureEditor"));
  assert.match(editor, /layoutEditorGraph\(graph\)/);
  assert.doesNotMatch(editor, /layoutGraph\(graph\)/);
  const selection = editor.slice(editor.indexOf("const selectAtom"), editor.indexOf('canvas.addEventListener("keydown"'));
  assert.doesNotMatch(selection, /render\(\)/);
  assert.match(selection, /aria-pressed/);
});

test("interactive editor layout preserves placed atoms and lays out text-entered molecules", () => {
  const drawn = {
    atoms: [
      { id: 0, element: "C", x: 80, y: 100 },
      { id: 1, element: "O", x: 210, y: 130 }
    ],
    bonds: [{ a: 0, b: 1, order: 2 }]
  };
  const preserved = layoutEditorGraph(drawn);
  assert.deepEqual(preserved.atoms.map(atom => [atom.x, atom.y]), [[80, 100], [210, 130]]);
  assert.deepEqual(preserved.bonds, drawn.bonds);

  const textGraph = parseStructure("CC(C)C");
  const laidOut = layoutEditorGraph(textGraph);
  assert.equal(laidOut.atoms.length, textGraph.atoms.length);
  assert.equal(laidOut.bonds.length, textGraph.bonds.length);
  assert.ok(laidOut.atoms.every(atom => Number.isFinite(atom.x) && Number.isFinite(atom.y)));
  assert.ok(new Set(laidOut.atoms.map(atom => atom.y)).size > 1, JSON.stringify(laidOut.atoms));
  assert.ok(textGraph.atoms.every(atom => atom.x === null && atom.y === null));

  const ring = layoutEditorGraph(parseStructure("C1CCCCC1"));
  assert.ok(ring.atoms.every(atom => Number.isFinite(atom.x) && Number.isFinite(atom.y)));
  assert.equal(ring.bonds.length, 6);
});

test("editor fragment shortcuts add correctly bonded alkyl groups and alkanes", () => {
  const methane = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 1);
  assert.ok(methane);
  assert.equal(methane.atoms.length, 1);
  assert.equal(methane.bonds.length, 0);

  const ethyl = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 2);
  assert.equal(ethyl.atoms.length, 2);
  assert.deepEqual(ethyl.bonds, [{ a: 0, b: 1, order: 1 }]);

  const propyl = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 3);
  assert.equal(propyl.atoms.length, 3);
  assert.deepEqual(propyl.bonds, [{ a: 0, b: 1, order: 1 }, { a: 1, b: 2, order: 1 }]);

  const decane = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 10);
  assert.equal(decane.atoms.length, 10);
  assert.equal(decane.bonds.length, 9);
  assert.ok(decane.bonds.every(bond => bond.order === 1));
  assert.ok(decane.atoms.every(atom => atom.element === "C"));
});

test("editor fragments stay separate until connected and obey the atom limit", () => {
  const first = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 1);
  const second = appendEditorCarbonFragment(first, 2);
  assert.equal(second.atoms.length, 3);
  assert.deepEqual(second.bonds, [{ a: 1, b: 2, order: 1 }]);
  assert.ok(second.atoms.slice(1).every(atom =>
    Math.hypot(atom.x - second.atoms[0].x, atom.y - second.atoms[0].y) >= 48
  ));
  assert.ok(second.atoms.every(atom => Number.isFinite(atom.x) && Number.isFinite(atom.y)));

  const full = {
    atoms: Array.from({ length: 17 }, (_, id) => ({ id, element: "C", x: 40 + id * 60, y: 80 })),
    bonds: []
  };
  assert.equal(appendEditorCarbonFragment(full, 2), null);
  assert.equal(appendEditorCarbonFragment({ atoms: [], bonds: [] }, 11), null);
});

test("editor markup includes every carbon shortcut and the enlarged drawing canvas", () => {
  const markup = structureEditorMarkup();
  for (const label of ["متیل", "اتیل", "پروپیل", "متان", "اتان", "پروپان", "بوتان", "پنتان", "هگزان", "هپتان", "اوکتان", "نونان", "دکان"]) {
    assert.ok(markup.includes(`data-fragment-label="${label}"`), label);
  }
  assert.match(markup, /viewBox="0 0 1200 600"/);
  assert.match(markup, /data-editor-fragment="10"/);
});

test("editor alkyne shortcuts create a terminal triple bond", () => {
  const ethyne = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 2, 1200, 600, 3);
  assert.ok(ethyne);
  assert.deepEqual(ethyne.bonds, [{ a: 0, b: 1, order: 3 }]);

  const butyne = appendEditorCarbonFragment({ atoms: [], bonds: [] }, 4, 1200, 600, 3);
  assert.deepEqual(butyne.bonds.map(bond => bond.order), [3, 1, 1]);
  assert.equal(appendEditorCarbonFragment({ atoms: [], bonds: [] }, 1, 1200, 600, 3), null);
});

test("fragment shortcuts are inside a vertical rail beside the drawing surface", () => {
  const markup = structureEditorMarkup();
  const area = markup.indexOf('class="chem-editor-drawing-area"');
  const rail = markup.indexOf('class="chem-fragment-tools"');
  const surface = markup.indexOf('class="chem-editor-canvas-wrap"');
  const toolbarEnd = markup.indexOf('class="chem-editor-text-label"');
  assert.ok(area >= 0 && rail > area && surface > rail && toolbarEnd > surface);
  for (const label of ["اتین", "پروپین", "بوتین", "پنتین", "هگزین", "هپتین", "اوکتین", "نونین", "دکین"]) {
    assert.ok(markup.includes(`data-fragment-label="${label}"`), label);
  }
  assert.match(markup, /data-fragment-bond="3"/);
});

test("desktop site and quiz content use the available viewport width", () => {
  const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");
  assert.match(css, /main\s*\{[^}]*max-width:\s*none/s);
  assert.match(css, /#quiz,#summary\s*\{[^}]*max-width:\s*none/s);
  assert.doesNotMatch(css, /main\s*\{\s*max-width:\s*1600px/);
});

test("editor atoms have a larger drag target and preserve the pointer grab offset", () => {
  const source = readFileSync(new URL("../src/chemistry.js", import.meta.url), "utf8");
  const editor = source.slice(source.indexOf("export function mountStructureEditor"));
  assert.match(editor, /class="atom-hit-area"/);
  assert.match(editor, /dragOffset = \{ x: atom\.x - point\.x, y: atom\.y - point\.y \}/);
  assert.match(editor, /canvas\.addEventListener\("pointercancel"/);
  assert.match(editor, /canvas\.addEventListener\("lostpointercapture"/);
});

test("mobile editor canvas can scroll horizontally while atom touch remains draggable", () => {
  const css = readFileSync(new URL("../src/chemistry.css", import.meta.url), "utf8");
  assert.match(css, /\.chem-editor-canvas-wrap\s*\{[^}]*overflow: auto;/s);
  assert.match(css, /\.chem-editor-canvas\s*\{[^}]*min-width: 760px/s);
  assert.match(css, /\.chem-editor-canvas\s*\{[^}]*touch-action: pan-x;/s);
  assert.match(css, /\.chem-editor-atom\s*\{[^}]*touch-action: none;/s);
});


test("structure notation supports temporary disconnected editor atoms", () => {
  const graph = parseStructure("C.O.N");
  assert.equal(graph.atoms.length, 3);
  assert.equal(graph.bonds.length, 0);
  assert.equal(parseStructure("C..O"), null);
  assert.equal(parseStructure("C.=O"), null);
  const markup = structureEditorMarkup();
  assert.match(markup, /data-editor-mode="select"/);
  assert.match(markup, /✋ انتخاب/);
});

test("structure matching is independent of atom numbering and drawing direction", () => {
  assert.equal(sameStructure(parseStructure("CC(C)C"), parseStructure("C(C)(C)C")), true);
  assert.equal(sameStructure(parseStructure("CC(C)C"), parseStructure("CCCC")), false);
  assert.equal(sameStructure(parseStructure("CC(=O)O"), parseStructure("OC(=O)C")), true);
  assert.equal(sameStructure(parseStructure("C-C(=O)-C"), parseStructure("R-C(=O)-R")), true);
  assert.equal(sameStructure(parseStructure("C-O"), parseStructure("R-O")), true);
});

test("SVG renderer supports skeletal, structural and explicit-hydrogen modes", () => {
  const skeletal = renderMoleculeSvg("CCO", "skeletal");
  const structural = renderMoleculeSvg("CCO", "structural");
  const explicit = renderMoleculeSvg("CCO", "explicit");
  assert.match(skeletal, /<svg/);
  assert.doesNotMatch(skeletal, />C</);
  assert.match(structural, />C</);
  assert.match(explicit, /H<tspan class="atom-subscript">[₂₃]/);
  assert.match(renderMoleculeSvg("C", "skeletal"), />C</);
});

test("functional-group R placeholders render as open bond ends without changing structure matching", () => {
  const alcohol = parseStructure("RO[H]");
  const hidden = renderMoleculeSvg(alcohol, "structural", "molecule-question", { hideRLabels: true });
  const regular = renderMoleculeSvg(alcohol, "structural", "molecule-question");

  assert.doesNotMatch(hidden, /class="molecule-atom atom-r"[^>]*>R<\/text>/);
  assert.match(hidden, /<line /);
  assert.match(hidden, />O<\/text>/);
  assert.match(hidden, />H<\/text>/);
  assert.match(regular, /class="molecule-atom atom-r"[^>]*>R<\/text>/);
  assert.ok(alcohol.atoms.some(atom => atom.element === "R"));
  assert.equal(sameStructure(parseStructure("C-O-H"), alcohol), true);

  const bag = buildChemistryBag("functional", {
    types: { structureToName: true, nameToStructure: true, shapeToFamily: true }
  });
  const shapeQuestions = bag.filter(item =>
    ["fgShapeName", "fgNameShape", "fgShapeFamily"].includes(item.kind)
  );
  assert.ok(shapeQuestions.length > 0);
  for (const item of shapeQuestions) {
    const question = makeChemistryQuestion(item);
    for (const markup of [question.prompt, question.answer]) {
      assert.doesNotMatch(markup, /class="molecule-atom atom-r"[^>]*>R<\/text>/, item.group.id);
    }
  }
});

test("functional group detection keeps more specific groups instead of overlaps", () => {
  assert.deepEqual(detectFunctionalGroups(parseStructure("CC(=O)O")), ["carboxyl"]);
  assert.deepEqual(detectFunctionalGroups(parseStructure("CC(=O)OC")), ["ester"]);
  assert.deepEqual(detectFunctionalGroups(parseStructure("CC(=O)N")), ["amide"]);
  assert.deepEqual(detectFunctionalGroups(parseStructure("NCC(=O)O")), ["carboxyl", "amine"]);
  assert.deepEqual(detectFunctionalGroups(parseStructure("NCCO")), ["alcohol", "amine"]);
  assert.deepEqual(detectFunctionalGroups(parseStructure("C-O-H")), ["alcohol"]);
  assert.deepEqual(detectFunctionalGroups(parseStructure("C-C(=O)-O-H")), ["carboxyl"]);
});

test("hydrocarbon quiz respects chain and ring settings", () => {
  const single = buildChemistryBag("hydrocarbon", {
    types: { nameToStructure: true, structureToName: true },
    models: { skeletal: true, structural: false, explicit: false },
    chains: { single: true, multiple: false },
    cyclic: false,
  });
  assert.ok(single.length > 0);
  assert.equal(single.some(q => q.molecule.type === "multiple" || q.molecule.type === "cyclic" || q.molecule.type === "aromatic"), false);
  const cyclic = buildChemistryBag("hydrocarbon", {
    types: { nameToStructure: true, structureToName: true },
    models: { skeletal: false, structural: true, explicit: false },
    chains: { single: false, multiple: false },
    cyclic: true,
  });
  assert.ok(cyclic.some(q => q.kind === "aromatic"));
  assert.ok(cyclic.some(q => q.molecule?.type === "cyclic"));
  assert.ok(cyclic.some(q => q.molecule?.name === "سیکلودکان"));
  const branched = buildChemistryBag("hydrocarbon", { types: { structureToName: true }, models: { structural: true }, chains: { multiple: true } }).find(q => q.molecule.name === "۲-متیل‌پروپان");
  assert.ok(branched);
  assert.equal(makeChemistryQuestion(branched).check({ name: "2-متیل پروپان" }).name.ok, true);
});

test("all generated hydrocarbon questions accept their canonical answer", () => {
  const bag = buildChemistryBag("hydrocarbon", {
    types: { nameToStructure: true, structureToName: true },
    models: { skeletal: true, structural: true, explicit: true },
    chains: { single: true, multiple: true },
    cyclic: true,
  });
  assert.ok(bag.length > 0);
  for (const item of bag) {
    const question = makeChemistryQuestion(item);
    if (item.kind === "hydroDraw") assert.equal(question.check({ structure: { graph: item.graph } }).structure.ok, true, item.molecule.name);
    if (item.kind === "hydroName") {
      assert.equal(question.check({ name: item.molecule.name }).name.ok, true, item.molecule.name);
      assert.match(question.answer, /<svg/);
    }
    if (item.kind === "aromatic") assert.equal(question.check({ choice: "correct" }).choice.ok, true);
  }
  assert.ok(bag.some(item => item.kind === "hydroName" && item.style === "skeletal"));
  assert.ok(bag.some(item => item.kind === "hydroName" && item.style === "structural"));
  assert.ok(bag.some(item => item.kind === "hydroName" && item.style === "explicit"));
});

test("molecule renderer uses tidy horizontal chains, clear vertical branches and label-edge bonds", () => {
  const structural = renderMoleculeSvg("CC(C)CCC", "structural");
  const explicit = renderMoleculeSvg("CC(C)CCC", "explicit");
  const skeletal = renderMoleculeSvg("CCCO", "skeletal");
  assert.match(structural, /class="molecule-atom atom-/);
  assert.match(explicit, /CH<tspan class="atom-subscript">₃<\/tspan>/);
  assert.match(explicit, /CH<tspan class="atom-subscript">₂<\/tspan>/);
  assert.doesNotMatch(structural, /atom-node/);
  assert.match(skeletal, /class="molecule-vertex"/);
  const atomPositions = [...structural.matchAll(/class="molecule-atom atom-[^"]+" x="([^"]+)" y="([^"]+)"/g)]
    .map(match => ({ x: Number(match[1]), y: Number(match[2]) }));
  assert.equal(atomPositions.length, 6);
  assert.ok(new Set(atomPositions.map(point => point.y)).size > 1);
  const chainY = atomPositions.filter(point => point.y === atomPositions[0].y);
  assert.ok(chainY.length >= 4);
  const vertices = [...skeletal.matchAll(/class="molecule-vertex" cx="[^"]+" cy="([^"]+)"/g)].map(match => Number(match[1]));
  assert.ok(new Set(vertices).size > 1);
  const line = structural.match(/<line x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/);
  const atom = structural.match(/class="molecule-atom atom-[^"]+" x="([^"]+)" y="([^"]+)"/);
  assert.ok(line && atom);
  assert.notEqual(Number(line[1]), Number(atom[1]));
});

test("hydrocarbon question settings cap the main carbon chain or ring size", () => {
  const limited = buildChemistryBag("hydrocarbon", {
    maxCarbons: 4,
    types: { nameToStructure: true, structureToName: true },
    models: { skeletal: true, structural: true, explicit: true },
    chains: { single: true, multiple: true },
    cyclic: true
  });
  const longestCarbonPath = graph => {
    const ids = graph.atoms.filter(atom => atom.element === "C").map(atom => atom.id);
    const adjacency = new Map(ids.map(id => [id, []]));
    graph.bonds.forEach(bond => {
      if (!adjacency.has(bond.a) || !adjacency.has(bond.b)) return;
      adjacency.get(bond.a).push(bond.b);
      adjacency.get(bond.b).push(bond.a);
    });
    if (ids.length > 2 && ids.every(id => adjacency.get(id).length === 2)) return ids.length;
    const walk = start => {
      const distance = new Map([[start, 0]]), queue = [start];
      for (let i = 0; i < queue.length; i++) {
        adjacency.get(queue[i]).forEach(next => {
          if (distance.has(next)) return;
          distance.set(next, distance.get(queue[i]) + 1);
          queue.push(next);
        });
      }
      let farthest = start;
      distance.forEach((value, id) => { if (value > distance.get(farthest)) farthest = id; });
      return { farthest, distance };
    };
    const first = walk(ids[0]);
    const second = walk(first.farthest);
    return second.distance.get(second.farthest) + 1;
  };
  assert.ok(limited.length > 0);
  assert.ok(limited.every(item => longestCarbonPath(item.graph) <= 4));
  assert.equal(limited.some(item => item.molecule.name === "پنتان" || item.molecule.name === "بنزن"), false);
  const alkylLimited = buildChemistryBag("hydrocarbon", {
    maxCarbons: 4,
    alkylOnly: true,
    types: { structureToName: true },
    models: { structural: true },
    chains: { multiple: true }
  });
  assert.ok(alkylLimited.length > 0);
  assert.ok(alkylLimited.every(item => longestCarbonPath(item.graph) <= 4));
});

test("alkyl-only mode respects both selected question directions", () => {
  const drawOnly = buildChemistryBag("hydrocarbon", {
    alkylOnly: true,
    types: { nameToStructure: true, structureToName: false },
    models: { skeletal: true, structural: true, explicit: true },
    maxCarbons: 10
  });
  assert.ok(drawOnly.length > 0);
  assert.ok(drawOnly.every(item => item.kind === "hydroDraw"));
  const drawQuestion = makeChemistryQuestion(drawOnly[0]);
  assert.equal(drawQuestion.editor, true);
  assert.match(drawQuestion.prompt, /ساختار مولکول/);

  const nameOnly = buildChemistryBag("hydrocarbon", {
    alkylOnly: true,
    types: { nameToStructure: false, structureToName: true },
    models: { skeletal: true, structural: false, explicit: false },
    maxCarbons: 10
  });
  assert.ok(nameOnly.length > 0);
  assert.ok(nameOnly.every(item => item.kind === "hydroName"));

  const both = buildChemistryBag("hydrocarbon", {
    alkylOnly: true,
    types: { nameToStructure: true, structureToName: true },
    models: { skeletal: true, structural: false, explicit: false },
    maxCarbons: 10
  });
  assert.ok(both.some(item => item.kind === "hydroDraw"));
  assert.ok(both.some(item => item.kind === "hydroName"));
});

test("alkyl naming omits a locant only when the substituent has exactly one valid position", () => {
  const bag = buildChemistryBag("hydrocarbon", {
    alkylOnly: true,
    maxCarbons: 5,
    types: { structureToName: true },
    models: { structural: true }
  });
  const isobutane = bag.find(item => item.molecule.smiles === "CC(C)C");
  const threeEthylpentane = bag.find(item => item.molecule.smiles === "CCC(CC)CC");
  assert.ok(isobutane);
  assert.ok(threeEthylpentane);
  assert.equal(isobutane.molecule.name, "متیل‌پروپان");
  assert.ok(isobutane.molecule.acceptedNames.includes("۲-متیل‌پروپان"));
  assert.equal(threeEthylpentane.molecule.name, "اتیل‌پنتان");
  assert.ok(threeEthylpentane.molecule.acceptedNames.includes("۳-اتیل‌پنتان"));

  const isobutaneQuestion = makeChemistryQuestion(isobutane);
  assert.equal(isobutaneQuestion.check({ name: "متیل پروپان" }).name.ok, true);
  assert.equal(isobutaneQuestion.check({ name: "۲ متیل پروپان" }).name.ok, true);
  const ethylQuestion = makeChemistryQuestion(threeEthylpentane);
  assert.equal(ethylQuestion.check({ name: "اتیل پنتان" }).name.ok, true);
  assert.equal(ethylQuestion.check({ name: "۳ اتیل پنتان" }).name.ok, true);
  assert.equal(ethylQuestion.check({ name: "۲ اتیل پنتان" }).name.ok, false);
});

test("alkyl-only mode generates branched alkane naming questions with parent-chain locants", () => {
  const bag = buildChemistryBag("hydrocarbon", {
    alkylOnly: true,
    types: { structureToName: true, nameToStructure: false },
    models: { skeletal: true, structural: true, explicit: true },
    chains: { single: true, multiple: true },
    cyclic: true
  });
  assert.ok(bag.length >= 10);
  assert.ok(bag.every(item => item.kind === "hydroName" && item.molecule.type === "alkyl"));
  assert.ok(bag.some(item => item.molecule.name === "۴،۴،۵-تری‌اتیل-۷،۷-دی‌متیل‌دکان"));
  assert.ok(bag.some(item => item.molecule.name.includes("پروپیل")));
  assert.ok(bag.some(item => item.molecule.name.includes("بوتیل")));
  for (const item of bag) {
    const question = makeChemistryQuestion(item);
    assert.equal(question.check({ name: item.molecule.name }).name.ok, true);
    assert.ok(item.graph.atoms.every(atom => atom.element === "C"));
    assert.ok(item.graph.bonds.every(bond => bond.order === 1));
    assert.ok(item.molecule.carbonCount <= 18);
  }
  assert.equal(bag.some(item => item.kind === "hydroDraw" || item.molecule.type === "aromatic"), false);
});

test("dedicated hydrocarbon comprehensive mode combines drawing and naming questions", () => {
  const bag = buildChemistryBag("hydroExam", {
    types: { nameToStructure: true, structureToName: true },
    models: { skeletal: true, structural: true },
    chains: { single: true, multiple: true },
    cyclic: true
  });
  assert.ok(bag.some(item => item.kind === "hydroDraw"));
  assert.ok(bag.some(item => item.kind === "hydroName"));
  assert.ok(bag.some(item => item.kind === "aromatic"));
});

test("all generated functional questions have accepted canonical answers", () => {
  const bag = buildChemistryBag("functional", {
    types: { identify: true, structureToName: true, nameToStructure: true, nameToFamily: true, shapeToFamily: true }
  });
  const identify = bag.filter(item => item.kind === "fgIdentify");
  for (const item of identify) {
    const question = makeChemistryQuestion(item);
    const result = question.check({ groups: item.compound.groups });
    assert.equal(result.groups.ok, true, item.compound.smiles);
  }
  for (const item of bag.filter(item => item.kind === "fgShapeName")) {
    const question = makeChemistryQuestion(item);
    assert.equal(question.check({ name: item.group.group }).name.ok, true);
    assert.match(question.answer, /<svg/);
    assert.equal(question.check({ name: item.group.family }).name.ok, item.group.id === "aldehyde" && item.group.group === item.group.family);
  }
  for (const item of bag.filter(item => item.kind === "fgNameShape")) {
    const question = makeChemistryQuestion(item);
    assert.equal(question.check({ structure: { graph: item.graph } }).structure.ok, true);
    if (item.group.id === "alcohol") assert.equal(question.check({ structure: { graph: parseStructure("C-O-H") } }).structure.ok, true);
    if (item.group.id === "carboxyl") assert.equal(question.check({ structure: { graph: parseStructure("C-C(=O)-O-H") } }).structure.ok, true);
    if (item.group.id === "amine") assert.equal(question.check({ structure: { graph: parseStructure("C-N-C") } }).structure.ok, true);
    if (item.group.id === "aldehyde") {
      assert.equal(question.check({ structure: { graph: parseStructure("H-C(=O)-C") } }).structure.ok, true);
    }
  }
  for (const item of bag.filter(item => item.kind === "fgNameFamily" || item.kind === "fgShapeFamily")) {
    const question = makeChemistryQuestion(item);
    assert.equal(question.check({ name: item.group.family }).name.ok, true);
  }
});

test("integrated exam checks both compound name and full functional group selection", () => {
  const bag = buildChemistryBag("chemMixed", {
    integrated: true,
    hydroConfig: { types: { structureToName: true }, models: { structural: true }, chains: { single: true, multiple: true }, cyclic: true },
    functionalConfig: { types: { identify: true } }
  });
  assert.ok(bag.length > 0);
  assert.ok(bag.some(item => item.compound?.name === "بنزن"));
  for (const item of bag) {
    if (item.kind === "aromatic") {
      assert.equal(makeChemistryQuestion(item).check({ choice: "correct" }).choice.ok, true);
      continue;
    }
    const question = makeChemistryQuestion(item);
    const result = question.check({ name: item.compound.name, groups: item.compound.groups || [] });
    assert.equal(result.name.ok, true, item.compound.smiles);
    assert.equal(result.groups.ok, true, item.compound.smiles);
  }
});


test("integrated exam follows independently selected hydrocarbon and functional options", () => {
  const hydroOnly = buildChemistryBag("chemMixed", {
    integrated: true,
    hydroConfig: { types: { structureToName: true }, models: { skeletal: true }, chains: { single: true }, cyclic: false },
    functionalConfig: { types: {} }
  });
  assert.ok(hydroOnly.length > 0);
  const hydroOnlyCompounds = hydroOnly.filter(item => item.kind === "integrated" && item.compound.type === "single");
  assert.equal(hydroOnlyCompounds.length, 17);
  assert.ok(hydroOnlyCompounds.every(item => item.compound.groups.length === 0 && item.style === "skeletal"));
  assert.equal(hydroOnly.some(item => item.kind === "integrated" && ["multiple", "cyclic", "aromatic"].includes(item.compound.type)), false);
  assert.equal(hydroOnly.some(item => item.kind === "aromatic"), false);
  assert.equal(hydroOnly.filter(item => item.kind === "integrated" && item.compound.groups.length > 0).length, 20);
  const functionalOnly = buildChemistryBag("chemMixed", {
    integrated: true,
    hydroConfig: { types: {}, models: {}, chains: {}, cyclic: false },
    functionalConfig: { types: { identify: true } }
  });
  assert.equal(functionalOnly.length, 20);
  assert.ok(functionalOnly.every(item => item.compound.groups.length > 0));
  const integratedOnly = buildChemistryBag("chemMixed", { integrated: true, hydroConfig: { types: {}, models: {}, chains: {}, cyclic: false }, functionalConfig: { types: {} } });
  assert.equal(integratedOnly.length, 20);
  assert.ok(integratedOnly.some(item => item.compound?.name === "اتانال"));
  const integratedCyclic = buildChemistryBag("chemMixed", { integrated: true, hydroConfig: { types: { structureToName: true }, models: { structural: true }, chains: { single: true }, cyclic: true }, functionalConfig: { types: {} } });
  assert.ok(integratedCyclic.some(item => item.kind === "aromatic"));
  const noHydroModel = buildChemistryBag("chemMixed", { integrated: true, hydroConfig: { types: { structureToName: true }, models: {}, chains: { single: true }, cyclic: false }, functionalConfig: { types: {} } });
  assert.equal(noHydroModel.some(item => item.kind === "integrated" && item.compound.groups.length === 0), false);
});

test("functional group detector follows the compound dataset hierarchy", () => {
  const expected = new Map([
    ["CC=O", ["aldehyde"]], ["CCC=O", ["aldehyde"]],
    ["CC(=O)C", ["ketone"]], ["CC(=O)CC", ["ketone"]],
    ["CCO", ["alcohol"]], ["CCCO", ["alcohol"]],
    ["COC", ["ether"]], ["CCOC", ["ether"]],
    ["CC(=O)O", ["carboxyl"]], ["CCC(=O)O", ["carboxyl"]],
    ["CC(=O)OC", ["ester"]], ["CC(=O)OCC", ["ester"]],
    ["CN", ["amine"]], ["CCN", ["amine"]],
    ["CC(=O)N", ["amide"]], ["CCC(=O)N", ["amide"]],
    ["NCCO", ["amine", "alcohol"]], ["NCC(=O)O", ["amine", "carboxyl"]],
    ["O=CCO", ["aldehyde", "alcohol"]], ["CC(=O)CCO", ["ketone", "alcohol"]]
  ]);
  for (const [structure, groups] of expected) {
    assert.deepEqual(detectFunctionalGroups(parseStructure(structure)).sort(), groups.sort(), structure);
  }
});
