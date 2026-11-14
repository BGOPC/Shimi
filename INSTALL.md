# Shimi — Organic chemistry quiz update

This package adds the organic-chemistry modules to the existing Vite application without replacing its quiz lifecycle. The existing timer, score counters, retry queue, summary percentage, elapsed time, and missed-answer review remain in `src/app.js` and are reused by every new question type.

## File placement

Copy these new source files into the corresponding folders in the project:

| Package file | Destination in Shimi | Status |
|---|---|---|
| `src/chemistry.js` | `src/chemistry.js` | New file |
| `src/chemistry.css` | `src/chemistry.css` | New file |
| `tests/chemistry.test.mjs` | `tests/chemistry.test.mjs` | New test file |
| `apply-patch.mjs` | `apply-patch.mjs` (project root) | New installer script |
| `.github/workflows/verify-organic-chemistry.yml` | `.github/workflows/verify-organic-chemistry.yml` | Optional GitHub Actions check |

Then, from the project root, run:

```bash
node apply-patch.mjs
```

The installer updates the following existing files:

| Existing file | Change |
|---|---|
| `src/app.js` | Registers chemistry question types, renders structure/multi-select/choice fields, and connects new quiz modes to the existing quiz/timer/result engine |
| `index.html` | Adds the three organic-chemistry settings cards and the organic-chemistry options to the existing mixed quiz |

No changes are required to `style.css`, `src/main.js`, `package.json`, or the existing data modules. The new stylesheet is imported by `src/app.js`. No third-party runtime dependency is added.

The installer checks all expected source anchors before writing either existing file. If a marker is missing, it stops instead of applying a partial patch. It also refuses to apply a second time if the chemistry integration is already present. Make a normal backup or commit of your project before applying it, as with any source update.

The workflow file is optional. Copy it only if you want GitHub Actions to run the chemistry tests and production build on each pull request. It does not replace or modify your existing deployment workflow.

## Tests and build

Run the chemistry tests with:

```bash
node --test tests/chemistry.test.mjs
```

Then run the project's normal production build:

```bash
npm ci
npm run build
```

## Structure editor text notation

The text input is a compact, SMILES-like notation, not a general chemical-formula parser. Use atom symbols `C`, `O`, `N`, `H`, or `R`; `R` represents the rest of a carbon chain/substituent. Use `-`, `=`, and `#` for single, double, and triple bonds. Parentheses represent branches; matching digits close a ring.

Examples:

```text
C-C-C
C-C(=O)-O
C-C-O
H-C(=O)-R
R-C(=O)-R
R-O-H
R-O-R
C-C(=O)-O-H
R-N-R
R-C(=O)-N
C1=CC=CC=C1
```

The live SVG preview updates while the text is typed. Drawing atoms/bonds updates the text notation as well. Either the drawing or the text field can be used; both are not required.

## Included question sets

- Hydrocarbons: unbranched chains, branched chains, alkenes, alkynes, cyclic structures, and an automatic benzene/aromatic recognition question whenever cyclic structures are enabled. Chain lengths and parent chains are kept within the requested 1–10 carbon range.
- Display styles for structure-to-name questions: line-angle/skeletal, structural without displayed hydrogens, or hydrogens shown as atom labels such as `CH₃`. Multiple styles can be enabled together.
- Functional groups: aldehyde, carbonyl/ketone, hydroxyl/alcohol, ether, carboxyl, ester, amine, and amide.
- Comprehensive organic chemistry: name and functional-group identification, including hydrocarbon examples and compounds containing multiple functional groups.

For overlapping functional-group patterns, the answer key treats carboxyl, ester, and amide as the more specific groups rather than also counting the embedded hydroxyl/carbonyl/ether/amine patterns.
