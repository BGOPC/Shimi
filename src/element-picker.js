import { toFa } from "./data/constants.js";

const periodOf = atomicNumber => {
  if (atomicNumber <= 2) return 1;
  if (atomicNumber <= 10) return 2;
  if (atomicNumber <= 18) return 3;
  if (atomicNumber <= 36) return 4;
  if (atomicNumber <= 54) return 5;
  return 6;
};

export const createElementPicker = ({ anchor, elements, initialSelected, onChange = () => {} }) => {
  if (!anchor || !Array.isArray(elements)) {
    throw new Error("Element picker needs an anchor and an element list.");
  }

  const validNumbers = new Set(elements.map(element => element.z));
  const selected = new Set((Array.isArray(initialSelected) ? initialSelected : [...validNumbers]).filter(z => validNumbers.has(z)));
  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "element-picker-launcher";
  launcher.textContent = "انتخاب دستی عناصر جدول";
  launcher.setAttribute("aria-haspopup", "dialog");
  anchor.insertAdjacentElement("afterend", launcher);

  const note = document.createElement("span");
  note.className = "element-picker-note";
  note.textContent = "با فعال‌کردن گزینهٔ «انتخاب دستی عناصر»، عناصر روشن مستقل از دسته‌های دیگر به آزمون اضافه می‌شوند.";
  launcher.insertAdjacentElement("afterend", note);

  const dialog = document.createElement("dialog");
  dialog.className = "element-picker-dialog";
  dialog.id = "element-picker-dialog";
  launcher.setAttribute("aria-controls", dialog.id);
  dialog.setAttribute("aria-labelledby", "ep-title");

  const header = document.createElement("div");
  header.className = "ep-header";
  header.innerHTML = `
    <div class="ep-heading">
      <h2 id="ep-title">انتخاب عناصر جدول</h2>
      <p>برای افزودن یا حذف هر عنصر، روی خانهٔ آن بزن.</p>
    </div>
    <button class="ep-close" type="button" aria-label="بستن">×</button>
  `;

  const toolbar = document.createElement("div");
  toolbar.className = "ep-toolbar";
  toolbar.innerHTML = `
    <button type="button" data-ep-action="all">انتخاب همه</button>
    <button type="button" data-ep-action="none">حذف انتخاب همه</button>
    <span class="ep-count" aria-live="polite"></span>
  `;

  const scroll = document.createElement("div");
  scroll.className = "ep-table-scroll";
  const table = document.createElement("div");
  table.className = "ep-periodic-table";

  const buttons = new Map();
  elements.forEach(element => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ep-element";
    button.style.gridColumn = String(element.groups[0]);
    button.style.gridRow = String(periodOf(element.z));
    button.dataset.atomicNumber = String(element.z);
    button.title = `${toFa(element.z)} — ${element.n[0]} (${element.s})`;
    button.setAttribute("aria-label", `${element.n[0]}، عدد اتمی ${toFa(element.z)}`);
    button.innerHTML = `<span class="ep-element-number">${toFa(element.z)}</span><strong class="ep-element-symbol">${element.s}</strong><span class="ep-element-name">${element.n[0]}</span>`;
    button.addEventListener("click", () => {
      if (selected.has(element.z)) selected.delete(element.z);
      else selected.add(element.z);
      sync();
    });
    buttons.set(element.z, button);
    table.append(button);
  });

  scroll.append(table);
  const footer = document.createElement("div");
  footer.className = "ep-footer";
  footer.innerHTML = `<button class="ep-done" type="button">بستن</button>`;
  dialog.append(header, toolbar, scroll, footer);
  document.body.append(dialog);

  const count = toolbar.querySelector(".ep-count");
  const sync = () => {
    buttons.forEach((button, z) => {
      const isSelected = selected.has(z);
      button.setAttribute("aria-pressed", String(isSelected));
    });
    count.textContent = `${toFa(selected.size)} از ${toFa(elements.length)} عنصر انتخاب شده`;
    onChange([...selected].sort((a, b) => a - b));
  };

  toolbar.querySelector('[data-ep-action="all"]').addEventListener("click", () => {
    elements.forEach(element => selected.add(element.z));
    sync();
  });
  toolbar.querySelector('[data-ep-action="none"]').addEventListener("click", () => {
    selected.clear();
    sync();
  });

  const close = () => dialog.close();
  launcher.addEventListener("click", () => dialog.showModal());
  header.querySelector(".ep-close").addEventListener("click", close);
  footer.querySelector(".ep-done").addEventListener("click", close);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) close();
  });

  sync();

  return {
    getSelected: () => [...selected].sort((a, b) => a - b),
    open: () => dialog.showModal()
  };
};
