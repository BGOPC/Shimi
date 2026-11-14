import test from "node:test";
import assert from "node:assert/strict";
import {
  parseStructure,
  sameStructure,
  renderMoleculeSvg,
  detectFunctionalGroups,
  buildChemistryBag,
  makeChemistryQuestion,
  structureEditorMarkup
} from "../src/chemistry.js";

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
  assert.match(explicit, /H[₀-₉]/);
  assert.match(renderMoleculeSvg("C", "skeletal"), />C</);
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

test("atom-based SVG styles clip bonds at circular nodes and skeletal chains zig-zag", () => {
  const structural = renderMoleculeSvg("CCO", "structural");
  const explicit = renderMoleculeSvg("CCO", "explicit");
  const skeletal = renderMoleculeSvg("CCCO", "skeletal");
  assert.match(structural, /class="atom-node"/);
  assert.match(explicit, /class="atom-node"/);
  assert.match(structural, /<circle class="atom-node"/);
  assert.match(skeletal, /class="molecule-vertex"/);
  const vertices = [...skeletal.matchAll(/class="molecule-vertex" cx="[^"]+" cy="([^"]+)"/g)].map(match => Number(match[1]));
  assert.ok(new Set(vertices).size > 1);
  const line = structural.match(/<line x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/);
  const circle = structural.match(/<circle class="atom-node" cx="([^"]+)" cy="([^"]+)" r="([^"]+)"/);
  assert.ok(line && circle);
  assert.notEqual(Number(line[1]), Number(circle[1]));
});

test("alkyl-only mode generates branched alkane naming questions with parent-chain locants", () => {
  const bag = buildChemistryBag("hydrocarbon", {
    alkylOnly: true,
    types: { structureToName: true, nameToStructure: true },
    models: { skeletal: true, structural: true, explicit: true },
    chains: { single: true, multiple: true },
    cyclic: true
  });
  assert.ok(bag.length >= 10);
  assert.ok(bag.every(item => item.kind === "hydroName" && item.molecule.type === "alkyl"));
  assert.ok(bag.some(item => item.molecule.name === "۴،۴،۵-تری‌اتیل-۷،۷-دی‌متیل‌دکان"));
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
