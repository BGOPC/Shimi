const GROUPS = [
  { id: "aldehyde", group: "آلدهیدی", family: "آلدهید", smiles: "[H]C(=O)R", aliases: ["گروه آلدهیدی", "الدئیدی", "گروه الدئیدی"] },
  { id: "ketone", group: "کربونیل", family: "کتون", smiles: "RC(=O)R", aliases: ["کربنیل", "گروه کربونیل", "گروه کربنیل"] },
  { id: "alcohol", group: "هیدروکسیل", family: "الکل", smiles: "RO[H]", aliases: ["گروه هیدروکسیل"] },
  { id: "ether", group: "اتری", family: "اتر", smiles: "ROR", aliases: ["گروه اتری"] },
  { id: "carboxyl", group: "کربوکسیل", family: "اسید کربوکسیلیک", smiles: "RC(=O)O[H]", aliases: ["گروه کربوکسیل", "کربوکسیلیک"] },
  { id: "ester", group: "استری", family: "استر", smiles: "RC(=O)OR", aliases: ["گروه استری"] },
  { id: "amine", group: "آمینی", family: "آمین", smiles: "RNR", aliases: ["گروه آمینی"] },
  { id: "amide", group: "آمیدی", family: "آمید", smiles: "RC(=O)N", aliases: ["گروه آمیدی"] }
];

const HYDROCARBONS = [
  { smiles: "C", name: "متان", type: "single" },
  { smiles: "CC", name: "اتان", type: "single" },
  { smiles: "CCC", name: "پروپان", type: "single" },
  { smiles: "CCCC", name: "بوتان", type: "single" },
  { smiles: "CCCCC", name: "پنتان", type: "single" },
  { smiles: "CCCCCC", name: "هگزان", type: "single" },
  { smiles: "CCCCCCC", name: "هپتان", type: "single" },
  { smiles: "CCCCCCCC", name: "اوکتان", type: "single" },
  { smiles: "CCCCCCCCC", name: "نونان", type: "single" },
  { smiles: "CCCCCCCCCC", name: "دکان", type: "single" },
  { smiles: "C=C", name: "اتن", type: "single" },
  { smiles: "C=CC", name: "پروپن", type: "single" },
  { smiles: "CC=CC", name: "بوت-۲-ان", type: "single" },
  { smiles: "C=CCCC", name: "پنت-۱-ان", type: "single" },
  { smiles: "C#C", name: "اتین", type: "single" },
  { smiles: "C#CC", name: "پروپین", type: "single" },
  { smiles: "CC#CC", name: "بوت-۲-ین", type: "single" },
  { smiles: "CC(C)C", name: "۲-متیل‌پروپان", type: "multiple" },
  { smiles: "CCC(C)C", name: "۲-متیل‌بوتان", type: "multiple" },
  { smiles: "CC(C)CCC", name: "۲-متیل‌پنتان", type: "multiple" },
  { smiles: "CCCC(C)CC", name: "۳-متیل‌هگزان", type: "multiple" },
  { smiles: "CC(C)C(C)C", name: "۲،۳-دی‌متیل‌بوتان", type: "multiple" },
  { smiles: "CC(C)(C)C", name: "۲،۲-دی‌متیل‌پروپان", type: "multiple" },
  { smiles: "CCC(C)(C)CC", name: "۳،۳-دی‌متیل‌پنتان", type: "multiple" },
  { smiles: "C1CC1", name: "سیکلوپروپان", type: "cyclic" },
  { smiles: "C1CCC1", name: "سیکلوبوتان", type: "cyclic" },
  { smiles: "C1CCCC1", name: "سیکلوپنتان", type: "cyclic" },
  { smiles: "C1CCCCC1", name: "سیکلوهگزان", type: "cyclic" },
  { smiles: "C1CCCCCC1", name: "سیکلوهپتان", type: "cyclic" },
  { smiles: "C1CCCCCCC1", name: "سیکلو‌اوکتان", type: "cyclic" },
  { smiles: "C1CCCCCCCC1", name: "سیکلونونان", type: "cyclic" },
  { smiles: "C1CCCCCCCCC1", name: "سیکلودکان", type: "cyclic" },
  { smiles: "C1=CC=CC=C1", name: "بنزن", type: "aromatic" }
];

const FUNCTIONAL_COMPOUNDS = [
  { smiles: "CC=O", name: "اتانال", groups: ["aldehyde"] },
  { smiles: "CCC=O", name: "پروپانال", groups: ["aldehyde"] },
  { smiles: "CC(=O)C", name: "پروپانون", groups: ["ketone"] },
  { smiles: "CC(=O)CC", name: "بوتان-۲-اون", groups: ["ketone"] },
  { smiles: "CCO", name: "اتانول", groups: ["alcohol"] },
  { smiles: "CCCO", name: "پروپان-۱-ول", groups: ["alcohol"] },
  { smiles: "COC", name: "دی‌متیل اتر", groups: ["ether"] },
  { smiles: "CCOC", name: "متیل اتیل اتر", groups: ["ether"] },
  { smiles: "CC(=O)O", name: "اتانوئیک اسید", groups: ["carboxyl"] },
  { smiles: "CCC(=O)O", name: "پروپانوئیک اسید", groups: ["carboxyl"] },
  { smiles: "CC(=O)OC", name: "متیل اتانوات", groups: ["ester"] },
  { smiles: "CC(=O)OCC", name: "اتیل اتانوات", groups: ["ester"] },
  { smiles: "CN", name: "متیل‌آمین", groups: ["amine"] },
  { smiles: "CCN", name: "اتیل‌آمین", groups: ["amine"] },
  { smiles: "CC(=O)N", name: "اتان‌آمید", groups: ["amide"] },
  { smiles: "CCC(=O)N", name: "پروپان‌آمید", groups: ["amide"] },
  { smiles: "NCCO", name: "آمینواتانول", groups: ["amine", "alcohol"] },
  { smiles: "NCC(=O)O", name: "گلیسین", groups: ["amine", "carboxyl"] },
  { smiles: "O=CCO", name: "هیدروکسی‌اتانال", groups: ["aldehyde", "alcohol"] },
  { smiles: "CC(=O)CCO", name: "هیدروکسی‌بوتانون", groups: ["ketone", "alcohol"] }
];

const toSub = value => String(value).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rnd = length => Math.floor(Math.random() * length);
const shuffle = values => {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};
const bondKey = (a, b) => a < b ? `${a}:${b}` : `${b}:${a}`;

function clippedBondLines(a, b, order, radiusA, radiusB) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / length, uy = dy / length;
  const px = -uy, py = ux;
  return Array.from({ length: order }, (_, index) => {
    const offset = (index - (order - 1) / 2) * 6;
    const sideA = Math.max(-Math.max(0, radiusA - 1), Math.min(Math.max(0, radiusA - 1), offset));
    const sideB = Math.max(-Math.max(0, radiusB - 1), Math.min(Math.max(0, radiusB - 1), offset));
    const alongA = Math.sqrt(Math.max(0, radiusA * radiusA - sideA * sideA));
    const alongB = Math.sqrt(Math.max(0, radiusB * radiusB - sideB * sideB));
    const x1 = a.x + ux * alongA + px * sideA;
    const y1 = a.y + uy * alongA + py * sideA;
    const x2 = b.x - ux * alongB + px * sideB;
    const y2 = b.y - uy * alongB + py * sideB;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
  }).join("");
}

export function parseStructure(text) {
  const source = String(text || "").trim().replace(/[−–—]/g, "-").replace(/\s+/g, "");
  if (!source) return null;
  const atoms = [];
  const bonds = [];
  const branch = [];
  const rings = new Map();
  let current = -1;
  let pendingBond = 1;
  let bondPending = false;
  let index = 0;
  const addAtom = (element, aromatic = false) => {
    const id = atoms.length;
    atoms.push({ id, element, aromatic, x: null, y: null });
    if (current >= 0) bonds.push({ a: current, b: id, order: pendingBond });
    current = id;
    pendingBond = 1;
    bondPending = false;
  };
  while (index < source.length) {
    const char = source[index];
    if (char === "-" || char === "=" || char === "#" || char === "≡") {
      if (current < 0 || bondPending) return null;
      pendingBond = char === "-" ? 1 : char === "=" ? 2 : 3;
      bondPending = true;
      index++;
      continue;
    }
    if (char === ".") {
      if (current < 0 || bondPending || branch.length) return null;
      current = -1;
      pendingBond = 1;
      index++;
      continue;
    }
    if (char === "(") { if (current < 0 || bondPending) return null; branch.push(current); index++; continue; }
    if (char === ")") { if (!branch.length || bondPending) return null; current = branch.pop(); index++; continue; }
    if (/[0-9]/.test(char)) {
      if (current < 0) return null;
      if (rings.has(char)) {
        const other = rings.get(char);
        bonds.push({ a: other.atom, b: current, order: bondPending ? pendingBond : other.order });
        rings.delete(char);
      } else rings.set(char, { atom: current, order: pendingBond });
      pendingBond = 1;
      bondPending = false;
      index++;
      continue;
    }
    if (char === "[") {
      const end = source.indexOf("]", index + 1);
      if (end < 0) return null;
      const token = source.slice(index + 1, end);
      const match = token.match(/^(Cl|Br|[A-Z][a-z]?|[a-z]|R|\*)$/);
      if (!match) return null;
      const raw = match[1];
      addAtom(raw === "*" ? "R" : raw.toUpperCase() === "R" ? "R" : raw[0].toUpperCase() + raw.slice(1).toLowerCase(), raw === raw.toLowerCase() && raw !== "r");
      index = end + 1;
      continue;
    }
    const token = source.slice(index).match(/^(Cl|Br|[A-Z][a-z]?|[a-z]|R)/);
    if (!token) return null;
    const raw = token[1];
    const aromatic = raw.length === 1 && raw === raw.toLowerCase();
    const element = raw === "R" || raw === "r" ? "R" : raw[0].toUpperCase() + raw.slice(1).toLowerCase();
    if (!["C", "O", "N", "S", "F", "Cl", "Br", "H", "R"].includes(element)) return null;
    addAtom(element, aromatic);
    index += raw.length;
  }
  if (!atoms.length || branch.length || rings.size || bondPending) return null;
  const seen = new Set();
  for (const bond of bonds) {
    const key = bondKey(bond.a, bond.b);
    if (seen.has(key) || bond.a === bond.b || bond.order < 1 || bond.order > 3) return null;
    seen.add(key);
  }
  return { atoms, bonds };
}

function atomNeighbours(graph) {
  const adjacency = graph.atoms.map(() => []);
  graph.bonds.forEach(bond => {
    adjacency[bond.a].push({ id: bond.b, order: bond.order });
    adjacency[bond.b].push({ id: bond.a, order: bond.order });
  });
  return adjacency;
}

function longestPathInTree(adjacency) {
  const walk = start => {
    const parent = Array(adjacency.length).fill(-1);
    const distance = Array(adjacency.length).fill(-1);
    const queue = [start];
    parent[start] = start;
    distance[start] = 0;
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      adjacency[current].forEach(edge => {
        if (distance[edge.id] !== -1) return;
        parent[edge.id] = current;
        distance[edge.id] = distance[current] + 1;
        queue.push(edge.id);
      });
    }
    let farthest = start;
    for (let id = 0; id < distance.length; id++) {
      if (distance[id] > distance[farthest]) farthest = id;
    }
    return { farthest, parent, distance };
  };
  const first = walk(0);
  const second = walk(first.farthest);
  const path = [];
  let node = second.farthest;
  while (node !== first.farthest) {
    path.push(node);
    node = second.parent[node];
  }
  path.push(first.farthest);
  return path.reverse();
}

function layoutMoleculeGraph(graph, mode) {
  if (graph.atoms.every(atom => Number.isFinite(atom.x) && Number.isFinite(atom.y))) return layoutGraph(graph);
  const atoms = graph.atoms.map(atom => ({ ...atom }));
  const bonds = graph.bonds;
  const adjacency = atomNeighbours(graph);
  const isSimpleRing = atoms.length > 2 && bonds.length === atoms.length && adjacency.every(edges => edges.length === 2);
  if (isSimpleRing) {
    const radius = Math.max(82, Math.min(150, atoms.length * 20));
    atoms.forEach((atom, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / atoms.length;
      atom.x = 180 + Math.cos(angle) * radius;
      atom.y = 180 + Math.sin(angle) * radius;
    });
    return { atoms, bonds };
  }

  const path = bonds.length === atoms.length - 1
    ? longestPathInTree(adjacency)
    : layoutGraph(graph).atoms.map(atom => atom.id);
  const onPath = new Set(path);
  const step = 112;
  const baseY = 190;
  const zigzag = mode === "skeletal";
  const pathWidth = Math.max(0, path.length - 1) * step;
  const startX = Math.max(70, (pathWidth + 140) / 2 - pathWidth / 2);
  path.forEach((id, index) => {
    atoms[id].x = startX + index * step;
    atoms[id].y = baseY + (zigzag ? (index % 2 ? -28 : 28) : 0);
  });

  const placed = new Set(onPath);
  const placeBranch = (id, parentId, x, y, direction, depth) => {
    if (placed.has(id)) return;
    placed.add(id);
    atoms[id].x = x;
    atoms[id].y = y;
    const children = adjacency[id]
      .filter(edge => edge.id !== parentId && !placed.has(edge.id))
      .map(edge => edge.id);
    children.forEach((child, index) => {
      const spread = (index - (children.length - 1) / 2) * 64;
      placeBranch(
        child,
        id,
        x + spread,
        y + direction * 82,
        direction,
        depth + 1
      );
    });
  };

  path.forEach((id, index) => {
    const branches = adjacency[id].filter(edge => !onPath.has(edge.id));
    branches.forEach((branch, branchIndex) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const spread = (branchIndex - (branches.length - 1) / 2) * 56;
      placeBranch(
        branch.id,
        id,
        atoms[id].x + spread,
        atoms[id].y + direction * 82,
        direction,
        1
      );
    });
  });

  atoms.forEach((atom, id) => {
    if (Number.isFinite(atom.x) && Number.isFinite(atom.y)) return;
    atom.x = 70 + id * 54;
    atom.y = baseY + 150;
  });
  return { atoms, bonds };
}

export function layoutEditorGraph(graph) {
  const atoms = graph.atoms.map(atom => ({ ...atom }));
  const bonds = graph.bonds.map(bond => ({ ...bond }));
  if (!atoms.length) return { atoms, bonds };
  if (atoms.every(atom => Number.isFinite(atom.x) && Number.isFinite(atom.y))) return { atoms, bonds };

  const adjacency = atomNeighbours({ atoms, bonds });
  const tree = atoms.map(() => []);
  const visited = new Set();
  let offsetX = 42;

  const farthestInTree = start => {
    const parent = new Map([[start, -1]]);
    const distance = new Map([[start, 0]]);
    const queue = [start];
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      tree[current].forEach(next => {
        if (distance.has(next)) return;
        parent.set(next, current);
        distance.set(next, distance.get(current) + 1);
        queue.push(next);
      });
    }
    let farthest = start;
    distance.forEach((value, id) => {
      if (value > distance.get(farthest)) farthest = id;
    });
    return { farthest, parent, distance };
  };

  for (let root = 0; root < atoms.length; root++) {
    if (visited.has(root)) continue;
    const component = [];
    const queue = [root];
    visited.add(root);
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      component.push(current);
      adjacency[current].forEach(edge => {
        if (visited.has(edge.id)) return;
        visited.add(edge.id);
        tree[current].push(edge.id);
        tree[edge.id].push(current);
        queue.push(edge.id);
      });
    }

    const componentSet = new Set(component);
    const componentBonds = bonds.filter(bond => componentSet.has(bond.a) && componentSet.has(bond.b)).length;
    const isSimpleRing = component.length > 2 &&
      componentBonds === component.length &&
      component.every(id => adjacency[id].filter(edge => componentSet.has(edge.id)).length === 2);

    if (isSimpleRing) {
      const radius = Math.max(42, Math.min(78, component.length * 10));
      const centerX = offsetX + radius;
      const centerY = 122;
      component.forEach((id, index) => {
        const angle = -Math.PI / 2 + index * Math.PI * 2 / component.length;
        atoms[id].x = centerX + Math.cos(angle) * radius;
        atoms[id].y = centerY + Math.sin(angle) * radius;
      });
      offsetX += radius * 2 + 64;
      continue;
    }

    const first = farthestInTree(root);
    const second = farthestInTree(first.farthest);
    const path = [];
    let current = second.farthest;
    while (current !== -1) {
      path.push(current);
      current = second.parent.get(current) ?? -1;
    }
    path.reverse();

    const pathSet = new Set(path);
    const stepX = 52;
    const baseY = 122;
    path.forEach((id, index) => {
      atoms[id].x = offsetX + index * stepX;
      atoms[id].y = baseY;
    });

    const placed = new Set(path);
    const placeBranch = (id, parentId, x, y, direction) => {
      if (placed.has(id)) return;
      placed.add(id);
      atoms[id].x = x;
      atoms[id].y = y;
      const children = tree[id].filter(next => next !== parentId && !placed.has(next));
      children.forEach((child, index) => {
        const spread = (index - (children.length - 1) / 2) * 36;
        placeBranch(child, id, x + spread, y + direction * 46, direction);
      });
    };

    path.forEach((id, index) => {
      const branches = tree[id].filter(next => !pathSet.has(next));
      const direction = index % 2 === 0 ? -1 : 1;
      branches.forEach((child, branchIndex) => {
        const spread = (branchIndex - (branches.length - 1) / 2) * 32;
        placeBranch(child, id, atoms[id].x + spread, atoms[id].y + direction * 46, direction);
      });
    });

    offsetX += Math.max(path.length * stepX, 112) + 64;
  }

  return { atoms, bonds };
}

function implicitHydrogens(atom, graph) {
  const valence = { C: 4, O: 2, N: 3, S: 2, F: 1, Cl: 1, Br: 1 }[atom.element];
  if (!valence) return 0;
  const used = graph.bonds.filter(b => b.a === atom.id || b.b === atom.id).reduce((sum, b) => sum + b.order, 0);
  return Math.max(0, valence - used);
}

function clippedLabelBondLines(a, b, order, halfWidthA, halfHeightA, halfWidthB, halfHeightB) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / length, uy = dy / length;
  const px = -uy, py = ux;
  const reach = (halfWidth, halfHeight, ox, oy) => {
    const xDistance = Math.abs(ox) < 1e-6 ? Infinity : halfWidth / Math.abs(ox);
    const yDistance = Math.abs(oy) < 1e-6 ? Infinity : halfHeight / Math.abs(oy);
    return Math.min(xDistance, yDistance);
  };
  const markup = [];
  for (let index = 0; index < order; index++) {
    const offset = (index - (order - 1) / 2) * 5;
    const startDistance = reach(halfWidthA, halfHeightA, ux, uy);
    const endDistance = reach(halfWidthB, halfHeightB, ux, uy);
    const x1 = a.x + ux * startDistance + px * offset;
    const y1 = a.y + uy * startDistance + py * offset;
    const x2 = b.x - ux * endDistance + px * offset;
    const y2 = b.y - uy * endDistance + py * offset;
    markup.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`);
  }
  return markup.join("");
}

export function renderMoleculeSvg(input, mode = "structural", className = "molecule-preview") {
  const graph = typeof input === "string" ? parseStructure(input) : input;
  if (!graph || !graph.atoms.length) return "<div class=\"chem-empty\">ساختار قابل نمایش نیست</div>";
  const positioned = layoutMoleculeGraph(graph, mode);
  const display = positioned.atoms.map(atom => {
    const showAtom = mode !== "skeletal" || atom.element !== "C" || graph.atoms.length === 1;
    const hydrogenCount = mode === "explicit" ? implicitHydrogens(atom, graph) : 0;
    const label = atom.element + (hydrogenCount ? "H" + (hydrogenCount > 1 ? toSub(hydrogenCount) : "") : "");
    const halfWidth = showAtom ? Math.max(12, label.length * 7 + 5) : 4;
    return { atom, showAtom, label, halfWidth, halfHeight: showAtom ? 17 : 4 };
  });
  const displayById = new Map(display.map(item => [item.atom.id, item]));
  const xs = display.map(item => item.atom.x);
  const ys = display.map(item => item.atom.y);
  const minX = Math.min(...display.map(item => item.atom.x - item.halfWidth)) - 32;
  const maxX = Math.max(...display.map(item => item.atom.x + item.halfWidth)) + 32;
  const minY = Math.min(...display.map(item => item.atom.y - item.halfHeight)) - 28;
  const maxY = Math.max(...display.map(item => item.atom.y + item.halfHeight)) + 28;
  const width = Math.max(160, maxX - minX);
  const height = Math.max(100, maxY - minY);
  const bondMarkup = positioned.bonds.map(bond => {
    const first = displayById.get(bond.a), second = displayById.get(bond.b);
    return clippedLabelBondLines(
      first.atom, second.atom, bond.order,
      first.halfWidth, first.halfHeight,
      second.halfWidth, second.halfHeight
    );
  }).join("");
  const atomMarkup = display.map(({ atom, showAtom, label }) => {
    if (!showAtom) return `<circle class="molecule-vertex" cx="${atom.x}" cy="${atom.y}" r="4.5" />`;
    const labelMarkup = label.replace(/H([₀-₉]+)/, "H<tspan class=\"atom-subscript\">$1</tspan>");
    return `<text class="molecule-atom atom-${atom.element.toLowerCase()}" x="${atom.x}" y="${atom.y + 7}" text-anchor="middle">${labelMarkup}</text>`;
  }).join("");
  return `<svg class="${className}" viewBox="${minX} ${minY} ${width} ${height}" role="img" aria-label="ساختار مولکولی" preserveAspectRatio="xMidYMid meet"><g class="molecule-bonds">${bondMarkup}</g><g class="molecule-atoms">${atomMarkup}</g></svg>`;
}

function carbonChainLength(graph) {
  if (!graph || !graph.atoms.length) return 0;
  const carbonIds = graph.atoms.filter(atom => atom.element === "C").map(atom => atom.id);
  if (!carbonIds.length) return 0;
  const carbonSet = new Set(carbonIds);
  const adjacency = new Map(carbonIds.map(id => [id, []]));
  graph.bonds.forEach(bond => {
    if (!carbonSet.has(bond.a) || !carbonSet.has(bond.b)) return;
    adjacency.get(bond.a).push(bond.b);
    adjacency.get(bond.b).push(bond.a);
  });
  if (carbonIds.length > 2 && carbonIds.every(id => adjacency.get(id).length === 2)) return carbonIds.length;
  const walk = start => {
    const distance = new Map([[start, 0]]);
    const queue = [start];
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      adjacency.get(current).forEach(next => {
        if (distance.has(next)) return;
        distance.set(next, distance.get(current) + 1);
        queue.push(next);
      });
    }
    let farthest = start;
    distance.forEach((value, id) => { if (value > distance.get(farthest)) farthest = id; });
    return { farthest, distance };
  };
  const first = walk(carbonIds[0]);
  const second = walk(first.farthest);
  return second.distance.get(second.farthest) + 1;
}
function graphWithoutHydrogen(graph) {
  const kept = graph.atoms.filter(a => a.element !== "H");
  const ids = new Map(kept.map((a, i) => [a.id, i]));
  return {
    atoms: kept.map((a, id) => ({ ...a, id })),
    bonds: graph.bonds.filter(b => ids.has(b.a) && ids.has(b.b)).map(b => ({ ...b, a: ids.get(b.a), b: ids.get(b.b) }))
  };
}

export function sameStructure(first, second) {
  if (!first || !second) return false;
  const a = graphWithoutHydrogen(first), b = graphWithoutHydrogen(second);
  if (a.atoms.length !== b.atoms.length || a.bonds.length !== b.bonds.length) return false;
  const edgesA = new Map(a.bonds.map(x => [bondKey(x.a, x.b), x.order]));
  const edgesB = new Map(b.bonds.map(x => [bondKey(x.a, x.b), x.order]));
  const adj = graph => graph.atoms.map((_, i) => graph.bonds.filter(e => e.a === i || e.b === i));
  const degreeA = adj(a), degreeB = adj(b);
  const candidates = a.atoms.map(atom => b.atoms.map((other, id) => ({ other, id })).filter(x => (x.other.element === atom.element || atom.element === "R" || x.other.element === "R") && degreeA[atom.id].length === degreeB[x.id].length));
  const order = a.atoms.map((_, i) => i).sort((x, y) => candidates[x].length - candidates[y].length);
  const mapping = new Map(), used = new Set();
  const search = depth => {
    if (depth === order.length) return true;
    const id = order[depth];
    for (const candidate of candidates[id]) {
      const target = candidate.id;
      if (used.has(target)) continue;
      let valid = true;
      for (const [other, mapped] of mapping) {
        const e1 = edgesA.get(bondKey(id, other));
        const e2 = edgesB.get(bondKey(target, mapped));
        if (e1 !== e2) { valid = false; break; }
      }
      if (!valid) continue;
      mapping.set(id, target); used.add(target);
      if (search(depth + 1)) return true;
      mapping.delete(id); used.delete(target);
    }
    return false;
  };
  return search(0);
}

function normalizeName(value) {
  return String(value || "").toLowerCase()
    .replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[آأإ]/g, "ا")
    .replace(/[\s\u200c\u200d\u200e\u200f]/g, "")
    .replace(/[()\[\]{}،,._–—-]/g, "");
}

function compareNames(value, aliases) {
  const normalized = normalizeName(value);
  if (!normalized) return { ok: false, msg: "پاسخی وارد نکردی" };
  return aliases.some(name => normalizeName(name) === normalized) ? { ok: true } : { ok: false, msg: "نام واردشده درست نیست" };
}

export function detectFunctionalGroups(graph) {
  if (!graph) return [];
  const atoms = graph.atoms;
  const neighbors = id => graph.bonds.filter(b => b.a === id || b.b === id).map(b => ({ atom: atoms[b.a === id ? b.b : b.a], order: b.order }));
  const found = new Set();
  const protectedAtoms = new Set();
  for (const atom of atoms.filter(a => a.element === "C")) {
    const around = neighbors(atom.id);
    const doubleO = around.find(x => x.atom.element === "O" && x.order === 2);
    if (!doubleO) continue;
    const singles = around.filter(x => x.order === 1 && x.atom.id !== doubleO.atom.id);
    const oxygen = singles.find(x => x.atom.element === "O");
    const nitrogen = singles.find(x => x.atom.element === "N");
    const carbonNeighbors = singles.filter(x => x.atom.element === "C");
    if (nitrogen) {
      found.add("amide");
      protectedAtoms.add(nitrogen.atom.id);
    } else if (oxygen) {
      const oxygenNeighbors = neighbors(oxygen.atom.id).filter(x => x.atom.id !== atom.id);
      if (oxygenNeighbors.some(x => x.atom.element === "C")) found.add("ester");
      else found.add("carboxyl");
      protectedAtoms.add(oxygen.atom.id);
    } else if (carbonNeighbors.length >= 2) found.add("ketone");
    else found.add("aldehyde");
  }
  for (const atom of atoms) {
    const around = neighbors(atom.id);
    if (atom.element === "O" && around.some(x => x.atom.element === "C") && !protectedAtoms.has(atom.id)) {
      const carbon = around.find(x => x.atom.element === "C").atom;
      const attachedOnlyAsHydroxyl = around.length === 1 || (around.length === 2 && around.some(x => x.atom.element === "H"));
      const carbonylBond = neighbors(carbon.id).some(x => x.atom.element === "O" && x.order === 2);
      if (attachedOnlyAsHydroxyl && !carbonylBond) found.add("alcohol");
    }
    if (atom.element === "O" && around.length === 2 && around.every(x => x.atom.element === "C") && !protectedAtoms.has(atom.id)) {
      const esterO = around.some(x => neighbors(x.atom.id).some(y => y.atom.id !== atom.id && y.atom.element === "O" && y.order === 2));
      if (!esterO) found.add("ether");
    }
    if (atom.element === "N" && !protectedAtoms.has(atom.id) && around.some(x => x.atom.element === "C")) found.add("amine");
  }
  return GROUPS.map(g => g.id).filter(id => found.has(id));
}

function groupAliases(group) {
  const item = GROUPS.find(g => g.id === group);
  return item ? [item.group, ...item.aliases] : [];
}

function structureField() {
  return { id: "structure", label: "ساختار را رسم کن یا به‌صورت متنی بنویس", type: "structure" };
}
const nameField = (id = "name", label = "نام ترکیب") => ({ id, label, ph: "نام فارسی ترکیب", dir: "rtl" });
const multiField = (id = "groups") => ({ id, label: "گروه‌های عاملی موجود", type: "multi", options: GROUPS.map(g => ({ value: g.id, label: g.group })) });
const choiceField = (id, options) => ({ id, label: "یک گزینه را انتخاب کن", type: "choice", options });
const groupStructure = group => {
  const shapes = {
    aldehyde: "[H]C(=O)R",
    ketone: "RC(=O)R",
    alcohol: "RO[H]",
    ether: "ROR",
    carboxyl: "RC(=O)O[H]",
    ester: "RC(=O)OR",
    amine: "RNR",
    amide: "RC(=O)N"
  };
  return parseStructure(shapes[group] || "C");
};

const ALKANE_ROOTS = ["", "متان", "اتان", "پروپان", "بوتان", "پنتان", "هگزان", "هپتان", "اوکتان", "نونان", "دکان"];
const ALKYL_SUBSTITUENTS = {
  1: { key: "methyl", name: "متیل" },
  2: { key: "ethyl", name: "اتیل" },
  3: { key: "propyl", name: "پروپیل" },
  4: { key: "butyl", name: "بوتیل" }
};
const ALKYL_PREFIXES = ["", "", "دی", "تری", "تترا", "پنتا", "هگزا", "هپتا"];
const persianNumber = value => String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

function compareNumberLists(first, second) {
  const length = Math.min(first.length, second.length);
  for (let i = 0; i < length; i++) {
    if (first[i] !== second[i]) return first[i] - second[i];
  }
  return first.length - second.length;
}

function alkylNameFromGraph(graph) {
  if (!graph || graph.atoms.some(atom => atom.element !== "C") || graph.bonds.length !== graph.atoms.length - 1) return null;
  const adjacency = graph.atoms.map(() => []);
  graph.bonds.forEach(bond => { adjacency[bond.a].push(bond.b); adjacency[bond.b].push(bond.a); });
  const leaves = adjacency.map((neighbors, id) => neighbors.length <= 1 ? id : -1).filter(id => id >= 0);
  let longest = 0;
  let candidates = [];
  for (let i = 0; i < leaves.length; i++) {
    const start = leaves[i];
    const parent = Array(graph.atoms.length).fill(-1);
    const queue = [start];
    parent[start] = start;
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const current = queue[cursor];
      for (const next of adjacency[current]) {
        if (parent[next] !== -1) continue;
        parent[next] = current;
        queue.push(next);
      }
    }
    for (let j = i + 1; j < leaves.length; j++) {
      const end = leaves[j];
      const path = [];
      let node = end;
      while (node !== start) { path.push(node); node = parent[node]; }
      path.push(start);
      path.reverse();
      if (path.length < longest) continue;
      const pathSet = new Set(path);
      const branches = [];
      path.forEach((atomId, index) => {
        for (const neighbor of adjacency[atomId]) {
          if (pathSet.has(neighbor)) continue;
          const stack = [neighbor], seen = new Set([atomId]);
          let size = 0;
          while (stack.length) {
            const current = stack.pop();
            if (seen.has(current)) continue;
            seen.add(current);
            size++;
            adjacency[current].forEach(next => { if (!seen.has(next)) stack.push(next); });
          }
          branches.push({ locant: index + 1, size });
        }
      });
      const orient = reverse => {
        const oriented = branches.map(item => ({
          locant: reverse ? path.length - item.locant + 1 : item.locant,
          size: item.size
        }));
        const locants = oriented.map(item => item.locant).sort((a, b) => a - b);
        const alphaLocants = [...oriented]
          .sort((a, b) => (ALKYL_SUBSTITUENTS[a.size]?.key || "").localeCompare(ALKYL_SUBSTITUENTS[b.size]?.key || ""))
          .map(item => item.locant);
        return { path, branches: oriented, locants, alphaLocants };
      };
      const forward = orient(false), reverse = orient(true);
      const chosen = compareNumberLists(forward.locants, reverse.locants) <= 0 ? forward : reverse;
      const candidate = { ...chosen, branchCount: branches.length };
      if (path.length > longest) { longest = path.length; candidates = [candidate]; }
      else if (candidate.branchCount > (candidates[0]?.branchCount ?? -1)) candidates = [candidate];
      else if (candidate.branchCount === candidates[0]?.branchCount) candidates.push(candidate);
    }
  }
  if (!longest || longest > 10 || !candidates.length || !candidates[0].branchCount) return null;
  candidates.sort((a, b) => compareNumberLists(a.locants, b.locants) || compareNumberLists(a.alphaLocants, b.alphaLocants));
  const selected = candidates[0];
  const grouped = new Map();
  selected.branches.forEach(item => {
    if (!ALKYL_SUBSTITUENTS[item.size]) return;
    if (!grouped.has(item.size)) grouped.set(item.size, []);
    grouped.get(item.size).push(item.locant);
  });
  const parts = [...grouped.entries()]
    .sort((a, b) => ALKYL_SUBSTITUENTS[a[0]].key.localeCompare(ALKYL_SUBSTITUENTS[b[0]].key))
    .map(([size, locants]) => {
      locants.sort((a, b) => a - b);
      const prefix = ALKYL_PREFIXES[locants.length] || "";
      const substituent = ALKYL_SUBSTITUENTS[size].name;
      return persianNumber(locants.join("،")) + "-" + (prefix ? prefix + "‌" : "") + substituent;
    });
  if (!parts.length) return ALKANE_ROOTS[longest];
  const last = parts.pop();
  return [...parts, last + "‌" + ALKANE_ROOTS[longest]].join("-");
}

function makeAlkylNamingMolecule(parentLength, branches) {
  const at = Array.from({ length: parentLength }, () => []);
  branches.forEach(item => at[item.locant - 1].push(item.size));
  const smiles = at.map(groups => "C" + groups.map(size => "(" + "C".repeat(size) + ")").join("")).join("");
  const graph = parseStructure(smiles);
  const name = alkylNameFromGraph(graph);
  if (!name) return null;
  return { smiles, name, type: "alkyl", carbonCount: graph.atoms.length };
}

function generatedAlkylNamingMolecules(maxCarbons = 10) {
  const maximum = Math.max(1, Math.min(10, Number(maxCarbons) || 10));
  const examples = [];
  if (maximum >= 10) {
    examples.push(
      makeAlkylNamingMolecule(10, [
        { locant: 4, size: 2 }, { locant: 4, size: 2 }, { locant: 5, size: 2 },
        { locant: 7, size: 1 }, { locant: 7, size: 1 }
      ]),
      makeAlkylNamingMolecule(10, [
        { locant: 5, size: 3 }, { locant: 7, size: 1 }
      ]),
      makeAlkylNamingMolecule(10, [
        { locant: 5, size: 4 }, { locant: 7, size: 1 }
      ])
    );
  }
  if (maximum < 3) {
    for (let length = 1; length <= maximum; length++) {
      const smiles = "C".repeat(length);
      examples.push({
        smiles,
        name: ALKANE_ROOTS[length],
        type: "alkyl",
        carbonCount: length
      });
    }
    return examples;
  }
  for (let i = 0; i < 18; i++) {
    const parentLength = 3 + rnd(maximum - 2);
    const positions = [];
    for (let locant = 2; locant < parentLength; locant++) positions.push(locant, locant);
    const branchCount = Math.min(1 + rnd(4), positions.length, 18 - parentLength);
    const branches = [];
    let remainingCarbons = 18 - parentLength;
    for (let count = 0; count < branchCount && remainingCarbons > 0; count++) {
      const slot = rnd(positions.length);
      const locant = positions.splice(slot, 1)[0];
      let size = 1 + rnd(3);
      if (size > remainingCarbons) size = 1;
      remainingCarbons -= size;
      branches.push({ locant, size });
    }
    const molecule = makeAlkylNamingMolecule(parentLength, branches);
    if (molecule && carbonChainLength(parseStructure(molecule.smiles)) <= maximum) examples.push(molecule);
  }
  return examples.filter(Boolean);
}

function buildHydrocarbonBag(cfg = {}) {
  const questions = [];
  const types = cfg.types || {};
  const styles = ["skeletal", "structural", "explicit"].filter(style => cfg.models?.[style]);
  const includeSingle = !!cfg.chains?.single;
  const includeMultiple = !!cfg.chains?.multiple;
  const includeCyclic = !!cfg.cyclic;
  const maxCarbons = Math.max(1, Math.min(10, Number(cfg.maxCarbons) || 10));
  if (cfg.alkylOnly) {
    generatedAlkylNamingMolecules(maxCarbons).forEach(molecule => {
      const graph = parseStructure(molecule.smiles);
      if (types.nameToStructure) {
        questions.push({ k: "chem", kind: "hydroDraw", molecule, graph });
      }
      if (types.structureToName) {
        (styles.length ? styles : ["structural"]).forEach(style => {
          questions.push({ k: "chem", kind: "hydroName", molecule, graph, style });
        });
      }
    });
    return questions;
  }
  HYDROCARBONS.forEach(entry => {
    if (entry.type === "single" && !includeSingle) return;
    if (entry.type === "multiple" && !includeMultiple) return;
    if ((entry.type === "cyclic" || entry.type === "aromatic") && !includeCyclic) return;
    const graph = parseStructure(entry.smiles);
    if (carbonChainLength(graph) > maxCarbons) return;
    if (types.nameToStructure) questions.push({ k: "chem", kind: "hydroDraw", molecule: entry, graph });
    if (types.structureToName) {
      (styles.length ? styles : ["structural"]).forEach(style => questions.push({ k: "chem", kind: "hydroName", molecule: entry, graph, style }));
    }
  });
  if (includeCyclic) {
    const aromatic = maxCarbons >= 6 ? HYDROCARBONS.find(x => x.type === "aromatic") : null;
    const distractors = ["C1CCCCC1", "CC=CC", "CC(C)C"].map(smiles => ({ smiles, graph: parseStructure(smiles) }));
    if (aromatic) questions.push({ k: "chem", kind: "aromatic", molecule: aromatic, graph: parseStructure(aromatic.smiles), options: shuffle([{ smiles: aromatic.smiles, name: "بنزن", correct: true }, ...distractors.map((d, i) => ({ smiles: d.smiles, name: ["سیکلوهگزان", "بوت-۲-ان", "۲-متیل‌پروپان"][i], correct: false }))]) });
  }
  return questions;
}

function buildFunctionalBag(cfg = {}) {
  const types = cfg.types || {};
  const questions = [];
  if (types.identify) FUNCTIONAL_COMPOUNDS.forEach(compound => questions.push({ k: "chem", kind: "fgIdentify", compound, graph: parseStructure(compound.smiles) }));
  if (types.structureToName) GROUPS.forEach(group => questions.push({ k: "chem", kind: "fgShapeName", group, graph: groupStructure(group.id) }));
  if (types.nameToStructure) GROUPS.forEach(group => questions.push({ k: "chem", kind: "fgNameShape", group, graph: groupStructure(group.id) }));
  if (types.nameToFamily) GROUPS.forEach(group => questions.push({ k: "chem", kind: "fgNameFamily", group }));
  if (types.shapeToFamily) GROUPS.forEach(group => questions.push({ k: "chem", kind: "fgShapeFamily", group, graph: groupStructure(group.id) }));
  return questions;
}

function buildIntegratedBag(config = {}) {
  const compounds = [];
  const hydro = config.hydro || {};
  const hydroTypes = hydro.types || {};
  const hydroChains = hydro.chains || {};
  const showHydro = !!hydroTypes.structureToName;
  const styles = ["skeletal", "structural", "explicit"].filter(style => hydro.models?.[style]);
  if (showHydro && styles.length) {
    const maxCarbons = Math.max(1, Math.min(10, Number(hydro.maxCarbons) || 10));
    const hydroEntries = hydro.alkylOnly
      ? generatedAlkylNamingMolecules(maxCarbons)
      : HYDROCARBONS.filter(entry => {
        if (entry.type === "single" && !hydroChains.single) return false;
        if (entry.type === "multiple" && !hydroChains.multiple) return false;
        if ((entry.type === "cyclic" || entry.type === "aromatic") && !hydro.cyclic) return false;
        return carbonChainLength(parseStructure(entry.smiles)) <= maxCarbons;
      });
    hydroEntries.forEach(entry => {
      const molecule = { ...entry, groups: [] };
      styles.forEach(style => compounds.push({ molecule, style }));
    });
  }
  FUNCTIONAL_COMPOUNDS.forEach(compound => compounds.push({ molecule: compound, style: "structural" }));
  const questions = compounds.map(({ molecule, style }) => ({ k: "chem", kind: "integrated", compound: molecule, graph: parseStructure(molecule.smiles), style }));
  if (hydro.cyclic) {
    const aromatic = Number(hydro.maxCarbons || 10) >= 6 ? HYDROCARBONS.find(entry => entry.type === "aromatic") : null;
    if (aromatic) {
      const distractors = ["C1CCCCC1", "CC=CC", "CC(C)C"].map(smiles => ({ smiles, graph: parseStructure(smiles) }));
      questions.push({ k: "chem", kind: "aromatic", molecule: aromatic, graph: parseStructure(aromatic.smiles), options: shuffle([{ smiles: aromatic.smiles, name: "بنزن", correct: true }, ...distractors.map((d, i) => ({ smiles: d.smiles, name: ["سیکلوهگزان", "بوت-۲-ان", "۲-متیل‌پروپان"][i], correct: false }))]) });
    }
  }
  return questions;
}

export function buildChemistryBag(mode, config = {}) {
  if (mode === "hydrocarbon") return buildHydrocarbonBag(config);
  if (mode === "functional") return buildFunctionalBag(config);
  if (mode === "hydroExam") return buildHydrocarbonBag(config);
  if (mode === "chemMixed") {
    const result = [];
    if (config.hydro) result.push(...buildHydrocarbonBag(config.hydro));
    if (config.functional) result.push(...buildFunctionalBag(config.functional));
    if (config.integrated) result.push(...buildIntegratedBag({ hydro: config.hydroConfig, functional: config.functionalConfig }));
    return result;
  }
  return [];
}

export function makeChemistryQuestion(data) {
  const moleculeName = data.molecule?.name || data.compound?.name || "";
  if (data.kind === "hydroDraw") return {
    badge: "نام‌گذاری هیدروکربن‌ها",
    prompt: `ساختار مولکول <b>${escapeHtml(moleculeName)}</b> را رسم کن یا با نمادگذاری توضیح‌داده‌شده بنویس`,
    fields: [structureField()],
    editor: true,
    check: values => ({ structure: values.structure?.graph && sameStructure(values.structure.graph, data.graph) ? { ok: true } : { ok: false, msg: values.structure?.error || "ساختار با پاسخ درست یکسان نیست" } }),
    answer: renderMoleculeSvg(data.graph, "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(moleculeName)}</div>`
  };
  if (data.kind === "hydroName") return {
    badge: "نام‌گذاری هیدروکربن‌ها",
    prompt: `نام این هیدروکربن را بنویس${renderMoleculeSvg(data.graph, data.style, "molecule-question")}`,
    fields: [nameField()],
    check: values => ({ name: compareNames(values.name, [moleculeName]) }),
    answer: renderMoleculeSvg(data.graph, "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(moleculeName)}</div>`
  };
  if (data.kind === "aromatic") {
    const options = data.options.map((option, index) => ({ value: option.correct ? "correct" : `wrong${index}`, label: option.name, html: renderMoleculeSvg(option.smiles, "structural", "aromatic-choice-svg") }));
    return {
      badge: "ترکیبات حلقوی و آروماتیک",
      prompt: "کدام‌یک از ساختارهای زیر حلقهٔ بنزن دارد و آروماتیک است؟",
      fields: [choiceField("choice", options)],
      check: values => ({ choice: values.choice === "correct" ? { ok: true } : { ok: false, msg: "ساختار انتخاب‌شده حلقهٔ بنزن ندارد" } }),
      answer: "بنزن" + renderMoleculeSvg("C1=CC=CC=C1", "structural", "molecule-answer")
    };
  }
  if (data.kind === "fgIdentify") {
    return {
      badge: "گروه‌های عاملی",
      prompt: `این ترکیب چه گروه‌های عاملی‌ای دارد؟${renderMoleculeSvg(data.graph, "structural", "molecule-question")}`,
      fields: [multiField()],
      check: values => {
        const expected = [...data.compound.groups].sort();
        const actual = [...(values.groups || [])].sort();
        const correct = expected.length === actual.length && expected.every((value, i) => value === actual[i]);
        return { groups: correct ? { ok: true } : { ok: false, msg: "گروه‌های انتخاب‌شده کامل یا دقیق نیستند" } };
      },
      answer: renderMoleculeSvg(data.graph, "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(data.compound.groups.length ? data.compound.groups.map(id => GROUPS.find(g => g.id === id).group).join("، ") : "هیچ گروه عاملی ندارد")}</div>`
    };
  }
  if (data.kind === "fgShapeName") return {
    badge: "گروه‌های عاملی",
    prompt: `نام این گروه عاملی چیست؟${renderMoleculeSvg(data.graph, "structural", "molecule-question")}`,
    fields: [nameField("name", "نام گروه عاملی")],
    check: values => ({ name: compareNames(values.name, groupAliases(data.group.id)) }),
    answer: renderMoleculeSvg(data.graph, "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(data.group.group)}</div>`
  };
  if (data.kind === "fgNameShape") return {
    badge: "گروه‌های عاملی",
    prompt: `ساختار گروه <b>${escapeHtml(data.group.group)}</b> را با اتم‌ها و پیوندها رسم کن`,
    fields: [structureField()],
    editor: true,
    check: values => ({ structure: values.structure?.graph && sameStructure(values.structure.graph, data.graph) ? { ok: true } : { ok: false, msg: values.structure?.error || "اتصال اتم‌ها با ساختار گروه عاملی یکسان نیست" } }),
    answer: renderMoleculeSvg(data.graph, "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(data.group.family)}</div>`
  };
  if (data.kind === "fgNameFamily" || data.kind === "fgShapeFamily") {
    const prompt = data.kind === "fgNameFamily" ? `خانوادهٔ گروه عاملی <b>${escapeHtml(data.group.group)}</b> چیست؟` : `این ساختار متعلق به کدام خانواده است؟${renderMoleculeSvg(data.graph, "structural", "molecule-question")}`;
    return {
      badge: "گروه‌های عاملی",
      prompt,
      fields: [nameField("name", "نام خانواده")],
      check: values => ({ name: compareNames(values.name, [data.group.family]) }),
      answer: renderMoleculeSvg(data.graph, "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(data.group.family)}</div>`
    };
  }
  if (data.kind === "integrated") {
    const groups = data.compound.groups || [];
    const answers = groups.length ? groups.map(id => GROUPS.find(g => g.id === id).group).join("، ") : "ندارد";
    return {
      badge: "آزمون جامع شیمی آلی",
      prompt: `نام این ترکیب و تمام گروه‌های عاملی موجود در آن را مشخص کن${renderMoleculeSvg(data.graph, data.style || "structural", "molecule-question")}`,
      fields: [nameField(), multiField()],
      check: values => {
        const nameResult = compareNames(values.name, [data.compound.name]);
        const expected = [...groups].sort();
        const actual = [...(values.groups || [])].sort();
        const groupResult = expected.length === actual.length && expected.every((value, i) => value === actual[i])
          ? { ok: true }
          : { ok: false, msg: "گروه‌های عاملی انتخاب‌شده کامل یا دقیق نیستند" };
        return { name: nameResult, groups: groupResult };
      },
      answer: renderMoleculeSvg(data.graph, data.style || "structural", "molecule-answer") + `<div class="chem-answer-name">${escapeHtml(data.compound.name)} — ${escapeHtml(answers)}</div>`
    };
  }
  return { badge: "شیمی آلی", prompt: "سؤال نامعتبر است", fields: [], check: () => ({}), answer: "" };
}

export function structureEditorMarkup() {
  return `<div class="chem-editor">
    <div class="chem-editor-tools">
      <div class="chem-atom-tools" role="group" aria-label="ابزار رسم و انتخاب">
        <button type="button" data-editor-mode="select" class="chem-select-tool" aria-pressed="false" title="انتخاب اتم‌های موجود">✋ انتخاب</button>
        <button type="button" data-atom="C" class="is-active" aria-pressed="true">C</button>
        <button type="button" data-atom="O">O</button>
        <button type="button" data-atom="N">N</button>
        <button type="button" data-atom="H">H</button>
        <button type="button" data-atom="R">R</button>
      </div>
      <div class="chem-bond-tools" role="group" aria-label="نوع پیوند">
        <button type="button" data-bond="1" class="is-active">—</button>
        <button type="button" data-bond="2">═</button>
        <button type="button" data-bond="3">≡</button>
      </div>
      <div class="chem-edit-tools">
        <button type="button" data-editor-action="delete">حذف اتم</button>
        <button type="button" data-editor-action="clear">پاک‌کردن</button>
      </div>
    </div>
    <div class="chem-fragment-tools" aria-label="میان‌بر افزودن زنجیره‌های کربنی">
      <div class="chem-fragment-group">
        <span class="chem-fragment-heading">گروه‌های آلکیل</span>
        <div class="chem-fragment-buttons">
          <button type="button" data-editor-fragment="1" data-fragment-label="متیل"><span>متیل</span><small>CH₃–</small></button>
          <button type="button" data-editor-fragment="2" data-fragment-label="اتیل"><span>اتیل</span><small>C₂H₅–</small></button>
          <button type="button" data-editor-fragment="3" data-fragment-label="پروپیل"><span>پروپیل</span><small>C₃H₇–</small></button>
        </div>
      </div>
      <div class="chem-fragment-group">
        <span class="chem-fragment-heading">آلکان‌ها</span>
        <div class="chem-fragment-buttons chem-alkane-buttons">
          <button type="button" data-editor-fragment="1" data-fragment-label="متان"><span>متان</span><small>CH₄</small></button>
          <button type="button" data-editor-fragment="2" data-fragment-label="اتان"><span>اتان</span><small>C₂H₆</small></button>
          <button type="button" data-editor-fragment="3" data-fragment-label="پروپان"><span>پروپان</span><small>C₃H₈</small></button>
          <button type="button" data-editor-fragment="4" data-fragment-label="بوتان"><span>بوتان</span><small>C₄H₁₀</small></button>
          <button type="button" data-editor-fragment="5" data-fragment-label="پنتان"><span>پنتان</span><small>C₅H₁₂</small></button>
          <button type="button" data-editor-fragment="6" data-fragment-label="هگزان"><span>هگزان</span><small>C₆H₁₄</small></button>
          <button type="button" data-editor-fragment="7" data-fragment-label="هپتان"><span>هپتان</span><small>C₇H₁₆</small></button>
          <button type="button" data-editor-fragment="8" data-fragment-label="اوکتان"><span>اوکتان</span><small>C₈H₁₈</small></button>
          <button type="button" data-editor-fragment="9" data-fragment-label="نونان"><span>نونان</span><small>C₉H₂₀</small></button>
          <button type="button" data-editor-fragment="10" data-fragment-label="دکان"><span>دکان</span><small>C₁₀H₂₂</small></button>
        </div>
      </div>
    </div>
    <div class="chem-editor-canvas-wrap">
      <svg class="chem-editor-canvas" viewBox="0 0 1200 600" role="img" aria-label="صفحهٔ بزرگ رسم ساختار مولکولی" preserveAspectRatio="xMidYMid meet"><text x="600" y="300" text-anchor="middle" class="chem-editor-empty">برای افزودن اتم، روی صفحه بزن</text></svg>
    </div>
    <label class="chem-editor-text-label" for="chem-structure-text">یا ساختار را متنی بنویس</label>
    <textarea id="chem-structure-text" class="chem-structure-text" rows="2" dir="ltr" spellcheck="false" autocapitalize="off" placeholder="مثلاً C-C(=O)-O یا C1=CC=CC=C1"></textarea>
    <div class="chem-editor-help">راهنمای رسم: ابتدا نوع اتم را انتخاب کن و اتم‌ها را در صفحه بگذار. سپس ابزار ✋ انتخاب را فعال کن، روی دو اتم موجود بزن و نوع پیوند را انتخاب کن. برای نوشتن متنی از C، O، N، H و R استفاده کن؛ پیوند یگانه با -، دوگانه با = و سه‌گانه با # است. برای شاخه از پرانتز و برای حلقه از شماره استفاده کن؛ مثلاً C-C-C، C-C(=O)-O یا C1=CC=CC=C1. بین رسم و نوشتن متن فقط یکی کافی است.</div>
    <small class="chem-editor-status" aria-live="polite">ابتدا اتم‌ها را اضافه کن یا ساختار را در کادر بنویس.</small>
  </div>`;
}

export function appendEditorCarbonFragment(graph, carbonCount, width = 1200, height = 600) {
  const count = Number(carbonCount);
  if (!Number.isInteger(count) || count < 1 || count > 10 || graph.atoms.length + count > 18) return null;
  const positioned = layoutEditorGraph(graph);
  const spacing = 58, margin = 40;
  const maxStart = width - margin - (count - 1) * spacing;
  if (maxStart < margin) return null;
  const starts = [];
  for (let x = margin; x <= maxStart; x += 28) starts.push(x);
  starts.sort((a, b) => Math.abs(a + (count - 1) * spacing / 2 - width / 2) - Math.abs(b + (count - 1) * spacing / 2 - width / 2));
  const rows = [];
  for (let y = 48; y <= height - 48; y += 64) rows.push(y);
  rows.sort((a, b) => Math.abs(a - height / 2) - Math.abs(b - height / 2));
  let origin = null;
  for (const y of rows) {
    for (const x of starts) {
      const clear = Array.from({ length: count }, (_, index) => ({ x: x + index * spacing, y }))
        .every(point => positioned.atoms.every(atom => Math.hypot(atom.x - point.x, atom.y - point.y) >= 48));
      if (clear) { origin = { x, y }; break; }
    }
    if (origin) break;
  }
  if (!origin) return null;
  const nextId = positioned.atoms.reduce((max, atom) => Math.max(max, atom.id), -1) + 1;
  const atoms = Array.from({ length: count }, (_, index) => ({
    id: nextId + index,
    element: "C",
    aromatic: false,
    x: origin.x + index * spacing,
    y: origin.y
  }));
  const bonds = Array.from({ length: count - 1 }, (_, index) => ({
    a: nextId + index,
    b: nextId + index + 1,
    order: 1
  }));
  return { atoms: [...positioned.atoms, ...atoms], bonds: [...positioned.bonds, ...bonds] };
}

export function mountStructureEditor(container) {
  if (!container) return null;
  container.innerHTML = structureEditorMarkup();
  const canvas = container.querySelector(".chem-editor-canvas");
  const text = container.querySelector(".chem-structure-text");
  const status = container.querySelector(".chem-editor-status");
  let graph = { atoms: [], bonds: [] };
  let selected = [];
  let activeAtom = "C";
  let activeMode = "add";
  let activeBond = 1;
  let source = "";
  let parseError = "";
  let dragging = null;
  const atomById = id => graph.atoms.find(a => a.id === id);
  const tell = message => { status.textContent = message; };
  const serialize = () => {
    if (!graph.atoms.length) return "";
    const nodes = graph.atoms;
    const adjacency = nodes.map(() => []);
    graph.bonds.forEach(b => { adjacency[b.a].push({ id: b.b, order: b.order }); adjacency[b.b].push({ id: b.a, order: b.order }); });
    const visited = new Set();
    const treeEdges = new Set();
    const ringEdges = [];
    const walk = (id, parent) => {
      visited.add(id);
      for (const edge of adjacency[id]) {
        if (edge.id === parent) continue;
        const key = bondKey(id, edge.id);
        if (!visited.has(edge.id)) { treeEdges.add(key); walk(edge.id, id); }
        else if (!treeEdges.has(key) && !ringEdges.some(r => r.key === key)) ringEdges.push({ key, a: id, b: edge.id, order: edge.order });
      }
    };
    const roots = [];
    for (let id = 0; id < nodes.length; id++) {
      if (!visited.has(id)) {
        roots.push(id);
        walk(id, -1);
      }
    }
    let ringNumber = 1;
    const rings = nodes.map(() => []);
    ringEdges.forEach(r => {
      rings[r.a].push(`${r.order === 1 ? "" : r.order === 2 ? "=" : "#"}${ringNumber}`);
      rings[r.b].push(`${r.order === 1 ? "" : r.order === 2 ? "=" : "#"}${ringNumber}`);
      ringNumber++;
    });
    const build = (id, parent) => {
      const atom = nodes[id];
      const label = atom.aromatic && atom.element === "C" ? "c" : atom.element;
      const children = adjacency[id].filter(edge => edge.id !== parent && treeEdges.has(bondKey(id, edge.id)));
      const bondText = order => order === 1 ? "" : order === 2 ? "=" : "#";
      let result = label + rings[id].join("");
      children.forEach((child, index) => {
        const nested = bondText(child.order) + build(child.id, id);
        result += index < children.length - 1 ? `(${nested})` : nested;
      });
      return result;
    };
    return roots.map(root => build(root, -1)).join(".");
  };
  const render = () => {
    if (!graph.atoms.length) {
      canvas.innerHTML = `<text x="600" y="300" text-anchor="middle" class="chem-editor-empty">برای افزودن اتم، روی صفحه بزن</text>`;
      return;
    }
    const positioned = layoutEditorGraph(graph);
    const atomRadius = 17;
    const bonds = positioned.bonds.map(b => {
      const a = positioned.atoms[b.a], c = positioned.atoms[b.b];
      if (!a || !c) return "";
      return clippedBondLines(a, c, b.order, atomRadius, atomRadius);
    }).join("");
    const atoms = positioned.atoms.map(atom => `<g class="chem-editor-atom ${selected.includes(atom.id) ? "is-selected" : ""}" data-atom-id="${atom.id}" aria-pressed="${selected.includes(atom.id)}" tabindex="0" role="button" aria-label="اتم ${atom.element}"><circle class="atom-hit-area" cx="${atom.x}" cy="${atom.y}" r="31"></circle><circle class="atom-visible" cx="${atom.x}" cy="${atom.y}" r="${atomRadius}"></circle><text x="${atom.x}" y="${atom.y + 5}" text-anchor="middle">${escapeHtml(atom.element)}</text></g>`).join("");
    canvas.innerHTML = `<g class="chem-editor-bonds">${bonds}</g><g class="chem-editor-atoms">${atoms}</g>`;
  };
  const syncText = () => {
    text.value = serialize();
    source = "draw";
    parseError = "";
  };
  const updateSelectedTools = () => {
    container.querySelectorAll("[data-atom]").forEach(button => {
      const active = button.dataset.atom === activeAtom && activeMode === "add";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const selectButton = container.querySelector("[data-editor-mode=select]");
    selectButton.classList.toggle("is-active", activeMode === "select");
    selectButton.setAttribute("aria-pressed", String(activeMode === "select"));
    container.querySelectorAll("[data-bond]").forEach(button => button.classList.toggle("is-active", Number(button.dataset.bond) === activeBond));
  };
  container.querySelector("[data-editor-mode=select]").addEventListener("click", () => {
    activeMode = "select";
    updateSelectedTools();
    tell("حالت انتخاب فعال شد؛ دو اتم موجود را انتخاب کن، سپس نوع پیوند را بزن.");
  });
  container.querySelectorAll("[data-atom]").forEach(button => button.addEventListener("click", () => {
    activeAtom = button.dataset.atom;
    activeMode = "add";
    updateSelectedTools();
    tell(`حالت افزودن فعال شد؛ برای افزودن اتم ${activeAtom} روی فضای خالی بزن.`);
  }));
  container.querySelectorAll("[data-editor-fragment]").forEach(button => button.addEventListener("click", () => {
    const count = Number(button.dataset.editorFragment);
    const next = appendEditorCarbonFragment(graph, count, 1200, 600);
    if (!next) {
      tell(graph.atoms.length + count > 18
        ? "حداکثر ۱۸ اتم قابل رسم است؛ برای افزودن قطعهٔ جدید ابتدا چند اتم را حذف کن."
        : "فضای خالی کافی برای این زنجیره پیدا نشد؛ چند اتم را جابه‌جا کن و دوباره امتحان کن.");
      return;
    }
    graph = next;
    selected = [];
    activeMode = "add";
    updateSelectedTools();
    render();
    syncText();
    tell(`قطعهٔ ${button.dataset.fragmentLabel} اضافه شد؛ برای اتصال آن به بقیهٔ ساختار، دو اتم را با ابزار انتخاب انتخاب کن و پیوند را بزن.`);
  }));
  container.querySelectorAll("[data-bond]").forEach(button => button.addEventListener("click", () => {
    activeBond = Number(button.dataset.bond);
    updateSelectedTools();
    if (selected.length === 2) {
      const [a, b] = selected;
      const found = graph.bonds.find(edge => bondKey(edge.a, edge.b) === bondKey(a, b));
      if (found) found.order = activeBond;
      else graph.bonds.push({ a, b, order: activeBond });
      selected = [];
      render(); syncText();
      tell("پیوند ثبت شد.");
    } else tell("دو اتم را انتخاب کن و سپس نوع پیوند را بزن.");
  }));
  container.querySelector("[data-editor-action=delete]").addEventListener("click", () => {
    if (!selected.length) return tell("ابتدا یک اتم را انتخاب کن.");
    const removing = new Set(selected);
    const kept = graph.atoms.filter(a => !removing.has(a.id));
    const map = new Map(kept.map((a, i) => [a.id, i]));
    graph = { atoms: kept.map((a, id) => ({ ...a, id })), bonds: graph.bonds.filter(b => map.has(b.a) && map.has(b.b)).map(b => ({ a: map.get(b.a), b: map.get(b.b), order: b.order })) };
    selected = []; render(); syncText(); tell("اتم انتخاب‌شده حذف شد.");
  });
  container.querySelector("[data-editor-action=clear]").addEventListener("click", () => {
    graph = { atoms: [], bonds: [] }; selected = []; source = ""; text.value = ""; parseError = ""; render(); tell("صفحه پاک شد.");
  });
  canvas.addEventListener("click", event => {
    if (event.target.closest("[data-atom-id]")) return;
    if (activeMode !== "add") {
      if (selected.length) { selected = []; render(); }
      tell("برای انتخاب پیوند، روی دو اتم موجود بزن.");
      return;
    }
    if (graph.atoms.length >= 18) return tell("برای جلوگیری از شلوغی، حداکثر ۱۸ اتم قابل افزودن است.");
    const point = canvas.createSVGPoint();
    point.x = event.clientX; point.y = event.clientY;
    const local = point.matrixTransform(canvas.getScreenCTM().inverse());
    const id = graph.atoms.reduce((max, atom) => Math.max(max, atom.id), -1) + 1;
    graph.atoms.push({ id, element: activeAtom, aromatic: false, x: Math.max(32, Math.min(1168, local.x)), y: Math.max(32, Math.min(568, local.y)) });
    selected = [];
    render(); syncText();
    tell(`اتم ${activeAtom} اضافه شد؛ برای اتصال اتم‌ها ابزار انتخاب را بزن.`);
  });
  const selectAtom = id => {
    if (selected.includes(id)) selected = selected.filter(x => x !== id);
    else if (selected.length < 2) selected.push(id);
    else selected = [id];
    canvas.querySelectorAll("[data-atom-id]").forEach(node => {
      const active = selected.includes(Number(node.dataset.atomId));
      node.classList.toggle("is-selected", active);
      node.setAttribute("aria-pressed", String(active));
    });
    if (selected.length === 2) tell("دو اتم موجود انتخاب شدند؛ نوع پیوند را برای اتصال یا تغییر پیوند بزن.");
    else tell(selected.length ? "اتم اول انتخاب شد؛ اتم دوم را انتخاب کن." : "انتخاب اتم لغو شد.");
  };
  canvas.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const node = event.target.closest("[data-atom-id]");
    if (!node) return;
    event.preventDefault();
    selectAtom(Number(node.dataset.atomId));
  });
  let dragOffset = { x: 0, y: 0 };
  const canvasPoint = event => {
    const point = canvas.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(canvas.getScreenCTM().inverse());
  };
  const finishDrag = () => {
    if (dragging === null) return;
    dragging = null;
    syncText();
    tell("موقعیت اتم جابه‌جا شد.");
  };
  canvas.addEventListener("pointerdown", event => {
    const node = event.target.closest("[data-atom-id]");
    if (!node || event.button !== 0) return;
    if (activeMode === "select") {
      event.preventDefault();
      selectAtom(Number(node.dataset.atomId));
      return;
    }
    const atom = atomById(Number(node.dataset.atomId));
    if (!atom) return;
    event.preventDefault();
    const point = canvasPoint(event);
    dragging = atom.id;
    dragOffset = { x: atom.x - point.x, y: atom.y - point.y };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });
  canvas.addEventListener("pointermove", event => {
    if (dragging === null) return;
    const point = canvasPoint(event);
    const atom = atomById(dragging);
    if (atom) {
      atom.x = Math.max(32, Math.min(1168, point.x + dragOffset.x));
      atom.y = Math.max(32, Math.min(568, point.y + dragOffset.y));
      render();
    }
  });
  canvas.addEventListener("pointerup", () => {
    if (dragging === null) return;
    finishDrag();
    canvas.classList.remove("is-dragging");
  });
  canvas.addEventListener("pointercancel", () => {
    finishDrag();
    canvas.classList.remove("is-dragging");
  });
  canvas.addEventListener("lostpointercapture", () => {
    finishDrag();
    canvas.classList.remove("is-dragging");
  });
  text.addEventListener("input", () => {
    source = "text";
    const parsed = parseStructure(text.value);
    if (!parsed) { parseError = "ساختار متنی قابل تشخیص نیست؛ از الگوی راهنما استفاده کن."; tell(parseError); return; }
    if (parsed.atoms.length > 18) { parseError = "حداکثر ۱۸ اتم مجاز است."; tell(parseError); return; }
    graph = layoutEditorGraph(parsed); selected = []; parseError = ""; render(); tell("پیش‌نمایش ساختار به‌روز شد.");
  });
  return {
    getValue: () => ({ graph: source && !parseError ? graph : null, text: text.value, source, error: parseError }),
    setDisabled: disabled => {
      container.querySelectorAll("button,textarea").forEach(element => { element.disabled = !!disabled; });
      canvas.style.pointerEvents = disabled ? "none" : "auto";
    },
    destroy: () => { container.innerHTML = ""; }
  };
}
