
const mobileAccordionQuery = window.matchMedia("(max-width: 760px)");
const accordionCards = [...document.querySelectorAll("[data-mobile-accordion]")];

function setExpanded(card, expanded) {
  const toggle = card.querySelector(".mobile-card-toggle");
  card.classList.toggle("is-expanded", expanded);
  toggle.setAttribute("aria-expanded", String(expanded));
}

function syncAccordionForViewport() {
  if (mobileAccordionQuery.matches) {
    // Keep the phone layout compact on initial load and whenever entering the breakpoint.
    accordionCards.forEach((card) => setExpanded(card, false));
  } else {
    // On wider layouts all content is visible; the mobile-only toggles are hidden by CSS.
    accordionCards.forEach((card) => {
      card.classList.remove("is-expanded");
      card.querySelector(".mobile-card-toggle").setAttribute("aria-expanded", "true");
    });
  }
}

accordionCards.forEach((card) => {
  const toggle = card.querySelector(".mobile-card-toggle");
  toggle.addEventListener("click", () => {
    if (!mobileAccordionQuery.matches) return;

    const shouldExpand = !card.classList.contains("is-expanded");

    // Only one quiz section can be expanded at a time.
    accordionCards.forEach((otherCard) => setExpanded(otherCard, false));

    if (shouldExpand) setExpanded(card, true);
  });
});

syncAccordionForViewport();
mobileAccordionQuery.addEventListener("change", syncAccordionForViewport);
